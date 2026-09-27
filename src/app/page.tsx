import LandingBackground from "@/components/landing/LandingBackground";
import LandingTopNav from "@/components/landing/LandingTopNav";
import LandingContent from "@/components/landing/LandingContent";

export default function Home() {
  return (
    <div className="bg-[#0a0a0a] min-h-[100dvh] w-full flex justify-center">
      <div className="relative min-h-[100dvh] w-full max-w-[430px] overflow-hidden flex flex-col bg-black shadow-2xl shadow-black/50 font-sans">
        <LandingBackground />
        <LandingTopNav />
        <LandingContent />
      </div>
    </div>
  );
}
