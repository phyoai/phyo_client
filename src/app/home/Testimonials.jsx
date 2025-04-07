import Image from "next/image";

const testimonials = [
  {
    id: 1,
    logo: "/ninjacart.png", // Replace with actual logo path
    quote: "It was great collaborating with the Pyromedia team, they have a strong grasp of data and are proficient in platform like LinkedIn, Instagram and YouTube. I wholeheartedly recommend their service. ",
    name: "Suheil Mohan",
    role: "Head of Brand (NinjaCart)",
    avatar: "/dummyAvatar.jpg", // Replace with actual image path
  },
  {
    id: 2,
    logo: "/kalash.avif", // Replace with   actual logo path
    quote: "As a fintech brand, especially in the digital gold sector, we were really hesitant about trying an influencer campaign. However,the Pyro teamchanged our mindset with their top notch services. ",
    name: "Aman Bansal",
    role: "Founder (Kalash)",
    avatar: "/dummyAvatar1.jpg", // Replace with actual image path
  },
];

const awards = [
  { id: 1, image: "/award1.png", text: "An Award Winning Influencer Marketing Platform" },
  { id: 2, image: "/titan.png", text: "Increase in Engagement Rate", stat: "600%" },
  { id: 3, image: "/g2-awards.png", text: "Rated 4.5 ⭐ on G2 Crowd" },
];

export default function Testimonials() {
  return (
    <section className="py-12 bg-white">
      <h2 className="text-4xl font-bold text-center mb-8">Testimonial</h2>

      {/* Testimonials */}
      <div className="grid md:grid-cols-2 gap-6 px-6 lg:px-20">
        {testimonials.map((t) => (
          <div key={t.id} className="border border-green-400 p-6 rounded-2xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-300 text-5xl">“</span>
              <Image src={t.logo} alt="Company Logo" width={100} height={40} />
            </div>
            <p className="text-gray-700 mb-4">{t.quote}</p>
            <div className="flex items-center gap-3">
              <Image src={t.avatar} alt={t.name} width={40} height={40} className="rounded-full" />
              <div>
                <p className="text-green-700 font-semibold">{t.name}</p>
                <p className="text-gray-500 text-sm">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Awards & Achievements */}
      {/* <div className="grid md:grid-cols-3 gap-6 mt-10 px-6 lg:px-20">
        {awards.map((award) => (
          <div key={award.id} className="border border-green-400 p-6 rounded-2xl shadow-md flex flex-col items-center text-center">
            <Image src={award.image} alt="Award" width={100} height={100} />
            <p className="mt-4 text-gray-700">{award.text}</p>
            {award.stat && <p className="text-green-700 font-bold text-xl">{award.stat}</p>}
          </div>
        ))}
      </div> */}
    </section>
  );
}
