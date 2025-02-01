'use client';
import { useEffect } from "react";
import SignIn from "./signIn/page";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/signIn");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div>
      <SignIn />
    </div>
  );
}