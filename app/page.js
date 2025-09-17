"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const Page = () => {
  const {data: session} = useSession();

  const handleSignOut = () => {
    signOut({
      redirect: true,
      callbackUrl: "/sign-in",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}</h1>
      <Button onClick={handleSignOut}>Sign Out</Button>
    </div>
  );
};

export default Page;
