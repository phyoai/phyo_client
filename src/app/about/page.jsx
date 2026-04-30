"use client";

import { useEffect, useState } from "react";
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

const missionCards = [
  {
    title: "Goal",
    description:
      "From Delhi to Dubai, LA to London get access to 300k+ real influencers across 15+ countries and 95+ languages.",
    image: "/about/card1.svg",
    smallImage: "/about/misson_vison.svg",
  },
  {
    title: "Mission",
    description:
      "Help brands discover authentic creators faster using AI-powered influencer intelligence and verified audience data.",
    image: "/about/card1.svg",
    smallImage: "/about/misson_vison.svg",
  },
  {
    title: "Vision",
    description:
      "Build the most trusted AI search engine for influencer discovery, campaign planning, and creator insights.",
    image: "/about/card1.svg",
    smallImage: "/about/misson_vison.svg",
  },
];

const teamSlides = [
  {
    name: "Aparna Sen",
    role: "UIUX Designer",
    avatar: "/about/team_member.png",
    mainImage: "/about/core_team_member.png",
    quote:
      "To empower businesses through cutting-edge digital transformation while delivering value, & transparency every step of the way.",
    tools: [
      {
        type: "image",
        src: "/about/figma_icon.png",
        alt: "Figma",
      },
      {
        type: "text",
        label: "Ps",
        className: "bg-[#001e36] text-[#2ea8ff]",
      },
      {
        type: "text",
        label: "Xd",
        className: "bg-[#3f043f] text-[#ff61f6]",
      },
    ],
  },
  {
    name: "Sohit Prajapati",
    role: "Software Engineer",
    avatar: "/about/team_member.png",
    mainImage: "/about/core_team_member.png",
    quote:
      "We build smooth, scalable, and high-performing interfaces that make every digital experience feel simple and powerful.",
    tools: [
      {
        type: "text",
        label: "Re",
        className: "bg-[#062b3f] text-[#61dafb]",
      },
      {
        type: "text",
        label: "Ts",
        className: "bg-[#06345f] text-[#38bdf8]",
      },
      {
        type: "text",
        label: "Nx",
        className: "bg-[#111827] text-white",
      },
    ],
  },
  {
    name: "Anil Kumar",
    role: "AI Engineer",
    avatar: "/about/team_member.png",
    mainImage: "/about/core_team_member.png",
    quote:
      "Our goal is to turn complex AI systems into simple workflows that help teams save time, reduce errors, and make better decisions.",
    tools: [
      {
        type: "text",
        label: "AI",
        className: "bg-[#052e16] text-[#86efac]",
      },
      {
        type: "text",
        label: "Py",
        className: "bg-[#1e293b] text-[#facc15]",
      },
      {
        type: "text",
        label: "API",
        className: "bg-[#172554] text-[#93c5fd] text-[16px]",
      },
    ],
  },
  {
    name: "Lakshaya Arora",
    role: "React Native Developer",
    avatar: "/about/team_member.png",
    mainImage: "/about/core_team_member.png",
    quote:
      "We connect user needs, business goals, and technology to build products that are useful, practical, and ready to scale.",
    tools: [
      {
        type: "text",
        label: "PR",
        className: "bg-[#431407] text-[#fdba74]",
      },
      {
        type: "text",
        label: "UX",
        className: "bg-[#312e81] text-[#c4b5fd]",
      },
      {
        type: "text",
        label: "BI",
        className: "bg-[#422006] text-[#fde68a]",
      },
    ],
  }
];

function ProcessArrow({ active }) {
  return (
    <div className="relative ml-3 h-2 flex-1 overflow-hidden">
      <div className="absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 bg-[#6b6b6b]" />

      <div
        className={`absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-[linear-gradient(90deg,#C7C7C7_0%,#16A34A_100%)] ${
          active ? "animate-[processLine_1.8s_ease-out_forwards]" : "w-0"
        }`}
      />

      <div
        className={`absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-r border-t transition-colors duration-500 ${
          active ? "border-[#16A34A]" : "border-[#6b6b6b]"
        }`}
      />
    </div>
  );
}

function HoverEffectCard({
  title = "Goal",
  description,
  image = "/about/card1.svg",
}) {
  return (
    <article className="flex h-[300px] w-full flex-col gap-4 overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#1b1c1f_0%,#17181a_100%)] p-5 shadow-[0_0_35px_rgba(22,163,74,0.18)] md:flex-row md:items-start md:justify-between">
      <div className="max-w-[300px]">
        <h3 className="font-bricolage text-[24px] leading-[1.2] text-white">
          {title}
        </h3>

        <p className="mt-3 text-[16px] leading-[1.6] text-[#9b9b9b]">
          {description}
        </p>
      </div>

      <div className="relative h-[260px] w-[240px] shrink-0 self-end">
        <Image
          src={image}
          alt={`${title} visual`}
          width={240}
          height={260}
          className="h-[260px] w-[240px] object-contain"
        />
      </div>
    </article>
  );
}

function MissionCard({
  title,
  description,
  image = "/about/misson_vison.svg",
}) {
  return (
    <article className="relative h-[300px] w-full overflow-hidden rounded-[20px] bg-[#16a34a] p-5">
      <div className="relative z-10 max-w-[248px]">
        <h3 className="font-bricolage text-[24px] leading-[1.2] text-white">
          {title}
        </h3>

        <p className="mt-3 text-[16px] leading-[1.6] text-[#e3e3e3]">
          {description}
        </p>
      </div>

      <Image
        src={image}
        alt="mt-10 lg:mt-20"
        aria-hidden="true"
        width={203}
        height={154}
        className="pointer-events-none absolute bottom-0 right-0 h-[154px] w-[203px]"
      />
    </article>
  );
}

function MissionSwitcherCard({ card, isActive, onMouseEnter }) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      className="relative h-[300px] min-w-0 overflow-hidden rounded-[20px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
    >
      <div
        className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isActive ? "scale-[1.02] opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <MissionCard
          title={card.title}
          description={card.description}
          image={card.smallImage}
        />
      </div>

      <div
        className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isActive ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"
        }`}
      >
        <HoverEffectCard
          title={card.title}
          description={card.description}
          image={card.image}
        />
      </div>
    </div>
  );
}

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

function TeamTool({ tool }) {
  if (tool.type === "image") {
    return (
      <Image
        src={tool.src}
        alt={tool.alt}
        width={40}
        height={40}
        className="object-cover"
      />
    );
  }

  return (
    <span
      className={`grid h-10 w-10 place-items-center rounded-[10px] text-[22px] font-semibold ${tool.className}`}
    >
      {tool.label}
    </span>
  );
}

export default function AboutPage() {
  const [activeMissionCard, setActiveMissionCard] = useState(0);
  const [activeProcessIndex, setActiveProcessIndex] = useState(0);
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);

  const activeTeam = teamSlides[activeTeamIndex];

  const missionGridClass =
    activeMissionCard === 0
      ? "lg:grid-cols-[600px_280px_280px]"
      : activeMissionCard === 1
        ? "lg:grid-cols-[280px_600px_280px]"
        : "lg:grid-cols-[280px_280px_600px]";

  const handlePreviousTeam = () => {
    setActiveTeamIndex((prev) =>
      prev === 0 ? teamSlides.length - 1 : prev - 1,
    );
  };

  const handleNextTeam = () => {
    setActiveTeamIndex((prev) =>
      prev === teamSlides.length - 1 ? 0 : prev + 1,
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProcessIndex((prev) => (prev + 1) % processSteps.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

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
          <section className="mt-10 lg:mt-20">
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,514px)_minmax(0,560px)] lg:justify-between lg:gap-[126px]">
              <h1 className="bg-[linear-gradient(94.6421deg,#16a34a_3.4033%,#ffffff_57.976%,#16a34a_97.641%)] bg-clip-text font-bricolage text-[44px] leading-[1.2] text-transparent sm:text-[50px] lg:text-[56px]">
                World&apos;s First AI Powered Influencer
                <br />
                Search Engine
              </h1>

              <p className="text-[16px] leading-[1.8] text-[#9b9b9b]">
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

          <section id="features" className="mt-8 lg:mt-10">
            <SectionHeading
              prefix="Our "
              highlight="Goal, Mission & Vision"
              description="It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            />

            <div className="mt-10 min-h-[300px]">
              <div
                onMouseLeave={() => setActiveMissionCard(0)}
                className={`mx-auto grid justify-center gap-5 transition-[grid-template-columns] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:grid-cols-1 md:grid-cols-3 ${missionGridClass}`}
              >
                {missionCards.map((card, index) => (
                  <MissionSwitcherCard
                    key={card.title}
                    card={card}
                    isActive={activeMissionCard === index}
                    onMouseEnter={() => setActiveMissionCard(index)}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="mt-10 lg:mt-20">
            <SectionHeading
              prefix="Steps To Excellence: "
              highlight="The Process We Follow"
              description="It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            />

            <div className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-8">
              {processSteps.map((step, index) => {
                const isActive = activeProcessIndex === index;

                return (
                  <article key={step.number}>
                    <div className="flex items-center">
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[18px] leading-none transition-all duration-500 ${
                          isActive
                            ? "bg-[#16a34a] text-white shadow-[0_0_20px_rgba(22,163,74,0.45)]"
                            : "bg-[#b7b7b7] text-[#5d5d5d]"
                        }`}
                      >
                        {step.number}
                      </span>

                      <ProcessArrow active={isActive} />
                    </div>

                    <h3
                      className={`mt-6 font-bricolage text-[24px] leading-[1.2] transition-colors duration-500 ${
                        isActive ? "text-white" : "text-[#cfcfcf]"
                      }`}
                    >
                      {step.title}
                    </h3>

                    <p className="mt-4 text-[16px] leading-[1.6] text-[#9b9b9b]">
                      {step.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-10 lg:mt-20">
            <SectionHeading
              prefix="Why "
              highlight="Choose Us"
              description="It Was Popularised In The 1960s With The Release Of Letraset Sheets Containing Lorem Ipsum Passages, And More Recently With Desktop Publishing Software Like Aldus PageMaker Including Versions Of Lorem Ipsum."
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              <article className="group relative h-[293px] overflow-hidden rounded-[24px] bg-[#181818] p-5 transition-colors duration-300 hover:bg-[#138d40]">
                <div className="max-w-[344px]">
                  <h3 className="font-bricolage text-[24px] leading-[1.2] text-white">
                    Launch Smarter Campaigns
                  </h3>

                  <p className="mt-3 text-[16px] leading-[1.6] text-[#9b9b9b] transition-colors duration-300 group-hover:text-white">
                    From ABCD finding the right influencers to tracking
                    performance everything you need to run high-impact campaigns
                    in one platform.
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

              <article className="relative h-[293px] overflow-hidden">
                <Image
                  src="/about/why_choose_card2_3.svg"
                  alt="Why choose us visual card"
                  width={590}
                  height={293}
                  className="pointer-events-none absolute inset-0 h-full w-full"
                />
              </article>

              <article className="group relative h-[293px] overflow-hidden rounded-[24px] bg-[#181818] p-5 transition-colors duration-300 hover:bg-[#138d40]">
                <div className="relative z-10 max-w-[344px]">
                  <h3 className="font-bricolage text-[24px] leading-[1.2] text-white">
                    Launch Smarter Campaigns
                  </h3>

                  <p className="mt-3 text-[16px] leading-[1.6] text-[#9b9b9b] transition-colors duration-300 group-hover:text-white">
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

          <section className="mt-10 lg:mt-20">
            <div className="relative overflow-hidden rounded-[44px] bg-[linear-gradient(108.717deg,#16a34a_1.18%,#073618_80.36%)] px-6 py-10 sm:px-8 lg:h-[500px] lg:px-0 lg:py-0">
              <div className="pointer-events-none absolute inset-0 hidden lg:block">
                <div className="absolute -right-[280px] -top-[320px] h-[980px] w-[954px] opacity-40">
                  <Image
                    src="/about/c652761e329210d5433afb2c24ab85f66ceefb21.svg"
                    alt="mt-10 lg:mt-20"
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="absolute -right-[170px] -top-[300px] h-[956px] w-[920px] opacity-40">
                  <Image
                    src="/about/239f5bb47897874755850dc940d3258518715426.svg"
                    alt="mt-10 lg:mt-20"
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
                    <OutlineGlowButton
                      href="/signup"
                      className="h-12 w-[240px] px-7 normal-case"
                      baseSurfaceClassName="bg-[#12853c]"
                      glowSurfaceClassName="bg-white/10"
                    >
                      <span className="inline-flex flex-row-reverse items-center gap-3">
                        <ArrowRight className="h-[14px] w-[14px] stroke-[1.8]" />
                        <span className="leading-[1.2]">
                          Start With Free Trial
                        </span>
                      </span>
                    </OutlineGlowButton>

                    <OutlineGlowButton
                      href="/"
                      className="h-12 w-[180px] px-7 normal-case"
                      baseSurfaceClassName="bg-[#12853c]"
                      glowSurfaceClassName="bg-white/10"
                    >
                      <span className="inline-flex items-center gap-3">
                        <Image
                          src="/landing/play_btn.svg"
                          alt="mt-10 lg:mt-20"
                          width={14}
                          height={14}
                          className="h-[13px] w-[13px]"
                        />
                        <span className="leading-[1.2]">Watch Demo</span>
                      </span>
                    </OutlineGlowButton>
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

          <section id="testimonials" className="mt-10 lg:mt-20">
            <SectionHeading
              prefix="Our Core "
              highlight="Team"
              description="It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-[170px_1fr_1fr]">
                  <div className="relative h-[120px] overflow-hidden rounded-[16px] bg-[#b8b8b8]">
                    <div
                      key={`avatar-${activeTeamIndex}`}
                      className="absolute inset-0 animate-[imageWipeDown_700ms_cubic-bezier(0.22,1,0.36,1)]"
                    >
                      <Image
                        src={activeTeam.avatar}
                        alt={`${activeTeam.name} avatar`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <article className="relative overflow-hidden rounded-[16px] bg-[#16a34a] p-4">
                    <div
                      key={`info-${activeTeamIndex}`}
                      className="relative z-10 animate-[teamTextSlide_500ms_ease-out] align-center flex flex-col gap-1 pt-3"
                    >
                      <h3 className="font-bricolage text-[28px] leading-[1] text-white md:text-[30px] lg:text-[32px]">
                        {activeTeam.name}
                      </h3>

                      <p className="mt-2 text-[16px] leading-[1] text-[#c8e9d4]">
                        {activeTeam.role}
                      </p>
                    </div>

                    <Image
                      src="/about/card_bottom.svg"
                      alt="mt-10 lg:mt-20"
                      width={157}
                      height={145}
                      className="absolute bottom-0 right-0 top-[35px] mt-[6px] h-[100px] w-[100px] object-contain"
                    />
                  </article>

                  <article className="relative overflow-hidden rounded-[16px] bg-[#16a34a] p-4 align-center flex ">
                    <div
                      key={`tools-${activeTeamIndex}`}
                      className="flex animate-[teamTextSlide_500ms_ease-out] items-center gap-3 pt-3 align-center flex-wrap "
                    >
                      {activeTeam.tools.map((tool, index) => (
                        <TeamTool
                          key={`${activeTeam.name}-${index}`}
                          tool={tool}
                        />
                      ))}
                    </div>

                    <Image
                      src="/about/card_bottom.svg"
                      alt="mt-10 lg:mt-20"
                      width={157}
                      height={145}
                      className="absolute bottom-0 right-0 top-[35px] mt-[6px] h-[100px] w-[100px] object-contain"
                    />
                  </article>
                </div>

                <article className="relative min-h-[368px] overflow-hidden rounded-[16px] bg-[linear-gradient(180deg,#16A34A_0%,#083D1C_100%)] px-8 py-9">
                  <p className="text-[72px] leading-none text-white">
                    <Image
                      src="/about/“.svg"
                      width={31}
                      height={24}
                      alt="quotes"
                    />
                  </p>

                  <p
                    key={`quote-${activeTeamIndex}`}
                    className="max-w-[614px] animate-[teamTextSlide_500ms_ease-out] text-[16px] leading-[1.6] text-[#d9eadf] mt-[32px] "
                  >
                    {activeTeam.quote}
                  </p>

                  <div className="absolute bottom-5 right-5 z-20 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handlePreviousTeam}
                      className="group inline-flex h-14 w-14 items-center justify-center rounded-full border border-white bg-transparent text-white transition-all duration-200 hover:bg-white/10 active:border-transparent active:bg-white active:text-[#16A34A]"
                      aria-label="Previous team member"
                    >
                      <span
                        className="h-[14px] w-[14px] rotate-180 bg-current transition-colors duration-200"
                        style={{
                          WebkitMask:
                            "url('/about/right_arrow.svg') center / contain no-repeat",
                          mask: "url('/about/right_arrow.svg') center / contain no-repeat",
                        }}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={handleNextTeam}
                      className="group inline-flex h-14 w-14 items-center justify-center rounded-full border border-white bg-transparent text-white transition-all duration-200 hover:bg-white/10 active:border-transparent active:bg-white active:text-[#16A34A]"
                      aria-label="Next team member"
                    >
                      <span
                        className="h-[14px] w-[14px] bg-current transition-colors duration-200"
                        style={{
                          WebkitMask:
                            "url('/about/right_arrow.svg') center / contain no-repeat",
                          mask: "url('/about/right_arrow.svg') center / contain no-repeat",
                        }}
                      />
                    </button>
                  </div>

                  <div className="pointer-events-none absolute -bottom-14 -left-8 h-[176px] w-[176px] rounded-full bg-[#13a54b] opacity-20" />

                  <div className="pointer-events-none absolute bottom-16 left-16 top-[217px] h-[58px] w-[58px] rounded-full bg-[#13a54b] opacity-20" />
                </article>
              </div>

              <div className="relative min-h-[500px] overflow-hidden rounded-[16px] bg-[#bebebe]">
                <div
                  key={`main-${activeTeamIndex}`}
                  className="absolute inset-0 animate-[imageWipeUp_800ms_cubic-bezier(0.22,1,0.36,1)]"
                >
                  <Image
                    src={activeTeam.mainImage}
                    alt={`${activeTeam.name} profile`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>

      <style jsx global>{`
        @keyframes processLine {
          0% {
            width: 0%;
            opacity: 0.5;
          }

          100% {
            width: 100%;
            opacity: 1;
          }
        }

        @keyframes teamTextSlide {
          0% {
            opacity: 0;
            transform: translateY(14px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes imageWipeDown {
          0% {
            opacity: 0;
            clip-path: inset(0 0 100% 0);
            transform: scale(1.04);
          }

          100% {
            opacity: 1;
            clip-path: inset(0 0 0 0);
            transform: scale(1);
          }
        }

        @keyframes imageWipeUp {
          0% {
            opacity: 0;
            clip-path: inset(100% 0 0 0);
            transform: scale(1.04);
          }

          100% {
            opacity: 1;
            clip-path: inset(0 0 0 0);
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
