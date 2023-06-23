// for getting our Favorites listing

import prisma from '@/app/libs/prismadb';

import getCurrentUser from './getCurrentUser';


export default async function getFavoriteListings() {
    try{
        const currentUser = await getCurrentUser();

        if (!currentUser){
            return [];
        };

        const favorites = await prisma.listing.findMany({
            where: {
                id:{
                    // VERY IMP: in: simply means choose only among given array. in takes array , array of ids: for choosing those listings that is among the favorites ids array of current user
                    in:[...(currentUser.favoriteIds) || []]
                }
            }
        });

        const safeFavorites = favorites.map((favorite) => ({
            ...favorite,
            createdAt: favorite.createdAt.toISOString(),
        }));

        return safeFavorites;
    }
    catch (error: any) {   
        throw new Error(error);
    }
}