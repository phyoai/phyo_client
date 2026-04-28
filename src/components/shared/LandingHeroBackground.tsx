import Image from "next/image";

export default function LandingHeroBackground() {
  return (
    <>
      <Image
        src="/landing/header_grid_lines.svg"
        alt=""
        aria-hidden
        width={1400}
        height={550}
        className="pointer-events-none absolute inset-0 h-[550px] w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1100px]">
        <div className="absolute inset-0 grid-lines-overlay" />
        <div className="absolute left-[1038.57px] top-[-161px] h-[487.04px] w-[380.73px]">
          <div className="absolute left-1/2 top-1/2 -ml-[240px] h-[449px] w-[194px] -translate-x-1/2 -translate-y-1/2 rotate-[27.85deg]">
            <div className="absolute" style={{ inset: "-55.73% -129.14%" }}>
              <img
                src="/figma/landing/8bf76859d5c6f4da4ac2c1d3f52e99a58e026fce.svg"
                alt=""
                aria-hidden="true"
                className="block h-full w-full max-w-none"
              />
            </div>
          </div>
        </div>
        <div className="absolute left-1/2 top-[-180px] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[#0c3617]/20 blur-3xl" />
      </div>
    </>
  );
}
