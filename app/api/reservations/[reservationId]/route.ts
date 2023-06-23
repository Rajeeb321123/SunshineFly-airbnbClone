

import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb';


interface IParams {
    reservationId?: string;
};

export async function DELETE(
    request: Request,
    { params }: { params: IParams}
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    };

    const { reservationId } = params;

    if(!reservationId || typeof reservationId !== 'string') {
        throw new Error("Invalid ID");
    };

    const reservation = await prisma.reservation.deleteMany({
        where: {
            id: reservationId,
            // or because both author and reserver should be able to see the reservation
            OR: [
                // if the loggedin user is owner or author
                { userId: currentUser.id },
                
                //if the loggedIn user is the reserver of listing
                { listing: {
                    userId: currentUser.id
                }}
            ]
        }
    });

    return NextResponse.json(reservation);
    
}