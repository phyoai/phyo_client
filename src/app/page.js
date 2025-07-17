import { cookies } from "next/headers";
import Home from "./home/index"

export default function page() {
  const token = cookies().get("authtoken")?.value || null
  return (
    <div>
      <Home token={token} />
    </div>
  );
}

// See /influencer-search-results/[query]/page.jsx for influencer search results display




