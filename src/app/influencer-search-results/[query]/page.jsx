import React from 'react';

async function getInfluencers(query) {
  const res = await fetch('https://phyo-server.onrender.com/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: query }),
    // cache: 'no-store' // Uncomment if you want to always fetch fresh data
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

const SearchResultsPage = async ({ params }) => {
  const { query } = params;
  let data, error;
  try {
    const result = await getInfluencers(query);
    data = result.data;
  } catch (e) {
    error = e.message;
  }

  return (
    <div>
      <h1>Influencer Search Results for: {decodeURIComponent(query)}</h1>
      {error && <div>Error: {error}</div>}
      {Array.isArray(data) ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <div>No data found.</div>
      )}
    </div>
  );
};

export default SearchResultsPage; 