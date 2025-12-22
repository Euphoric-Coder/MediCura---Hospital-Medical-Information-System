"use client";

import SignInPage from "@/components/SignInPage";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
        <SignInPage />
      </Suspense>
    </div>
  );
};

export default page;
