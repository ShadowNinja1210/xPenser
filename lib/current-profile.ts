import { User } from "@/schema/schema";
import { auth } from "@clerk/nextjs/server";

const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) return null;

  const profile = await User.findOne({ userId });

  return profile;
};

export default currentProfile;
