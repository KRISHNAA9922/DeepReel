import { connectToDatabase } from "@/lib/db";
import Image from "next/image";

export default async function Home() {
  await connectToDatabase()
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
    </div>
  );
}
