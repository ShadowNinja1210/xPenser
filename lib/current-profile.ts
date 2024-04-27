import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const currentProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { userId } = auth();

    const profile = await User.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json(profile);
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default currentProfile;
