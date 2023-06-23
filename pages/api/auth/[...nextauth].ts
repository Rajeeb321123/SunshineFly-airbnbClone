
// NEXT AUTH
// next auth is still not supported for app folder in next 13 which will change in future
// pages folder is still not depreceatted in next 13 but it will in future

import NextAuth ,{ AuthOptions} from 'next-auth';
import { PrismaAdapter } from "@auth/prisma-adapter";

import prisma from '@/app/libs/prismadb';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials';

import bcrypt from 'bcrypt';






export const authOptions: AuthOptions = {
    
    adapter: PrismaAdapter(prisma ),
    
    
    providers: [
        GithubProvider({
            clientId:process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId:process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),

        // VERY IMP:
        // for checking the password and username {loginModal, SIGN IN using NExt Auth}
        CredentialsProvider({
            name: 'credentials',
            credentials: {
              email: { label: 'email', type: 'text' },
              password: { label: 'password', type: 'password' }
            },
            async authorize (credentials) {
                // if no email or password provided
                if( !credentials?.email || !credentials?.password ) {
                    throw new Error('Invalid credentials');
                }

                // user is from from our schema and we use npm prism push to push it
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if ( !user || !user?.hashedPassword ){
                    throw new Error('Invalid Credentials')
                }

                // checking the password is correct or not?
                const isCorrectPassword = await bcrypt.compare(
                    // checking provided password to hashed passord in user database
                    credentials.password,
                    user.hashedPassword
                );

                if (!isCorrectPassword) {
                    throw new Error ('Invalid Password');
                }

                // returning user to client
                return user;

            }
        })

    ],

    pages: {
        // whenever any error occur and weird callback we will be redirected to given page
        signIn: '/'
    },
    // error in terminals only if we are in development 
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,

};

export default NextAuth(authOptions);

