import React from 'react';

const OTPInput = ({ value, onChange, loading, error, onVerify }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-2">Enter OTP</h2>
      <p className="mb-4">We have sent a verification code to your email.</p>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        maxLength={6}
        className="mb-3 p-2 border rounded w-40 text-center text-lg tracking-widest"
        placeholder="Enter 6-digit OTP"
        disabled={loading}
      />
      {error && <div className="mb-2 text-red-600">{error}</div>}
      <button
        onClick={onVerify}
        className="px-4 py-2 bg-[#00674F] text-white rounded disabled:opacity-50"
        disabled={loading || value.length !== 6}
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </div>
  );
};

export default OTPInput;

