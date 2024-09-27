import QilinBrandImage from "../../assets/Qilin_brand.jpeg"; // Imported image
import Image from 'next/image'; // Import Next.js Image component
import { Twitter, Instagram, Disc } from 'lucide-react'; // Import Lucide React icons

const MainSection = () => (
  <main className="bg-gray-900 text-white py-16">
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-6 lg:px-12">
      {/* Left Section: Text and Stats */}
      <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
        <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
          INSIGHT TO <span className="text-red-500">EVOLVE YOUR GAME</span> AND SO MUCH MORE.
        </h1>
        <div className="flex justify-center lg:justify-start space-x-8">
          <div>
            <p className="text-3xl font-bold">300M+</p>
            <p className="text-gray-400 text-sm">PLAYERS TRACKED</p>
          </div>
          <div>
            <p className="text-3xl font-bold">25M+</p>
            <p className="text-gray-400 text-sm">MATCHES PAST 24 HRS</p>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center lg:justify-start space-x-6 mt-6">
          <a href="#" className="bg-blue-500 p-3 rounded-full hover:bg-blue-600 transition flex items-center">
            <Twitter className="text-white w-6 h-6" />
            <span className="ml-2 text-sm text-white">Twitter</span>
          </a>
          <a href="#" className="bg-indigo-500 p-3 rounded-full hover:bg-indigo-600 transition flex items-center">
            <Disc className="text-white w-6 h-6" />
            <span className="ml-2 text-sm text-white">Discord</span>
          </a>
          <a href="#" className="bg-pink-500 p-3 rounded-full hover:bg-pink-600 transition flex items-center">
            <Instagram className="text-white w-6 h-6" />
            <span className="ml-2 text-sm text-white">Instagram</span>
          </a>
        </div>
      </div>

      {/* Right Section: Image */}
      <div className="relative mx-auto w-full h-64 lg:h-96 flex justify-center lg:justify-end">
        <Image
          src={QilinBrandImage}
          alt="Qilin Brand"
          className="object-cover object-center w-full h-full rounded-lg shadow-lg"
          layout="fill"
        />
      </div>
    </div>
  </main>
);

export default MainSection;
