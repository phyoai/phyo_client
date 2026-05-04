import Navbar from "@/app/landing/components/Navbar";
import Footer from "@/app/landing/components/Footer";
import FaqSection from "@/components/shared/FaqSection";

const lastUpdated = "4 May 2026";

const faqItems = [
  {
    question: "How Do Credits Work?",
    answer:
      "Credits are used all around Phyo for transparent usage and maximum flexibility.",
  },
  {
    question: "Can I Try Phyo Before Subscribing?",
    answer:
      "Yes, we offer a free trial period where you can explore all features and see how Phyo can help grow your brand before committing to a subscription.",
  },
  {
    question: "How Secure Is My Data On Phyo?",
    answer:
      "Your data security is our top priority. We use enterprise-grade encryption, secure servers, and follow industry best practices..",
  },
  {
    question: "Can I Cancel My Subscription Anytime?",
    answer:
      "Absolutely! You can cancel your subscription at any time with no hidden fees or penalties. Your account will remain...",
  },
  {
    question: "Can Phyo Actually Help Me Grow My Brand Fast?",
    answer: "Yes! Our platform is designed to accelerate brand growth...",
  },
];

const pageSectionClass =
  "mx-auto max-w-[1440px] sm:px-6 lg:px-[120px] mt-[20px]";
const heroSectionClass = "mx-auto max-w-[1440px] sm:px-6 lg:px-[120px]";

function GridBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundPosition: "center top",
          backgroundSize: "96px 96px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-80px] top-[-180px] h-[420px] w-[420px] rounded-full bg-[#16a34a]/20 blur-[120px] sm:right-[60px] sm:top-[-160px] sm:h-[520px] sm:w-[520px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[linear-gradient(180deg,rgba(5,5,5,0.75)_0%,rgba(5,5,5,0.25)_58%,rgba(5,5,5,0)_100%)]"
      />
    </>
  );
}

export default function FaqPage() {
  return (
    <main
      className="relative isolate min-h-screen overflow-hidden bg-[#050505] font-inter text-white"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <GridBackground />

      <div className="relative z-10">
        <Navbar />

        <div className="pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
          <section className={heroSectionClass}>
            <div className="px-4">
              <h1
                className="inline-block w-fit bg-clip-text font-bricolage text-[40px] font-normal leading-[1.2] text-transparent sm:text-[48px] lg:text-[56px]"
                style={{
                  fontVariationSettings: "'opsz' 14, 'wdth' 100",
                  backgroundImage:
                    "linear-gradient(102.272deg, #16A34A 3.4%, #FFFFFF 58%, #16A34A 97.64%)",
                }}
              >
                Frequently Asked Questions
              </h1>
              <p className="mt-2 text-[14px] leading-[1.6] text-[#9b9b9b]">
                Last Updated: {lastUpdated}
              </p>
            </div>
          </section>

          <div className=" mt-[100px] mb-[100px]">
            <FaqSection
              sectionClassName={pageSectionClass}
              faqItems={faqItems}
              ctaHref="#home"
            />
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
