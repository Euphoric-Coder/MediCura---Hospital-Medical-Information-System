"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/lib/dbConfig";
import { Doctors } from "@/lib/schema";
import { signOut } from "next-auth/react";
import React from "react";

const Page = () => {
  const handleSignOut = () => {
    signOut({
      redirect: true,
      callbackUrl: "/sign-in",
    });
  };

  const handleDeleteDoctors = async () => {
    try {
      const res = await fetch("/api/delete/doctors", { method: "DELETE" });
      const data = await res.json();
      alert(data.message || "Deleted successfully");
    } catch (err) {
      console.error("Delete doctors failed:", err);
      alert("Error deleting doctors");
    }
  };

  const fetchDoctor = async () => {
    // const res = await fetch("/api/fetch/doctors");
    // const data = await res.json();
    // console.log(data);
    const data = await db.select().from(Doctors);
    console.log(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen gap-4">
      <Button onClick={handleSignOut}>Sign Out</Button>
      <Button variant="destructive" onClick={handleDeleteDoctors}>
        Delete Doctor Data
      </Button>
      <Button onClick={fetchDoctor}>Fetch Doctors</Button>
    </div>
  );
};

export default Page;
