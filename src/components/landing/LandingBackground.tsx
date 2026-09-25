import Image from "next/image";

export default function LandingBackground() {
  return (
    <div className="absolute inset-0 z-0 animate-in fade-in zoom-in-105 duration-1000 fill-mode-both">
      <Image
        src="/hero-bg.png"
        alt="Cozy room with window"
        fill
        priority
        className="object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,_rgba(0,0,0,0.6)_0%,_transparent_50%)]" />
    </div>
  );
}
