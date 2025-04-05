import React from 'react';

const Feature = () => {
  return (
    <div className="relative flex justify-center items-center h-screen">
      <img src='/dashboard.png' className="relative z-10" alt="Dashboard" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white opacity-70"></div>
    </div>
  );
};

export default Feature;
