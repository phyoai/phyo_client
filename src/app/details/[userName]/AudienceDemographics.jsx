import React from 'react';

const AudienceDemographics = ({ creator }) => {
  const { instagramData } = creator;
  if (!instagramData) return null;
  const hasDemographics =
    (instagramData.genderDistribution?.length > 0 ||
      instagramData.ageDistribution?.length > 0 ||
      instagramData.audienceByCountry?.length > 0);
  if (!hasDemographics) return null;
  return (
    <div className='bg-white rounded-xl shadow-lg p-8 mb-8'>
      <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3'>
        <div className='w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center'>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        Audience Demographics
      </h2>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Gender Distribution */}
        {instagramData.genderDistribution?.length > 0 && (
          <div className='bg-gray-50 rounded-xl p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Gender Distribution</h3>
            <div className='space-y-4'>
              {instagramData.genderDistribution.map((item, index) => (
                <div key={index} className='flex items-center justify-between'>
                  <div className='flex items-center gap-3 flex-1'>
                    <div className={`w-4 h-4 rounded-full ${item.gender === 'MALE' ? 'bg-blue-500' : 'bg-pink-500'}`}></div>
                    <span className='font-medium text-gray-700 capitalize'>
                      {item.gender === 'MALE' ? 'Male' : 'Female'}
                    </span>
                  </div>
                  <div className='flex items-center gap-3 flex-1'>
                    <div className='flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden'>
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${item.gender === 'MALE' ? 'bg-blue-500' : 'bg-pink-500'}`}
                        style={{ width: `${item.distribution}%` }}
                      ></div>
                    </div>
                    <span className='font-bold text-gray-900 min-w-[3rem] text-right'>
                      {item.distribution}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Age Distribution */}
        {instagramData.ageDistribution?.length > 0 && (
          <div className='bg-gray-50 rounded-xl p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Age Distribution</h3>
            <div className='space-y-4'>
              {instagramData.ageDistribution.map((item, index) => {
                const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];
                const color = colors[index % colors.length];
                return (
                  <div key={index} className='flex items-center justify-between'>
                    <div className='flex items-center gap-3 flex-1'>
                      <div className={`w-4 h-4 rounded-full ${color}`}></div>
                      <span className='font-medium text-gray-700'>{item.age} years</span>
                    </div>
                    <div className='flex items-center gap-3 flex-1'>
                      <div className='flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden'>
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${color}`}
                          style={{ width: `${(item.value / Math.max(...instagramData.ageDistribution.map(a => a.value))) * 100}%` }}
                        ></div>
                      </div>
                      <span className='font-bold text-gray-900 min-w-[3rem] text-right'>
                        {item.value}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {/* Top Cities/Countries */}
      {instagramData.audienceByCountry?.length > 0 && (
        <div className='mt-8'>
          <h3 className='text-lg font-semibold text-gray-900 mb-6'>Top Audience Locations</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='bg-gray-50 rounded-xl p-6'>
              <h4 className='font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Primary Cities
              </h4>
              <div className='space-y-3'>
                {instagramData.audienceByCountry.slice(0, 5).map((item, index) => {
                  const maxValue = Math.max(...instagramData.audienceByCountry.map(a => a.value));
                  const percentage = (item.value / maxValue) * 100;
                  const colors = ['bg-green-600', 'bg-green-500', 'bg-green-400', 'bg-green-300', 'bg-green-200'];
                  return (
                    <div key={index} className='flex items-center justify-between'>
                      <div className='flex items-center gap-3 flex-1'>
                        <span className='font-medium text-gray-700 min-w-[5rem]'>{item.name}</span>
                      </div>
                      <div className='flex items-center gap-3 flex-1'>
                        <div className='flex-1 bg-gray-200 rounded-full h-2.5 relative overflow-hidden'>
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${colors[index]}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className='font-bold text-gray-900 min-w-[2.5rem] text-right text-sm'>
                          {item.value}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className='bg-gray-50 rounded-xl p-6'>
              <h4 className='font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Primary Countries
              </h4>
              <div className='space-y-3'>
                {/* Create a mock country distribution based on cities */}
                {[
                  { name: 'India', value: 60 },
                  { name: 'USA', value: 50 },
                  { name: 'UK', value: 40 },
                  { name: 'Sri Lanka', value: 30 },
                  { name: 'Bangladesh', value: 20 }
                ].map((item, index) => {
                  const colors = ['bg-blue-600', 'bg-blue-500', 'bg-blue-400', 'bg-blue-300', 'bg-blue-200'];
                  return (
                    <div key={index} className='flex items-center justify-between'>
                      <div className='flex items-center gap-3 flex-1'>
                        <span className='font-medium text-gray-700 min-w-[5rem]'>{item.name}</span>
                      </div>
                      <div className='flex items-center gap-3 flex-1'>
                        <div className='flex-1 bg-gray-200 rounded-full h-2.5 relative overflow-hidden'>
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${colors[index]}`}
                            style={{ width: `${item.value}%` }}
                          ></div>
                        </div>
                        <span className='font-bold text-gray-900 min-w-[2.5rem] text-right text-sm'>
                          {item.value}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Collaboration Charges */}
      {instagramData.collaborationCharges && (
        <div className='mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2'>
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Collaboration Charges
          </h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {Object.entries(instagramData.collaborationCharges).map(([key, value]) => (
              <div key={key} className='bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100'>
                <div className='text-2xl font-bold text-gray-900 mb-1'>
                  ₹{value}
                </div>
                <div className='text-sm text-gray-600 capitalize'>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudienceDemographics; 