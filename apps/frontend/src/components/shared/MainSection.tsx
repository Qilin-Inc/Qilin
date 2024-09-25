const MainSection = () => (
    <main className="bg-gray-900 text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">
            INSIGHT TO <span className="text-red-500">EVOLVE YOUR GAME</span> AND SO MUCH MORE.
          </h1>
          <div className="flex space-x-8">
            <div>
              <p className="text-2xl font-semibold">300M+</p>
              <p className="text-gray-400">PLAYERS TRACKED</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">25M+</p>
              <p className="text-gray-400">MATCHES PAST 24 HRS</p>
            </div>
          </div>
          <div className="space-x-4">
            <img src="/path-to-logo1.png" alt="Steelseries" className="inline-block h-8" />
            <img src="/path-to-logo2.png" alt="Overwolf" className="inline-block h-8" />
            <img src="/path-to-logo3.png" alt="Advanced" className="inline-block h-8" />
          </div>
          <div className="space-x-4">
            <a href="#" className="bg-blue-500 p-2 rounded-full">
              <i className="fab fa-twitter text-white"></i>
            </a>
            <a href="#" className="bg-indigo-500 p-2 rounded-full">
              <i className="fab fa-discord text-white"></i>
            </a>
            <a href="#" className="bg-pink-500 p-2 rounded-full">
              <i className="fab fa-instagram text-white"></i>
            </a>
          </div>
        </div>
        <div>
          {/* Optional Image or Other Content */}
        </div>
      </div>
    </main>
  );
  export default MainSection;
  