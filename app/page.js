"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import React from "react";

const Page = () => {
  const handleSignOut = () => {
    signOut({
      redirect: true, // default = true
      callbackUrl: "/sign-in", // where to go after sign-out
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Button onClick={handleSignOut}>Sign Out</Button>
    </div>
  );
};

export default Page;
