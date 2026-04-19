import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDb from "./app/lib/db"
import User from "./app/models/user.model";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
        credentials:{
            email:{label:"email",type:"email"},
            password:{label:"Paswword",type:"password"}

        },
       async authorize(credentials,request){
        await connectDb();
        const email= credentials.email;
        const password= credentials.password  as string
        const user= await User.findOne({email})
        if(!user){
            throw new Error("User does not exit");
        }
        const pass= await bcrypt.compare(password,user.password)
        if(!pass){
            throw new Error("Password does not match")
        }
         
      return {
        id:user._id.toString(),
         email:user.email,
        name:user.name,
        role:user.role
        
}
            

        }

    }),
    Google({
      clientId:process.env.GOOGLE_CLIENT_ID,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET
     

    })
  ],
  callbacks:{
    async signIn({ user, account }) {
      if (account?.provider == "google") {
        try {
          await connectDb();
          let dbUser = await User.findOne({ email: user.email });
          if (!dbUser) {
            dbUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
            });
          }
          user.id = dbUser._id.toString();
          user.role = dbUser.role;
          return true;
        } catch (error) {
          console.error("CRITICAL: Database error in Google signIn callback:", error);
          return false; // This will trigger the AccessDenied page
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (account?.provider === "google" && user?.email) {
        try {
          await connectDb();
          const dbUser = await User.findOne({ email: user.email });

          if (dbUser) {
            token.id = dbUser._id.toString();
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.role = dbUser.role;
          } else {
            console.warn("WARN: Google user authenticated but not found in DB during JWT callback.");
          }
        } catch (error) {
          console.error("ERROR: Database error in Google JWT callback:", error);
        }
      }

  if (account?.provider === "credentials" && user) {
    token.id = user.id
    token.name = user.name
    token.email = user.email
    token.role = user.role
  }

  if (trigger === "update") {
    token.role = session.role
  }

  return token
},

    session({session,token}){
        if(session.user){
            session.user.id=token.id as string,
            session.user.name=token.name  as string,
            session.user.email=token.email as string,
            session.user.role=token.role as string
        }
        return session
    }
  },
  pages:{
    signIn:"/login",
    error:"/login"
  },
  session:{
    strategy:"jwt",
   maxAge: 10 * 24 * 60 * 60  
  },
  secret:process.env.NEXTAUTH_SECRET
})