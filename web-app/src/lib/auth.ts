import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import prisma from "@/lib/prisma";


export const auth = betterAuth({
    // configure database {better auth require database to store user data}
    // I'll use an ORM (prisma)
    database:prismaAdapter(prisma ,{
        provider:'postgresql'
    }),

    //other options 
    emailAndPassword:{
        enabled:true
    },
    socialProviders:{
        google:{
            clientId:process.env.GOOGLE_CLIENT_ID as string,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },
         plugins: [
             admin(),
             nextCookies(),
        
        ] // make sure this is the last plugin in the array

})