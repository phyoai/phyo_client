import Image from "next/image";

import Navbar from "@/app/landing/components/Navbar";
import Footer from "@/app/landing/components/Footer";
import LandingAccentGridPatterns from "@/components/shared/LandingAccentGridPatterns";
import LandingHeroBackground from "@/components/shared/LandingHeroBackground";
import MilestoneCards from "@/components/shared/MilestoneCards";
import StackingTestimonials from "@/components/shared/Testimonial";

const trustedClientLogos = [
  "/testimonials/376c5df65f4b4cc0791e6b040c66cb8c336960c0.svg",
  "/testimonials/376c5df65f4b4cc0791e6b040c66cb8c336960c0.svg",
  "/testimonials/376c5df65f4b4cc0791e6b040c66cb8c336960c0.svg",
  "/testimonials/376c5df65f4b4cc0791e6b040c66cb8c336960c0.svg",
  "/testimonials/e849b9039f14382b6677e086e9f679201ba56f7e.svg",
  "/testimonials/e849b9039f14382b6677e086e9f679201ba56f7e.svg",
  "/testimonials/e849b9039f14382b6677e086e9f679201ba56f7e.svg",
  "/testimonials/e849b9039f14382b6677e086e9f679201ba56f7e.svg",
  "/testimonials/e849b9039f14382b6677e086e9f679201ba56f7e.svg",
  "/testimonials/e849b9039f14382b6677e086e9f679201ba56f7e.svg",
];

const voiceQuote =
  "Su is absolutely lovely and so down-to-earth. She makes you feel comfortable the moment you walk in and really takes the time to look after her clients.";

function CenteredHeading({
  prefix,
  highlight,
  description,
}: {
  prefix: string;
  highlight: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-[900px] text-center">
      <h2 className="font-bricolage text-[34px] leading-[1.2] text-white sm:text-[36px]">
        {prefix}
        <span className="text-[#16a34a]">{highlight}</span>
      </h2>
      <p className="mt-4 text-[16px] leading-[1.6] text-[#9b9b9b]">
        {description}
      </p>
    </div>
  );
}

function VoiceCard() {
  return (
    <article className="relative min-h-[220px] overflow-hidden rounded-[23px] bg-[#141414] px-8 pb-5 pt-5">
      <div className="pointer-events-none absolute left-8 top-10 h-20 w-px bg-[#16a34a]" />

      <div className="pb-10 pl-5 pr-2">
        <div
          className="mt-3 border-transparent border-white/10 pt-3"
        >
          <p className="text-[16px] leading-[1.6] text-[#9b9b9b]">
            {voiceQuote}
          </p>
        </div>
      </div>

      <div className="absolute bottom-5 left-8 flex items-center gap-3">
        <Image
          src="/testimonials/3b6ba158a5108cf82e25ea2b14ff7977c8903884.png"
          alt="Client profile"
          width={60}
          height={60}
          className="h-[60px] w-[60px] rounded-full object-cover"
        />
        <div className="capitalize leading-[1.4]">
          <p className="font-medium text-[#16a34a]">Maria S.</p>
          <p className="text-[16px] text-[#9b9b9b]">London</p>
        </div>
      </div>

      <Image
        src="/testimonials/8df8b1f22c3e4ad954aaaed80f663c1460625f09.svg"
        alt=""
        width={118}
        height={92}
        className="pointer-events-none absolute bottom-5 right-5 opacity-70"
      />
    </article>
  );
}

export default function TestimonialsPage() {
  return (
    <div
      id="home"
      className="relative isolate bg-[#050505] font-inter text-white"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <LandingHeroBackground />

      <div className="relative z-10">
        <Navbar />

        <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[120px]">
          <section className="pt-14 lg:pt-20">
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,514px)_minmax(0,560px)] lg:justify-between lg:gap-[126px]">
              <h1 className="bg-[linear-gradient(94.6421deg,#16a34a_3.4033%,#ffffff_57.976%,#16a34a_97.641%)] bg-clip-text font-bricolage text-[44px] leading-[1.2] text-transparent sm:text-[50px] lg:text-[56px]">
                World&apos;s First AI Powered Influencer
                <br />
                Search Engine
              </h1>

              <p className="text-[16px] leading-[1.6] text-[#9b9b9b]">
                It Has Survived Not Only Five Centuries, But Also The Leap Into
                Electronic Typesetting, Remaining Essentially Unchanged. It Was
                Popularised In The 1960s With The Release Of Letraset Sheets
                Containing Lorem Ipsum Passages, And More Recently With Desktop
                Publishing Software Like Aldus PageMaker Including Versions Of
                Lorem Ipsum.
              </p>
            </div>

            <MilestoneCards />
            <LandingAccentGridPatterns />
          </section>

          {/* <section className="">
            <CenteredHeading
              prefix="Our Trusted "
              highlight="Clients"
              description="It Was Popularised In The 1960s With The Release Of Letraset Sheets Containing Lorem Ipsum Passages, And More Recently With Desktop Publishing Software Like Aldus PageMaker Including Versions Of Lorem Ipsum."
            />

            <div className="relative mt-10 overflow-hidden w-full">
              <div className="flex min-w-max items-center gap-[55px]">
                {trustedClientLogos.map((logo, index) => (
                  <Image
                    key={`top-${index}`}
                    src={logo}
                    alt="Trusted client"
                    width={124}
                    height={32}
                    className="h-8 w-auto opacity-60"
                  />
                ))}
              </div>
              <div className="mt-[53px] flex min-w-max items-center gap-[55px] px-0">
                {trustedClientLogos.map((logo, index) => (
                  <Image
                    key={`bottom-${index}`}
                    src={logo}
                    alt="Trusted client"
                    width={124}
                    height={32}
                    className="h-8 w-auto opacity-70"
                  />
                ))}
              </div>

              <div className="pointer-events-none absolute inset-y-0 left-0 w-[220px] bg-gradient-to-r from-black via-black/75 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-[220px] bg-gradient-to-l from-black via-black/75 to-transparent" />
            </div>
          </section> */}
          <section>
            <CenteredHeading
              prefix="Our Trusted "
              highlight="Clients"
              description="It Was Popularised In The 1960s With The Release Of Letraset Sheets Containing Lorem Ipsum Passages, And More Recently With Desktop Publishing Software Like Aldus PageMaker Including Versions Of Lorem Ipsum."
            />

            <div className="relative mt-10 w-full overflow-hidden">
              {/* First Row: Left to Right */}
              <div className="overflow-hidden">
                <div className="client-marquee-ltr flex w-max items-center gap-[55px]">
                  {[...trustedClientLogos, ...trustedClientLogos].map((logo, index) => (
                    <Image
                      key={`top-${index}`}
                      src={logo}
                      alt="Trusted client"
                      width={124}
                      height={32}
                      className="h-8 w-auto shrink-0 opacity-60"
                    />
                  ))}
                </div>
              </div>

              {/* Second Row: Right to Left */}
              <div className="mt-[53px] overflow-hidden">
                <div className="client-marquee-rtl flex w-max items-center gap-[55px]">
                  {[...trustedClientLogos, ...trustedClientLogos].map((logo, index) => (
                    <Image
                      key={`bottom-${index}`}
                      src={logo}
                      alt="Trusted client"
                      width={124}
                      height={32}
                      className="h-8 w-auto shrink-0 opacity-70"
                    />
                  ))}
                </div>
              </div>

              <div className="pointer-events-none absolute inset-y-0 left-0 w-[220px] bg-gradient-to-r from-black via-black/75 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-[220px] bg-gradient-to-l from-black via-black/75 to-transparent" />
            </div>

            <style>{`
    @keyframes clientMarqueeRTL {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(-50%);
      }
    }

    @keyframes clientMarqueeLTR {
      from {
        transform: translateX(-50%);
      }
      to {
        transform: translateX(0);
      }
    }

    .client-marquee-rtl {
      animation: clientMarqueeRTL 45s linear infinite;
    }

    .client-marquee-ltr {
      animation: clientMarqueeLTR 45s linear infinite;
    }

    .client-marquee-rtl:hover,
    .client-marquee-ltr:hover {
      animation-play-state: paused;
    }
  `}</style>
          </section>

<section
  id="testimonials"
  className="relative bg-[#050505] py-16 pb-[400px] lg:py-20 lg:pb-[460px]"
>
  {/* Sticky heading */}
  <div className="sticky top-20 z-30 mb-16 bg-[#050505] pb-6">
    <CenteredHeading
      prefix="Voices That "
      highlight="Trust Us"
      description="It Was Popularised In The 1960s With The Release Of Letraset Sheets Containing Lorem Ipsum Passages, And More Recently With Desktop Publishing Software Like Aldus PageMaker Including Versions Of Lorem Ipsum."
    />
  </div>

  {/* Cards */}
  <div className="relative z-20 grid items-start justify-items-center gap-5 lg:grid-cols-2 lg:gap-8 top-[30px] ">
    <StackingTestimonials />
    <StackingTestimonials />
  </div>
</section>


        </main>

        <Footer />
      </div>
    </div>
  );
}
