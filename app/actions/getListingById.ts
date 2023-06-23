// Remember it isnot route but direct communication with database

import prisma from '@/app/libs/prismadb';

interface IParams {
    listingId?: string;
}



export default async function getListingById(
    params:IParams
) {
   
    try{
        const { listingId } = params

        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId
            },
            // VERY IMP: include provide: Nested reads allow you to read related data from multiple tables in your database
           
            include: {
                
                user: true
            }
        });

        if (!listing) {
            return null;
        };

        return {
            ...listing,
            createdAt: listing.createdAt.toISOString(),
          
            // sanitizing our user from listing
            user: {
                ...listing.user,
                createdAt: listing.user.createdAt.toISOString(),
                updatedAt: listing.user.updatedAt?.toISOString() || null,
                emailVerified: listing.user.emailVerified?.toISOString() || null ,
            }
        };
    }
    catch (error: any) {
        throw new Error(error);
    }
}