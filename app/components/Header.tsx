"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

function Header() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button onClick={handleSignOut}>Signout</button>
      {session ? (
        <p>Welcome</p>
      ) : (
        <div>
          <Link href="/login">Sign In</Link>
          <Link href="/register">Sign Up</Link>
        </div>
      )}
    </div>
  );
}

export default Header;
