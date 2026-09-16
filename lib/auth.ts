import "server-only";

import { createHash, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { getSql } from "./db";
import type { MemberUser } from "./member-types";

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE = "vanta_session";
const SESSION_DAYS = 30;

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  password_salt: string;
};

function tokenDigest(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function passwordDigest(password: string, salt: string) {
  return (await scrypt(password, salt, 64)) as Buffer;
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = await passwordDigest(password, salt);
  return { salt, hash: hash.toString("hex") };
}

export async function verifyPassword(password: string, salt: string, storedHash: string) {
  const expected = Buffer.from(storedHash, "hex");
  const actual = await passwordDigest(password, salt);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function findUserByEmail(email: string) {
  const sql = getSql();
  const rows = await sql<UserRow[]>`
    SELECT id, name, email, password_hash, password_salt
    FROM vanta_users
    WHERE email = ${email.toLowerCase()}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function createUser(name: string, email: string, password: string) {
  const sql = getSql();
  const id = randomUUID();
  const { salt, hash } = await hashPassword(password);
  const rows = await sql<UserRow[]>`
    INSERT INTO vanta_users (id, name, email, password_hash, password_salt)
    VALUES (${id}, ${name}, ${email.toLowerCase()}, ${hash}, ${salt})
    RETURNING id, name, email, password_hash, password_salt
  `;
  return rows[0];
}

export async function createSession(userId: string) {
  const sql = getSql();
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await sql`
    INSERT INTO vanta_sessions (token_hash, user_id, expires_at)
    VALUES (${tokenDigest(token)}, ${userId}, ${expiresAt})
  `;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    priority: "high",
  });
}

export async function destroySession() {
  const sql = getSql();
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) await sql`DELETE FROM vanta_sessions WHERE token_hash = ${tokenDigest(token)}`;
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<MemberUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const sql = getSql();

  const rows = await sql<MemberUser[]>`
    SELECT users.id, users.name, users.email
    FROM vanta_sessions sessions
    JOIN vanta_users users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ${tokenDigest(token)}
      AND sessions.expires_at > NOW()
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function requireCurrentUser() {
  return getCurrentUser();
}
