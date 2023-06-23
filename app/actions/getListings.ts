// for getting the listings
// IMP: remember this isnot any api call , its direct communication with our database ,so throw less error as far as possible



import prisma from '@/app/libs/prismadb';

export interface IListingParams {
    userId?: string;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string;
    locationValue?: string;
    category?: string
};



export default async function getListings(
    params: IListingParams
) {
    try {
        const {
            userId,
            guestCount,
            roomCount,
            bathroomCount,
            startDate,
            endDate,
            locationValue,
            category,
        } = params;


        // SEARCH LOGIC OR QUERY LOGIC: MOST IMP OF THIS PROJECT
        let query: any = {};

        if (userId) {
            query.userId = userId;
        };

        if (category) {
            query.category = category;
        };

        if (roomCount) {
            query.roomCount = {
                // gte means greater or eqaul
                // imp: we change count to string for pushing them in url so we need to rechange to number before backend query
                // VERY IMP: + sign below change roomCount from string to definite number
                gte: +roomCount
            }
        };
        if (guestCount) {
            query.roomCount = {
                gte: +guestCount
            }
        };
        if (bathroomCount) {
            query.bathroomCount = {
                gte: +bathroomCount
            }
        };

        if (locationValue) {
            query.locationValue = locationValue
        };

        // FILTER FOR DATE RANGE: little complicated
        if (startDate && endDate) {
            // NOT: reverse query
            // NOT: find what is in the query and return every expect query
            query.NOT = {
                reservations: {
                    some: {
                        // OR between two {},{} objects inside []
                        OR:
                            [
                                {
                                    // AND
                                    endDate: { gte: startDate },
                                    startDate: { lte: startDate }
                                },
                                {
                                    // AND
                                    startDate: { lte: endDate },
                                    endDate: { gte: startDate }
                                }
                            ]
                    }
                }
            }
        }



        const listings = await prisma.listing.findMany({
            // for empty query i.e {} then where doesnot matter or every listind is fetched as usual
            where: query,
            orderBy: {
                createdAt: 'desc'
            }
        });

        const safeListings = listings.map((listing) => ({
            ...listing,
            createdAt: listing.createdAt.toISOString(),
        }));

        return safeListings;
    }
    catch (error: any) {
        throw new Error(error);
    }
}