import TournamentAdminDashboard from "@/components/shared/Tournadmin"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-8">Tournament Admin Dashboard</h1>
        <TournamentAdminDashboard />
      </div>
    </main>
  );
}
