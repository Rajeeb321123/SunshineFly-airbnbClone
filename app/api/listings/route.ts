// for listing

import { NextResponse } from "next/server";

import prisma from '@/app/libs/prismadb';
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST (
    request: Request
){

    const currentUser = await getCurrentUser();
    // making sure we are logged in and there is current user
    if (!currentUser) {
        return NextResponse.error()
    }

    

    const body = await request.json();

    // desturcture from the body
    const {

        title,
        description,
        imageSrc,
        category,
        roomCount,
        bathroomCount,
        guestCount,
        location,
        price,

    } = body;


    // in reality this code for checking no values doesnot do anything , just look at the logic
    // imp: if one of the value is missing, we will throw an error
    Object.keys(body).forEach((value: any) => {
        if (!body[value]) {
            NextResponse.error();
        }


    });

    const listing = await prisma.listing.create({
        data: {
            title,
            description,
            imageSrc,
            category,
            roomCount,
            bathroomCount,
            guestCount,
            locationValue: location.value,
            // 10 is radix of integer: 10 means numbers from 0 to 9
            price: parseInt(price, 10),
            userId: currentUser.id,        
        }
    });

    return NextResponse.json(listing);
}