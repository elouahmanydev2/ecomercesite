"use client";

import { authClient } from "@/lib/authClient";


export default function SocialLogin() {
  async function signInByGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={signInByGoogle}
        className="rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-zinc-300 hover:bg-white/10 transition"
      >
        Google
      </button>
    </div>
  );
}