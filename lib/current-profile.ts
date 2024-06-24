import { User } from "@/schema/schema";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "./db";

const currentProfile = async () => {
  await connectDB();
  const { userId } = auth();

  if (!userId) return null;

  const profile = await User.findOne({ userId });

  return profile;
};

export default currentProfile;
