<<<<<<< HEAD
import { cookies } from "next/headers";
import Home from "./home/index"
=======
import Home from "../app/home/index"
>>>>>>> 0587404d161a96b8b427e56e87715166f55f8b4f

export default function page() {
  const token = cookies().get("authtoken")?.value || null
  return (
    <div>
      <Home token={token} />
    </div>
  );
}




