import React from 'react';

const RawJsonSection = ({ creator }) => (
  <div className='bg-white rounded-xl shadow-lg p-8'>
    <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3'>
      <div className='w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center'>
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </div>
      Raw JSON Data
    </h2>
    <div className='flex justify-between items-center mb-4'>
      <p className='text-gray-600'>Complete API response data</p>
      <button
        onClick={() => {
          navigator.clipboard.writeText(JSON.stringify(creator, null, 2));
          alert('JSON copied to clipboard!');
        }}
        className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium'
      >
        📋 Copy JSON
      </button>
    </div>
    <div className='bg-gray-900 rounded-lg p-6 overflow-auto max-h-96'>
      <pre className='text-green-400 text-sm whitespace-pre-wrap font-mono'>
        {JSON.stringify(creator, null, 2)}
      </pre>
    </div>
  </div>
);

export default RawJsonSection; 