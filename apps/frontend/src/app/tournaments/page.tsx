import TournamentAdminDashboard from "@/components/shared/Tournuser";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-8">Tournament Dashboard</h1>
        <TournamentAdminDashboard />
      </div>
    </main>
  );
}
