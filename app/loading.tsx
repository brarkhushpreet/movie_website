export default function Loading() {
  return (
    <main className="min-h-screen bg-vanta-ink px-5 pb-16 pt-28 sm:px-8 lg:px-12">
      <div className="skeleton h-[58vh] min-h-[420px] w-full rounded-2xl" />
      <div className="mt-8 space-y-8">
        {Array.from({ length: 3 }).map((_, row) => (
          <section key={row}>
            <div className="skeleton mb-4 h-6 w-48 rounded" />
            <div className="flex gap-4 overflow-hidden">{Array.from({ length: 5 }).map((__, card) => <div key={card} className="skeleton aspect-video min-w-[260px] rounded-md" />)}</div>
          </section>
        ))}
      </div>
    </main>
  );
}
