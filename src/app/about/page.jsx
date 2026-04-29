import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import Navbar from "@/app/landing/components/Navbar";
import Footer from "@/app/landing/components/Footer";
import LandingAccentGridPatterns from "@/components/shared/LandingAccentGridPatterns";
import LandingHeroBackground from "@/components/shared/LandingHeroBackground";
import MilestoneCards from "@/components/shared/MilestoneCards";
import OutlineGlowButton from "@/components/shared/OutlineGlowButton";

const processSteps = [
  {
    number: "01",
    title: "Technical Guidelines",
    description:
      "With years of experience, we understand the ins and evolving design standards to technical guidelines. With years standards to technical guidelines.",
  },
  {
    number: "02",
    title: "Technical Guidelines",
    description:
      "With years of experience, we understand the ins and evolving design standards to technical guidelines. With years standards to technical guidelines.",
  },
  {
    number: "03",
    title: "Technical Guidelines",
    description:
      "With years of experience, we understand the ins and evolving design standards to technical guidelines. With years standards to technical guidelines.",
  },
];

function SectionHeading({ prefix, highlight, description }) {
  return (
    <div className="max-w-[900px]">
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

function CTAButton({
  href,
  icon,
  iconOnLeft = false,
  children,
  className = "",
}) {
  return (
    <OutlineGlowButton
      href={href}
      className={`h-12 px-7 normal-case ${className}`}
      baseSurfaceClassName="bg-transparent bg-[#0f7434]"
      glowSurfaceClassName="bg-white/10"
    >
      <span
        className={`inline-flex items-center gap-3 ${
          iconOnLeft ? "flex-row" : "flex-row-reverse"
        }`}
      >
        {icon}
        <span className="leading-[1.2]">{children}</span>
      </span>
    </OutlineGlowButton>
  );
}

function MissionCard({ title, description }) {
  return (
    <article className="relative min-h-[300px] overflow-hidden rounded-[20px] bg-[#16a34a] p-5">
      <div className="relative z-10 max-w-[248px]">
        <h3 className="font-bricolage text-[24px] leading-[1.2] text-white">
          {title}
        </h3>
        <p className="mt-3 text-[16px] leading-[1.6] text-[#e3e3e3]">
          {description}
        </p>
      </div>
      <Image
        src="/about/misson_vison.svg"
        alt=""
        aria-hidden
        width={203}
        height={154}
        className="pointer-events-none absolute bottom-0 right-0 h-[154px] w-[203px]"
      />
    </article>
  );
}

export default function AboutPage() {
  return (
    <div
      id="home"
      className="relative isolate overflow-hidden bg-[#050505] font-inter text-white"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <LandingHeroBackground />

      <div className="relative z-10">
        <Navbar />

        <main className="mx-auto max-w-[1440px] px-4 pb-20 sm:px-6 lg:px-[120px] lg:pb-24">
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

          <section id="features" className="pt-16 lg:pt-20">
            <SectionHeading
              prefix="Our "
              highlight="Goal, Mission & Vision"
              description="It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-[600px_280px_280px]">
              <article className="flex min-h-[300px] flex-col gap-4 overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#1b1c1f_0%,#17181a_100%)] p-5 md:flex-row md:items-start md:justify-between">
                <div className="max-w-[300px]">
                  <h3 className="font-bricolage text-[24px] leading-[1.2] text-white">
                    Goal
                  </h3>
                  <p className="mt-3 text-[16px] leading-[1.6] text-[#9b9b9b]">
                    From Delhi to Dubai, LA to London get access to 300k+ real
                    influencers across 15+ countries and 95+ languages.
                  </p>
                </div>

                <div className="relative h-[260px] w-[240px] shrink-0 self-end">
                  <Image
                    src="/about/card1.svg"
                    alt="Goal section visual"
                    width={240}
                    height={260}
                    className="h-[260px] w-[240px] object-contain"
                  />
                </div>
              </article>

              <MissionCard
                title="Mission"
                description="From Delhi to Dubai, LA to London get access to 300k+..."
              />
              <MissionCard
                title="Vision"
                description="From Delhi to Dubai, LA to London get access to 300k+..."
              />
            </div>
          </section>

          <section className="pt-12 lg:pt-14">
            <SectionHeading
              prefix="Steps To Excellence: "
              highlight="The Process We Follow"
              description="It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            />

            <div className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-8">
              {processSteps.map((step, index) => (
                <article key={step.number}>
                  <div className="flex items-center">
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-full text-[18px] leading-none ${
                        index === 0
                          ? "bg-[#16a34a] text-white"
                          : "bg-[#b7b7b7] text-[#5d5d5d]"
                      }`}
                    >
                      {step.number}
                    </span>
                    <div />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="326"
                      height="8"
                      viewBox="0 0 326 8"
                      fill="none"
                      className="ml-3"
                    >
                      <path
                        d="M325.354 4.03556C325.549 3.8403 325.549 3.52372 325.354 3.32845L322.172 0.146473C321.976 -0.0487893 321.66 -0.0487893 321.464 0.146473C321.269 0.341735 321.269 0.658318 321.464 0.85358L324.293 3.68201L321.464 6.51043C321.269 6.7057 321.269 7.02228 321.464 7.21754C321.66 7.4128 321.976 7.4128 322.172 7.21754L325.354 4.03556ZM0 3.68201V4.18201H325V3.68201V3.18201H0V3.68201Z"
                        fill="url(#paint0_linear_8_1872)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_8_1872"
                          x1="0"
                          y1="4.18201"
                          x2="325"
                          y2="4.18201"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.332665" stopColor="#C7C7C7" />
                          <stop offset="1" stopColor="#16A34A" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <h3 className="mt-6 font-bricolage text-[24px] leading-[1.2] text-white">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-[16px] leading-[1.6] text-[#9b9b9b]">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="pt-16 lg:pt-20">
            <SectionHeading
              prefix="Why "
              highlight="Choose Us"
              description="It Was Popularised In The 1960s With The Release Of Letraset Sheets Containing Lorem Ipsum Passages, And More Recently With Desktop Publishing Software Like Aldus PageMaker Including Versions Of Lorem Ipsum."
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              <article className="relative h-[293px] overflow-hidden rounded-[24px] bg-[#16a34a] p-5">
                <div className="max-w-[344px]">
                  <h3 className="font-bricolage text-[24px] leading-[1.2] text-white">
                    Launch Smarter Campaigns
                  </h3>
                  <p className="mt-3 text-[16px] leading-[1.6] text-[#e5e5e5]">
                    From finding the right influencers to tracking performance
                    everything you need to run high-impact campaigns in one
                    platform.
                  </p>
                </div>
                <Image
                  src="/about/why_choose_card1.svg"
                  alt="Campaign launch visual"
                  width={264}
                  height={223}
                  className="pointer-events-none absolute right-5 top-[70px] h-[223px] w-[264px]"
                />
              </article>

              <article className="relative h-[293px] overflow-hidden rounded-[24px] pt-1">
                <Image
                  src="/about/why_choose_card2_3.svg"
                  alt="Why choose us visual card"
                  width={590}
                  height={293}
                  className="pointer-events-none absolute inset-0 h-full w-full"
                />
              </article>

              <article className="relative h-[293px] overflow-hidden ">
                <Image
                  src="/about/why_choose_card2_3.svg"
                  alt="Why choose us visual card"
                  width={590}
                  height={293}
                  className="pointer-events-none absolute inset-0 h-full w-full"
                />
              </article>

              <article className="relative h-[293px] overflow-hidden rounded-[24px] bg-[#181818] p-5">
                <div className="relative z-10 max-w-[344px]">
                  <h3 className="font-bricolage text-[24px] leading-[1.2] text-white">
                    Launch Smarter Campaigns
                  </h3>
                  <p className="mt-3 text-[16px] leading-[1.6] text-[#9b9b9b]">
                    From finding the right influencers to tracking performance
                    everything you need to run high-impact campaigns in one
                    platform.
                  </p>
                </div>
                <Image
                  src="/about/why_choose_card4.svg"
                  alt="Campaign support visual"
                  width={323}
                  height={199}
                  className="pointer-events-none absolute bottom-0 right-5 h-[199px] w-[323px]"
                />
              </article>
            </div>
          </section>

          <section className="pt-16 lg:pt-20">
            <div className="relative overflow-hidden rounded-[44px] bg-[linear-gradient(108.717deg,#16a34a_1.18%,#073618_80.36%)] px-6 py-10 sm:px-8 lg:h-[500px] lg:px-0 lg:py-0">
              <div className="pointer-events-none absolute inset-0 hidden lg:block">
                <div className="absolute -right-[280px] -top-[320px] h-[980px] w-[954px] opacity-40">
                  <Image
                    src="/about/c652761e329210d5433afb2c24ab85f66ceefb21.svg"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="absolute -right-[170px] -top-[300px] h-[956px] w-[920px] opacity-40">
                  <Image
                    src="/about/239f5bb47897874755850dc940d3258518715426.svg"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="relative z-10 lg:h-full">
                <div className="max-w-[440px] lg:absolute lg:left-20 lg:top-1/2 lg:-translate-y-1/2">
                  <h2 className="font-bricolage text-[36px] leading-[1.4] text-white">
                    AI Search. Verified Influencers. Real Results.
                  </h2>
                  <p className="mt-5 text-[16px] leading-[1.6] text-[#dcdcdc]">
                    From discovery to campaign execution everything you need to
                    run high-performing influencer campaigns in one platform.
                  </p>

                  <div className="mt-10 flex flex-wrap items-center gap-5">
                    <CTAButton
                      href="/signup"
                      className="w-[240px]"
                      icon={
                        <ArrowRight className="h-[14px] w-[14px] stroke-[1.8]" />
                      }
                    >
                      Start With Free Trial
                    </CTAButton>
                    <CTAButton
                      href="/"
                      iconOnLeft
                      className="w-[180px]"
                      icon={
                        <Image
                          src="/landing/play_btn.svg"
                          alt=""
                          width={14}
                          height={14}
                          className="h-[13px] w-[13px]"
                        />
                      }
                    >
                      Watch Demo
                    </CTAButton>
                  </div>
                </div>

                <div className="pointer-events-none mt-10 flex justify-center lg:hidden">
                  <Image
                    src="/about/6376729d72436fb01b2532b7163f98fa334da9cd.png"
                    alt="Phyo product preview"
                    width={604}
                    height={769}
                    className="h-auto w-full max-w-[430px]"
                  />
                </div>

                <div className="pointer-events-none absolute right-[30px] top-[58px] hidden h-[628px] w-[520px] lg:block">
                  <img
                    src="/about/6376729d72436fb01b2532b7163f98fa334da9cd.png"
                    alt="Phyo product preview"
                    className="absolute left-[-42.9%] top-[-5.39%] h-[110.19%] w-[186.8%] max-w-none"
                  />
                </div>
              </div>
            </div>
          </section>

          <section id="testimonials" className="py-16 lg:py-20">
            <SectionHeading
              prefix="Our Core "
              highlight="Team"
              description="It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-[170px_1fr_1fr]">
                  <div className="relative h-[120px] overflow-hidden rounded-[16px] bg-[#b8b8b8]">
                    <Image
                      src="/about/team_member.png"
                      alt="Team member avatar"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <article className="relative overflow-hidden rounded-[16px] bg-[#16a34a] p-4">
                    <h3 className="font-bricolage text-[42px] leading-[1.2] text-white md:text-[44px] lg:text-[46px]">
                      Sarah
                    </h3>
                    <p className="mt-2 text-[16px] leading-[1.6] text-[#c8e9d4]">
                      UIUX Designer
                    </p>
                    {/* <div className="pointer-events-none absolute -bottom-8 -right-6 h-24 w-24 rounded-full bg-[#178a3f]" /> */}

                    <Image
                      src="/about/card_bottom.svg"
                      alt="Team member avatar"
                      width={157.222}
                      height={145}
                      className="absolute bottom-0 top-[35px] right-0 h-[100px] w-[100px] object-contain mt-[6px]"
                    />
                  </article>

                  <article className="relative overflow-hidden rounded-[16px] bg-[#16a34a] p-4">
                    <div className="flex items-center gap-3 pt-3">
                      <Image
                        src="/about/figma_icon.png"
                        alt="Team member avatar"
                        width={40}
                        height={40}
                        className=" object-cover"
                      />
                      <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-[#001e36] text-[28px] font-semibold text-[#2ea8ff]">
                        Ps
                      </span>
                      <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-[#3f043f] text-[28px] font-semibold text-[#ff61f6]">
                        Xd
                      </span>
                    </div>
                    <Image
                      src="/about/card_bottom.svg"
                      alt="Team member avatar"
                      width={157.222}
                      height={145}
                      className="absolute bottom-0 top-[35px] right-0 h-[100px] w-[100px] object-contain mt-[6px]"
                    />
                  </article>
                </div>

                <article className="relative min-h-[368px] overflow-hidden rounded-[16px] bg-[linear-gradient(180deg,#16A34A_0%,#083D1C_100%)] px-8 py-9">
                  <p className="text-[72px] leading-none text-white">&ldquo;</p>
                  <p className="max-w-[614px] text-[16px] leading-[1.6] text-[#d9eadf]">
                    To empower businesses through cutting-edge digital
                    transformation while delivering value, &amp; transparency
                    every step of the way.
                  </p>

                  <div className="absolute bottom-5 right-5 flex items-center gap-3">
                    <OutlineGlowButton
                      className="h-14 w-14 rounded-full p-0"
                      aria-label="Previous testimonial"
                      baseSurfaceClassName="bg-transparent bg-[#0b5526]"
                      glowSurfaceClassName="bg-white/10"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </OutlineGlowButton>
                    <OutlineGlowButton
                      className="h-14 w-14 rounded-full p-0"
                      aria-label="Next testimonial"
                      baseSurfaceClassName="bg-transparent bg-[#0b5526]"
                      glowSurfaceClassName="bg-white/10"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </OutlineGlowButton>
                  </div>

                  <div className="pointer-events-none absolute -bottom-14 -left-8 h-[176px] w-[176px] rounded-full bg-[#13a54b] opacity-70" />
                  <div className="pointer-events-none absolute bottom-16 left-16 h-[58px] w-[58px] rounded-full bg-[#13a54b] opacity-70 top-[217px]" />
                </article>
              </div>

              <div className="relative min-h-[500px] overflow-hidden rounded-[16px] bg-[#bebebe]">
                <Image
                  src="/about/core_team_member.png"
                  alt="Core team lead"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
