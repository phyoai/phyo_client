import { cookies } from "next/headers";
import Home from "./home/index"
import Landing from "./landing/page"

export default function page() {
  const token = cookies().get("authtoken")?.value || null
  return (
    <div>
  
      <Landing  />
    </div>
  );
}

// See /influencer-search-results/[query]/page.jsx for influencer search results display




