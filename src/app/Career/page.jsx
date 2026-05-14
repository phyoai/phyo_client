"use client";

import Navbar from "@/app/landing/components/Navbar";
import Footer from "@/app/landing/components/Footer";
import LandingHeroBackground from "@/components/shared/LandingHeroBackground";
import MilestoneCards from "@/components/shared/MilestoneCards";

const jobs = [
  {
    id: 1,
    title: "Content Writer",
    description:
      "Develop clear, compelling content for websites, blogs, and marketing materials that align with brand voice and drive meaningful, consistent customer engagement.",
    location: "New Delhi, India",
    type: "Full Time",
    experience: "3+ Years",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    description:
      "Create intuitive, visually engaging digital experiences. You will design user flows, wireframes, and high-fidelity interfaces for web and mobile products.",
    location: "New Delhi, India",
    type: "Full Time",
    experience: "3+ Years",
  },
  {
    id: 3,
    title: "Digital Marketing Executive",
    description:
      "Plan and execute online marketing campaigns across social media, search, and email to increase brand visibility and generate high-quality business leads.",
    location: "New Delhi, India",
    type: "Full Time",
    experience: "3+ Years",
  },
  {
    id: 4,
    title: "Business Development Executive",
    description:
      "Identify new business opportunities, build client relationships, and support company growth through strategic partnerships and sales efforts across global markets.",
    location: "New Delhi, India",
    type: "Full Time",
    experience: "3+ Years",
  },
];

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 8 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[14px] w-[8px] shrink-0"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 0C1.79086 0 0 1.79086 0 4C0 6.20914 1.79086 8 4 8C6.20914 8 8 6.20914 8 4C8 1.79086 6.20914 0 4 0ZM4 6C2.89543 6 2 5.10457 2 4C2 2.89543 2.89543 2 4 2C5.10457 2 6 2.89543 6 4C6 5.10457 5.10457 6 4 6Z"
        fill="currentColor"
      />
      <path
        d="M4 8L4 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[14px] w-[14px] shrink-0"
    >
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7 4V7L9 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[14px] w-[15px] shrink-0"
    >
      <path
        d="M7.5 7C9.15685 7 10.5 5.65685 10.5 4C10.5 2.34315 9.15685 1 7.5 1C5.84315 1 4.5 2.34315 4.5 4C4.5 5.65685 5.84315 7 7.5 7Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M1.5 13C1.5 10.2386 4.18629 8 7.5 8C10.8137 8 13.5 10.2386 13.5 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function JobBadge({ icon, label }) {
  return (
    <div className="flex items-center gap-[10px] rounded-[40px] border border-white/20 px-[16px] py-[7px] transition-colors duration-300 group-hover:border-white/60">
      {icon}

      <span className="font-inter text-[13px] capitalize leading-[1.2] text-white sm:text-[14px]">
        {label}
      </span>
    </div>
  );
}

export default function CareerPage() {
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
          {/* Hero */}
          <section className="pt-14 lg:pt-20">
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
          </section>

          {/* Opening Positions */}
          <section
            id="positions"
            className="relative bg-[#050505] py-16 lg:py-20"
          >
            <img
              src="/landing/header_grid_lines.svg"
              aria-hidden
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
            />
            <div className="max-w-[900px]">
              <h2 className="font-bricolage text-[28px] capitalize leading-[1.2] text-white sm:text-[32px] lg:text-[36px]">
                Opening <span className="text-[#16a34a]">Positions</span>
              </h2>

              <p className="font-inter mt-4 text-[16px] leading-[1.6] text-[#9b9b9b]">
                It was popularised in the 1960s with the release of Letraset
                sheets containing Lorem Ipsum passages, and more recently with
                desktop publishing software like Aldus PageMaker including
                versions of Lorem Ipsum.
              </p>
            </div>

            <div className="relative mt-10 grid gap-5 lg:grid-cols-2 lg:gap-8">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="group relative flex w-full flex-col justify-between overflow-hidden rounded-[24px] border border-white/5 bg-[#141414] px-7 py-7 shadow-[0_20px_80px_rgba(0,0,0,0.45)] transition-all duration-300 hover:border-[#16a34a]/40 hover:bg-[#16a34a]"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3">
                      <h3 className="font-bricolage text-[20px] font-medium leading-[1.2] text-white sm:text-[22px]">
                        {job.title}
                      </h3>

                      <p className="text-[14px] leading-[1.7] text-[#9b9b9b] transition-colors duration-300 group-hover:text-[#e3f5ea] sm:text-[15px]">
                        {job.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <JobBadge
                        icon={<LocationIcon />}
                        label={job.location}
                      />

                      <JobBadge
                        icon={<ClockIcon />}
                        label={job.type}
                      />

                      <JobBadge
                        icon={<UserIcon />}
                        label={job.experience}
                      />
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}