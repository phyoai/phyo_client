"use client";

const milestoneCardData = [
  { title: "50K", description: "Authentic influencers" },
  { title: "15+", description: "Countries covered" },
  { title: "300+", description: "Brands trust to scale fast" },
  { title: "97.8%", description: "Average TAT reduced" },
];

const MilestoneCards = () => {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 py-12">
      <style>{`
        @keyframes milestoneBorderSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .milestone-card {
          position: relative;
          isolation: isolate;
        }

        .milestone-border {
          position: absolute;
          inset: -80%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 60deg,
            #16A34A 120deg,
            #86EFAC 160deg,
            #16A34A 200deg,
            transparent 260deg,
            transparent 360deg
          );
          animation: milestoneBorderSpin 3s linear infinite;
          opacity: 0.8;
          filter: blur(0.5px);
          will-change: transform;
        }

        .milestone-card::after {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: 23px;
          background: black;
          z-index: 1;
        }

        .milestone-content {
          position: relative;
          z-index: 2;
        }

        .milestone-title,
        .milestone-description {
          transition: color 0.4s ease;
        }

        .milestone-card:hover .milestone-title {
          color: #16A34A;
        }

        .milestone-card:hover .milestone-description {
          color: #16A34A;
        }
      `}</style>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {milestoneCardData.map((item, index) => (
          <div
            key={index}
            className="milestone-card overflow-hidden rounded-[24px] p-[1px]"
          >
            <div className="milestone-border" />

            <div className="milestone-content flex h-[139px] flex-col items-center justify-center rounded-[23px] bg-black px-5 text-center">
              <h3 className="milestone-title font-bricolage text-[36px] font-semibold capitalize leading-[1.2] text-[#4E4D4D]">
                {item.title}
              </h3>

              <p className="milestone-description mt-1 font-inter text-[16px] font-normal capitalize leading-[1.6] text-[#4E4D4D]">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MilestoneCards;
