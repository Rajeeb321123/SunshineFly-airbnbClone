// THESE IS A SERVER COMPONENT as we have [listingId]

// so we cant use useRouter but we can use the params

// FOR GETTING INDIVIDUAL LISTING
// INDIVIDUAL LISTING PAGE



import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";

import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";
import getReservations from "@/app/actions/getReservations";


// these structure is for getting the params from url . This is only used in server component
interface IParams {
  listingId?: string;
}

const listingPage = async( { params }: { params: IParams } ) => {

  const listing = await getListingById(params);
  const currentUser = await getCurrentUser();
  // sending the params as current listing ID as params
  // we will be using to block date already reserved
  const reservations = await getReservations(params);
  


  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    )
  }

  return (
   <ClientOnly>
      <ListingClient 
        listing = {listing}
        reservations={reservations}
        currentUser={currentUser}
      />
   </ClientOnly>
  )
}

export default listingPage;