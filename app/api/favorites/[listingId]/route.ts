

import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb';

// for dynamic routing getting the params from url , this syntax is only use in server side component
interface IParams {
    listingId?: string;
}



// FOR ADDING to Favorite
export async function POST (
    request:Request,
    // below means just :one of  parmeter of functino is params and it is type of IParams 
    { params }: {params: IParams}
) {
    const currentUser = await getCurrentUser();

    if(!currentUser) {
        return NextResponse.error();
    };

    const { listingId } = params;

    if (!listingId || typeof listingId !== 'string' ) {
        throw new Error('Invalid ID')
    };
    
    // initializing the FavoriteId array variable with empty array  or if it has already favoriteId in our currentUser then populating it with those Ids
    let favoriteIds = [...(currentUser.favoriteIds) || []];

    // pushing lisitingId we got from param to our favoriteIDs array
    favoriteIds.push(listingId);

    const user = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            // updating the favoriteIds feild of user
            // we could have just written favoriteIds,
            favoriteIds: favoriteIds
        }
    });

    return NextResponse.json(user);
};




// FOR OUR REMOVING /DELETE FROM FAVORITE 
export async function DELETE(
    request: Request,
    { params }: { params: IParams}
) {
    const currentUser = await getCurrentUser();

    if ( !currentUser )  {
        return NextResponse.error();
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== 'string' ) {
        throw new Error('Invalid ID')
    };

    let favoriteIds = [...(currentUser.favoriteIds) || []];

    // filter out the id from our temporary favoriteIds array
    favoriteIds = favoriteIds.filter((id) => id !== listingId );

    const user = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data:{
            favoriteIds:favoriteIds
        }
    });

    return NextResponse.json(user);
}