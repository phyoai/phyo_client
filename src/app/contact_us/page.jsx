"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Navbar from "@/app/landing/components/Navbar";
import Footer from "@/app/landing/components/Footer";
import LandingAccentGridPatterns from "@/components/shared/LandingAccentGridPatterns";
import LandingHeroBackground from "@/components/shared/LandingHeroBackground";
import MilestoneCards from "@/components/shared/MilestoneCards";
import OutlineGlowButton from "@/components/shared/OutlineGlowButton";

function ContactField({
  label,
  required = false,
  type = "text",
  name,
  multiline = false,
}) {
  const fieldId = name || label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="text-[14px] text-[#868686]">
        {label}
        {required ? <span className="text-[#16a34a]">*</span> : null}
      </label>

      {multiline ? (
        <textarea
          id={fieldId}
          name={name || fieldId}
          required={required}
          rows={2}
          className="w-full resize-none border-b border-[#5f5f5f] bg-transparent pb-1 text-[14px] leading-[1.3] text-white outline-none placeholder:text-[#5f5f5f] focus:border-[#16a34a]"
        />
      ) : (
        <input
          id={fieldId}
          name={name || fieldId}
          type={type}
          required={required}
          className="h-7 w-full border-b border-[#5f5f5f] bg-transparent pb-1 text-[14px] leading-[1.3] text-white outline-none placeholder:text-[#5f5f5f] focus:border-[#16a34a]"
        />
      )}
    </div>
  );
}

export default function ContactUsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", process.env.NEXT_PUBLIC_FORM_KEY);

    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Success! Your message has been sent.");
        form.reset();
      } else {
        alert(`Error: ${data.message || "Unable to send message."}`);
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="home"
      className="relative isolate overflow-hidden bg-[#050505] font-inter text-white"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <LandingHeroBackground />

      <div className="relative z-10">
        <Navbar />

        <main className="mx-auto max-w-[1440px] px-4 pb-20 sm:px-6 lg:px-[120px] lg:pb-20">
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
            <LandingAccentGridPatterns />
          </section>

          <section id="testimonials" className="pt-4">
            <div className="grid gap-10 lg:grid-cols-[500px_640px] lg:justify-between">
              <div className="pt-1">
                <h2 className="font-bricolage text-[36px] leading-[1.4] text-white">
                  Digitally Transforming{" "}
                  <span className="text-[#16a34a]">
                    Businesses Across Industries
                  </span>
                </h2>
                <p className="mt-4 text-[16px] leading-[1.6] text-[#9b9b9b]">
                  It Was Popularised In The 1960s With The Release Of Letraset
                  Sheets Containing Lorem Ipsum Passages, And More Recently With
                  Desktop Publishing Software.
                </p>

                <div className="mt-12 space-y-10">
                  <div>
                    <p className="text-[16px] leading-[1.2] text-white">
                      Contact Us At:
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-10">
                      <div className="flex items-center gap-3">
                        <Image
                          src="/contact_us/8913d00d989ffa42c83610d96b0b986579c1364e.svg"
                          alt=""
                          width={26}
                          height={19}
                        />
                        <Link
                          href="https://mail.google.com/mail/?view=cm&fs=1&to=phyo.aiofficial@gmail.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[16px] leading-[1.2] text-white transition hover:text-[#16A34A]"
                        >
                          phyo.aiofficial@gmail.com
                        </Link>
                      </div>
                      <div className="flex items-center gap-3">
                        <Image
                          src="/contact_us/de72240e3a621682db4bfdf75d1a53375bec8fb8.svg"
                          alt=""
                          width={18}
                          height={24}
                        />
                        <Link
                          href="tel:+919315732227"
                          className="text-[16px] leading-[1.2] text-white transition hover:text-[#16A34A]"
                        >
                          +91 9315732227
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[16px] leading-[1.2] text-white">
                      Visit Us At:
                    </p>
                    <div className="mt-4 flex items-start gap-3">
                      <Image
                        src="/contact_us/33c66721daf3c925d7aa98afb1e59dc54081bdc8.svg"
                        alt=""
                        width={20}
                        height={24}
                        className="mt-0.5"
                      />
                      <Link
                        href="https://maps.app.goo.gl/yXPkgrGsrKALML6w5"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[16px] leading-[1.4] text-white transition hover:text-[#16A34A]"
                        aria-label="Open office location in Google Maps"
                      >
                        E-12/2, 3rd Floor, Block E, Sector-1, Near GAIL, Noida
                        <br />
                        Uttar Pradesh - 201301
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <article className="rounded-[24px] bg-[#141414] p-5">
                <h3 className="font-bricolage text-[36px] leading-[1.2] text-white">
                  Get In Touch
                </h3>
                <p className="mt-3 text-[16px] leading-[1.6] text-[#9b9b9b]">
                  From finding the right influencers to tracking performance
                  everything you need to run high-impact campaigns in one
                  platform.
                </p>

                <form id="form" className="mt-4 space-y-6" onSubmit={handleSubmit}>
                  <ContactField
                    label="Full Name"
                    name="fullName"
                    type="text"
                    required
                  />

                  <div className="grid gap-8 sm:grid-cols-2">
                    <ContactField
                      label="Email"
                      name="email"
                      type="email"
                      required
                    />
                    <ContactField
                      label="Phone Number"
                      name="phoneNumber"
                      type="tel"
                      required
                    />
                  </div>

                  <ContactField
                    label="How Can We Help You?"
                    name="message"
                    multiline
                  />

                  <label className="flex items-center gap-2 text-[12px] text-[#868686]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded-[2px] border border-[#9b9b9b] bg-transparent accent-[#16a34a]"
                    />
                    The Banking And Finance Industry Is At The Forefront Of
                    Digital Changeover.
                  </label>

                  {/* <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-10 w-[180px] items-center justify-center rounded-[40px] border border-[#16a34a] text-[16px] text-[#16a34a] transition hover:bg-[#16a34a]/10"
                  >
                    {isSubmitting ? "Sending..." : "Submit Now"}
                  </button> */}
                  <OutlineGlowButton
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-10 w-[180px] items-center justify-center rounded-[40px] border border-[#16a34a] text-[16px] text-[#16a34a] transition hover:bg-[#16a34a]/10"
                  >
                    {isSubmitting ? "Sending..." : "Submit Now"}
                  </OutlineGlowButton>
                </form>
              </article>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
