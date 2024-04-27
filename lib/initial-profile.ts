import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectDB } from "./db";
import { User } from "@/schema/schema";

const InitialProfile = async () => {
  const user = await currentUser();
  await connectDB();

  if (!user) {
    return redirect("/sign-in");
  }

  const profile = await User.findOne({ userId: user.id });

  if (profile) {
    return redirect("/dashboard");
  }

  if (!profile) {
    console.log("Creating new user profile...");
    await User.create({
      userId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName + " " + user.lastName,
      profilePicture: user.imageUrl,
    });
    return redirect("/dashboard");
  }
};

export default InitialProfile;
