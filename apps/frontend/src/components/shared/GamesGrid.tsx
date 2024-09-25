import { games } from "@/data/gamesData";

const GamesGrid = () => (
  <section className="container mx-auto py-8">
    <h2 className="text-2xl font-bold mb-4 text-white">ALL GAMES</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {games.map((game) => (
        <div key={game.name} className="bg-gray-800 rounded-lg p-4 text-center h-96">
          <img src={game.image} alt={game.name} className="w-full h-80 object-cover rounded-md mb-2" />
          <p className="text-sm text-white">{game.name}</p>
        </div>
      ))}
    </div>
  </section>
);
export default GamesGrid;
