"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    text: "Su is absolutely lovely and so down-to-earth. She makes you feel comfortable the moment you walk in and really takes the time to look after her clients.",
    name: "Maria S.",
    location: "London",
    image: "/images/Image.svg",
  },
  {
    text: "The experience was smooth, warm, and very professional. Everything felt personal and carefully handled from start to finish.",
    name: "Priya K.",
    location: "Dubai",
    image: "/images/Image.svg",
  },
  {
    text: "I felt completely relaxed and confident. The attention to detail and the care shown throughout the session was amazing.",
    name: "Aisha R.",
    location: "Mumbai",
    image: "/images/Image.svg",
  },
  {
    text: "A beautiful experience with a very calming environment. I would definitely recommend this to anyone looking for genuine care.",
    name: "Sophia L.",
    location: "London",
    image: "/images/Image.svg",
  },
  {
    text: "Very professional, kind, and thoughtful. The whole process felt premium but still very personal and friendly.",
    name: "Emily W.",
    location: "Manchester",
    image: "/images/Image.svg",
  },
];

const CARD_REVEAL_OFFSET = 40;

export default function StackingTestimonials() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const endRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current;

      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: `top-=${CARD_REVEAL_OFFSET * i} 35%`,
          endTrigger: endRef.current,
          end: "top center",
          pin: true,
          pinSpacing: false,
          scrub: true,
        });
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative mt-[20px] h-full w-full">
      <div className="mx-auto w-full max-w-[460px] px-2 sm:px-0">
        <div className="relative">
          {testimonials.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="relative mb-8 flex h-[236px] w-full origin-top flex-col justify-between overflow-hidden rounded-[24px] bg-[#141414] px-7 py-7 shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
              style={{ zIndex: index + 1 }}
            >
              <div className="absolute left-8 top-7 h-[74px] w-[2px] rounded-full bg-[#16A34A]" />

              <div className="min-h-0 pl-5 pr-10">
                <p className="line-clamp-4 text-[17px] leading-[1.7] text-[#A8A8A8] md:text-[18px]">
                  {item.text}
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-14 w-14 rounded-full object-cover"
                />

                <div>
                  <h3 className="text-[20px] font-semibold text-[#16A34A]">
                    {item.name}
                  </h3>
                  <p className="text-[16px] text-[#9B9B9B]">{item.location}</p>
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-3 right-8 text-[140px] font-bold leading-none text-[#0B3B1E]/45 md:text-[170px]">
                ”
              </div>
            </div>
          ))}
        </div>

        <div ref={endRef} className="w-full" />
      </div>
    </section>
  );
}
