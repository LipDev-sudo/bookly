export default function DemoLoading() {
  return (
    <main className="min-h-screen bg-background p-6" aria-busy="true" aria-label="Loading demo">
      <div className="mx-auto max-w-6xl animate-pulse space-y-6">
        <div className="h-12 w-48 rounded-lg bg-muted" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((item) => <div key={item} className="h-28 rounded-xl bg-muted" />)}
        </div>
        <div className="h-80 rounded-xl bg-muted" />
      </div>
    </main>
  );
}
