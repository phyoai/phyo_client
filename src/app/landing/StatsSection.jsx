import React from 'react';

const StatsSection = () => {
  const stats = [
    {
      number: "50K",
      description: "Authentic Influencers on PHYO",
      bgColor: "bg-green-50",
      textColor: "text-gray-800"
    },
    {
      number: "15+",
      description: "Countries | Find Influencers around the world 15+ Countries covered",
      bgColor: "bg-green-500",
      textColor: "text-white"
    },
    {
      number: "300+",
      description: "Brands Trust Phyo to Scale Fast.",
      bgColor: "bg-green-50",
      textColor: "text-gray-800"
    },
    {
      number: "97.8%",
      description: "Average TAT Reduced by 97.8%",
      bgColor: "bg-green-50",
      textColor: "text-gray-800"
    }
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-3xl p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg`}
            >
              <div className={`${stat.textColor} space-y-4`}>
                <h3 className="text-4xl lg:text-5xl font-bold">
                  {stat.number}
                </h3>
                <p className="text-sm lg:text-base font-medium leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;