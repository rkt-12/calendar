export default function Home() {
  return (
    <main
      style={{ backgroundColor: "var(--bg)" }}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="calendar-card p-8 text-center max-w-sm w-full mx-4">
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            color: "var(--text-primary)",
          }}
          className="text-3xl font-bold mb-2"
        >
          Wall Calendar
        </h1>
        <p style={{ color: "var(--text-secondary)" }} className="text-sm">
          Theme variables 
        </p>
        <div
          className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: "var(--accent)" }}
        >
          Accent color
        </div>
      </div>
    </main>
  );
}