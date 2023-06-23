// Register route folder

import bcrypt  from 'bcrypt';

import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';



// CREATING THE USER OR REGISTER
export async function POST (
    request: Request
) {
    const body = await request.json();
    const  {
        email,
        name,
        password
    } = body;

    // 12 is saltRounds
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data:{
            email,
            name,
            hashedPassword
        }
    });

    return NextResponse.json(user);
}