"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Header = ({ enabled, card }: { enabled: boolean; card: string }) => {
  const router = useRouter();
  // console.log("Valo data", valoData);

  const handleNavigate = () => {
    router.push("/premium");
  };

  const handleNavigateprofile = () => {
    router.push("/dashboard");
  };

  return (
    <header className="bg-gray-800 p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-white">QILIN</div>
        <nav className="hidden md:flex space-x-4">
          {["Home", "Payment"].map((item) => (
            <a key={item} href="#" className="hover:text-gray-300 text-white">
              {item}
            </a>
          ))}
          <a href="/new-dashboard" className="hover:text-gray-300 text-white">
            Matchmaking
          </a>
        </nav>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleNavigate}
            variant="outline"
            className="bg-yellow-500 text-white"
          >
            Get Premium
          </Button>
          <div
            onClick={handleNavigateprofile}
            className={`w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold ${!enabled ? "cursor-pointer" : "hidden"}`}
          >
            <img src={card ? card : ""} alt="" className="rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
