import "server-only";

import { randomUUID } from "node:crypto";
import { getSql } from "./db";
import type { MemberProfile, PlaybackPreferences } from "./member-types";
import type { MediaItem } from "./types";

const gradients = [
  "from-red-600 via-rose-500 to-orange-400",
  "from-cyan-500 via-blue-500 to-violet-600",
  "from-amber-300 via-lime-400 to-emerald-500",
  "from-fuchsia-500 via-purple-500 to-indigo-600",
  "from-sky-400 via-cyan-500 to-teal-600",
  "from-orange-400 via-red-500 to-rose-600",
];

type ProfileRow = {
  id: string;
  name: string;
  initials: string;
  gradient: string;
  is_kids: boolean;
};

type WatchlistRow = { payload: MediaItem };
type PreferencesRow = { autoplay: boolean; previews: boolean; emails: boolean };

function toProfile(row: ProfileRow): MemberProfile {
  return {
    id: row.id,
    name: row.name,
    initials: row.initials,
    gradient: row.gradient,
    kids: row.is_kids,
  };
}

export async function getProfiles(userId: string) {
  const sql = getSql();
  const rows = await sql<ProfileRow[]>`
    SELECT id, name, initials, gradient, is_kids
    FROM vanta_profiles
    WHERE user_id = ${userId}
    ORDER BY created_at ASC
  `;
  return rows.map(toProfile);
}

export async function seedProfiles(userId: string, names: Array<{ name: string; kids?: boolean }>) {
  const sql = getSql();
  const existing = await getProfiles(userId);
  if (existing.length) return existing;

  for (const [index, entry] of names.slice(0, 5).entries()) {
    await sql`
      INSERT INTO vanta_profiles (id, user_id, name, initials, gradient, is_kids)
      VALUES (
        ${randomUUID()},
        ${userId},
        ${entry.name},
        ${entry.name.slice(0, 1).toUpperCase()},
        ${gradients[index % gradients.length]},
        ${Boolean(entry.kids)}
      )
    `;
  }
  return getProfiles(userId);
}

export async function createProfile(userId: string, name: string, kids: boolean) {
  const sql = getSql();
  const current = await getProfiles(userId);
  if (current.length >= 5) throw new Error("PROFILE_LIMIT");

  const id = randomUUID();
  const rows = await sql<ProfileRow[]>`
    INSERT INTO vanta_profiles (id, user_id, name, initials, gradient, is_kids)
    VALUES (
      ${id},
      ${userId},
      ${name},
      ${name.slice(0, 1).toUpperCase()},
      ${gradients[current.length % gradients.length]},
      ${kids}
    )
    RETURNING id, name, initials, gradient, is_kids
  `;
  const profile = rows[0];
  if (!profile) throw new Error("PROFILE_CREATE_FAILED");
  return toProfile(profile);
}

export async function updateProfile(userId: string, profileId: string, name: string, kids: boolean) {
  const sql = getSql();
  const rows = await sql<ProfileRow[]>`
    UPDATE vanta_profiles
    SET name = ${name}, initials = ${name.slice(0, 1).toUpperCase()}, is_kids = ${kids}
    WHERE id = ${profileId} AND user_id = ${userId}
    RETURNING id, name, initials, gradient, is_kids
  `;
  return rows[0] ? toProfile(rows[0]) : null;
}

export async function deleteProfile(userId: string, profileId: string) {
  const sql = getSql();
  const current = await getProfiles(userId);
  if (current.length <= 1) throw new Error("LAST_PROFILE");
  const rows = await sql<{ id: string }[]>`
    DELETE FROM vanta_profiles
    WHERE id = ${profileId} AND user_id = ${userId}
    RETURNING id
  `;
  return Boolean(rows[0]);
}

export async function ownsProfile(userId: string, profileId: string) {
  const sql = getSql();
  const rows = await sql<{ exists: boolean }[]>`
    SELECT EXISTS(
      SELECT 1 FROM vanta_profiles WHERE id = ${profileId} AND user_id = ${userId}
    ) AS exists
  `;
  return Boolean(rows[0]?.exists);
}

export async function getWatchlist(userId: string, profileId: string) {
  if (!(await ownsProfile(userId, profileId))) return null;
  const sql = getSql();
  const rows = await sql<WatchlistRow[]>`
    SELECT payload
    FROM vanta_watchlist
    WHERE profile_id = ${profileId}
    ORDER BY created_at DESC
  `;
  return rows.map((row) => row.payload);
}

export async function setWatchlistItem(userId: string, profileId: string, media: MediaItem, saved: boolean) {
  if (!(await ownsProfile(userId, profileId))) return false;
  const sql = getSql();
  const mediaKey = `${media.media_type}:${media.id}`;
  if (saved) {
    await sql`
      INSERT INTO vanta_watchlist (profile_id, media_key, payload)
      VALUES (${profileId}, ${mediaKey}, ${sql.json(media as never)})
      ON CONFLICT (profile_id, media_key)
      DO UPDATE SET payload = EXCLUDED.payload, created_at = NOW()
    `;
  } else {
    await sql`DELETE FROM vanta_watchlist WHERE profile_id = ${profileId} AND media_key = ${mediaKey}`;
  }
  return true;
}

export async function getPreferences(userId: string, profileId: string): Promise<PlaybackPreferences | null> {
  if (!(await ownsProfile(userId, profileId))) return null;
  const sql = getSql();
  const rows = await sql<PreferencesRow[]>`
    SELECT autoplay, previews, emails
    FROM vanta_preferences
    WHERE profile_id = ${profileId}
    LIMIT 1
  `;
  return rows[0] ?? { autoplay: true, previews: true, emails: false };
}

export async function savePreferences(userId: string, profileId: string, preferences: PlaybackPreferences) {
  if (!(await ownsProfile(userId, profileId))) return false;
  const sql = getSql();
  await sql`
    INSERT INTO vanta_preferences (profile_id, autoplay, previews, emails)
    VALUES (${profileId}, ${preferences.autoplay}, ${preferences.previews}, ${preferences.emails})
    ON CONFLICT (profile_id)
    DO UPDATE SET
      autoplay = EXCLUDED.autoplay,
      previews = EXCLUDED.previews,
      emails = EXCLUDED.emails,
      updated_at = NOW()
  `;
  return true;
}
