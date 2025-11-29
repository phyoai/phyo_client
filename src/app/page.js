import { cookies } from "next/headers";
import Home from "./home/index"
import Landing from "./landing/page"

export default async function page() {
  const cookieStore = await cookies()
  const token = cookieStore.get("authtoken")?.value || null
  return (
    <div>
      <Landing  />
    </div>
  );
}

