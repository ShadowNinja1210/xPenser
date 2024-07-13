import { User } from "@/schema/schema";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "./db";
import { redirect } from "next/navigation";

const currentProfile = async () => {
  await connectDB();
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await User.findOne({ userId });

  return profile;
};

export default currentProfile;
