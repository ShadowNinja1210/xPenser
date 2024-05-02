import { NextApiRequest, NextApiResponse } from "next";
import currentProfile from "@/lib/current-profile";
import { NextResponse } from "next/server";
export async function GET(req: Request, params: { params: { userId: String } }) {
  try {
    const response = await currentProfile();
    const profile = response?.toJSON();

    if (!profile) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json("Server Error", { status: 500 });
  }
}
