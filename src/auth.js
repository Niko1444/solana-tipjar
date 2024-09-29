import NextAuth from "next-auth";
import Twitch from "next-auth/providers/twitch";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Twitch],
});
