// server component

import prisma from '@/app/libs/prismadb';

interface IParams {

    // we should be able to query the reservation by listingId or userId or authorId
    listingId?: string;
    userId?: string;
    // author meant owner of property
    authorId?: string;

}

export default async function getReservations(
    params: IParams
) {
    try {

        const { listingId, userId, authorId } = params;

        const query: any = {};

        if (listingId) {
            // for listing page
            query.listingId = listingId;
        };

        if (userId) {
            // for trips page
            // userID is current user
            query.userId = userId;
        };

        if (authorId) {
            // for reservation page
            // author id is the the author of property
            query.listing = { userId: authorId }
        };


        const reservations = await prisma.reservation.findMany({

            where: query,

            // imp: include provide : Nested reads allow you to read related data from multiple tables in your database
            // including listing for query by authorID
            include: {
                listing: true
            },

            orderBy: {
                createdAt: 'desc'
            }
        });

        const safeReservations = reservations.map(
            (reservation) => ({
                ...reservation,
                createdAt: reservation.createdAt.toISOString(),
                startDate: reservation.startDate.toISOString(),
                endDate: reservation.endDate.toISOString(),
                // for listing included in or inside reservation response 
                listing: {
                    ...reservation.listing,
                    createdAt: reservation.listing.createdAt.toISOString(),
                }
            })
        );

        return safeReservations;
    }
    catch (error: any) {
        throw new Error(error);
    }


}