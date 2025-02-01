'use client';
import SignIn from "./signIn/page";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  if(!user) {
    router.push("/signIn");
  }
  return (
    <div>
      <SignIn />
    </div>
  );
}