import GridPattern from "@/components/shared/gridLines";

export default function LandingAccentGridPatterns() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative -z-10 mx-auto my-5 max-w-[1440px]"
    >
      <GridPattern className="absolute left-0 top-10 h-[519.2px] w-[649px] opacity-40" />
      <GridPattern className="absolute left-[930px] top-10 h-[519.2px] w-[649px] opacity-40" />
    </div>
  );
}
