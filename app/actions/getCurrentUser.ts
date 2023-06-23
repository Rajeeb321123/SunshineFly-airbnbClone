// really cool way to fetch the loggedin user data using server components on next js
// we can getCurrentUser without an api call
// IMP: we can use getCurrentUser in both client and Server component
// very Imp: we dont want to break app by throwing error if there is no current user. so return null instead



import { getServerSession } from "next-auth/next";


// our created authOpions in pages/api/auth/[...nextauth].ts
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import prisma from "@/app/libs/prismadb";



// IMP: remember this isnot any api call , its direct communication with our database ,so throw less error as far as possible
export async function getSesssion() {
    // creating session for our created authoptions
    return await getServerSession(authOptions);
}


// for getting the user like in backend our MERN apps
export default async function getCurrentUser() {
    try {
        const session = await getSesssion();

        // if user doesnot exist or provided
        if(!session?.user?.email) {
            return null;
        }

        // finding the current user
        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            }
        })

        // if user isnot found in database
        if(!currentUser) {
            return null;
        }

        // sending date option can cause hydraiton error so stringfy them
        return {
            ...currentUser,
            createdAt: currentUser.createdAt.toISOString(),
            updatedAt: currentUser.updatedAt.toISOString(),
            emailVerified: currentUser.emailVerified?.toISOString() || null,
        };

    }
    catch(error: any) {
        return null;
    }
}