import InitialProfile from "@/lib/initial-profile";

export default async function SetupPage() {
  const response = await InitialProfile();

  return response;
}
