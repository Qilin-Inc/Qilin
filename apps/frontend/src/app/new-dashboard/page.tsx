import React from "react";

export const PlayerDashboard = () => {
  return (
    <div className="bg-neutral-900 text-neutral-50 min-h-screen rounded-lg shadow-lg flex">
      {/* Sidebar */}
      <aside className="w-32 bg-primary-950 flex flex-col items-center py-5 gap-4 hidden md:flex">
        <button className="w-12 h-12 rounded-full bg-primary-500 flex justify-center items-center transition duration-300 hover:scale-105">
          <span className="material-symbols-outlined text-neutral-50">
            Menu
          </span>
        </button>
        <div className="flex flex-col gap-4">
          {["Home", "Game", "Schedule", "Settings"].map(
            (icon, idx) => (
              <button
                key={idx}
                className="w-24 h-12 bg-neutral-800 rounded-md flex justify-center items-center transition duration-300 hover:bg-primary-500"
              >
                {icon}
              </button>
            )
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-primary-500 font-title text-2xl">
            Valorant LFT Matcher
          </h1>
          <div className="flex items-center gap-4">
            {[
              { points: 4500, color: "text-yellow-400" },
              { points: 3200, color: "text-red-500" },
              { points: 1400, color: "text-amber-800" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="text-center transition duration-300 hover:scale-105"
              >
                <p>{item.points}</p>
                <span className={`material-symbols-outlined ${item.color}`}>
                  star
                </span>
              </div>
            ))}
          </div>
        </header>

        {/* Main Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section */}
          <div className="flex flex-col gap-4">
            {/* Player Card */}
            <div className="bg-neutral-800 rounded-lg p-4 flex items-center transition duration-300 hover:shadow-lg">
              <img
                src="https://tools-api.webcrumbs.org/image-placeholder/80/80/avatars/1"
                width="80"
                height="80"
                className="rounded-full object-contain"
                alt="avatar"
              />
              <div className="ml-4">
                <h2 className="text-lg font-semibold">Chandan Mondal</h2>
                <p className="text-sm text-neutral-400">Top 8 player</p>
              </div>
            </div>

            {/* My Team Section */}
            <div className="bg-neutral-800 rounded-lg">
              <h3 className="p-4 text-lg font-semibold">My Team</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-neutral-700 p-4 rounded-md text-center transition duration-300 hover:bg-neutral-600"
                  >
                    <img
                      src={`https://tools-api.webcrumbs.org/image-placeholder/60/60/avatars/${i + 1}`}
                      width="60"
                      height="60"
                      className="rounded-full object-contain"
                      alt={`team-${i}`}
                    />
                    <p className="mt-2 text-sm">Comando-{i + 1}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Banner */}
            <div className="bg-neutral-800 rounded-lg">
              <div
                style={{
                  width: "100%",
                  height: "300px",
                  backgroundImage:
                    "url(https://tools-api.webcrumbs.org/image-placeholder/800/400/nature/1)",
                  backgroundSize: "cover",
                }}
                className="rounded-lg transition duration-300 hover:scale-105"
              ></div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Rankings */}
            <div className="bg-neutral-800 rounded-lg p-6 text-center transition duration-300 hover:shadow-lg">
              <h4 className="font-bold">Ranking</h4>
              <ul className="divide-y divide-neutral-700 mt-4">
                {[...Array(4)].map((_, i) => (
                  <li
                    key={i}
                    className="py-2 flex justify-between transition duration-300 hover:bg-neutral-700"
                  >
                    <span className="text-neutral-200">MR. Jon Doe</span>
                    <span className="text-primary-500">XP</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Feed */}
            <div className="bg-neutral-800 rounded-lg p-6 text-center transition duration-300 hover:shadow-lg">
              <h4 className="font-bold">Feed</h4>
              <ul className="divide-y divide-neutral-700 mt-4">
                {[...Array(4)].map((_, i) => (
                  <li
                    key={i}
                    className="py-2 flex justify-between transition duration-300 hover:bg-neutral-700"
                  >
                    <span className="text-neutral-200">MR. Jon Doe</span>
                    <span className="material-symbols-outlined text-green-500">
                      sync
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Active Players */}
            <div className="bg-neutral-800 rounded-lg p-6 text-center transition duration-300 hover:shadow-lg">
              <h4 className="font-bold">Active Player</h4>
              <div className="flex justify-center gap-2 mt-4">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={`https://tools-api.webcrumbs.org/image-placeholder/40/40/avatars/${i + 1}`}
                    width="40"
                    height="40"
                    className="rounded-full object-contain transition duration-300 hover:scale-110"
                    alt={`player-${i}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;
