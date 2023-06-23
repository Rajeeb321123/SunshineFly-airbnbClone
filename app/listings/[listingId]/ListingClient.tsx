'use client';

// ListingClient component
// its not important to write component in client foldre
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Range } from "react-date-range";

import { SafeUser, SafeListing, SafeReservation } from "@/app/types";
import { categories } from "@/app/components/navbar/Categories";
import Container from "@/app/components/Container";
import ListingHead from "../../components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import useLoginModal from "@/app/hooks/useLoginModal";
import ListingReservation from "@/app/components/listings/ListingReservation";




const initialDateRange = {
  //just  initializing starting date and end date with current date
  startDate: new Date(),
  endDate: new Date(),
  // this key is used to identify the range 
  key: 'selection',
};


interface ListingClientProps {
  reservations?: SafeReservation[] ;

  // look at getListingById.ts for why the syntax is weird below
  listing: SafeListing & {
    user: SafeUser,
  };
  currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  // empty array initialization : So we dont get unecessary error
  reservations = [],
  currentUser,
}) => {

  // login if not logged in
  const loginModal = useLoginModal();
  const router = useRouter();

  // for already booked dates
  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservation: any) => {
      // Return the array of dates within the specified time interval.
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate)
      });

      dates = [...dates, ...range]
    });

    return dates;

  }, [reservations]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  // setting dataRange as type of Range using <Range>
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);


  
  // function for creating our Reservation
  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    };

    setIsLoading(true);



    axios.post('/api/reservations', {
      totalPrice,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      listingId: listing?.id,
    })
      .then(() => {
        toast.success('listing reserved');
        setDateRange(initialDateRange);
        // Redirect to /trips
        router.push('/trips');
      })
      .catch(() => {
        toast.error('something went wrong');
      })
      .finally(() => {
        setIsLoading(false);
      });


  }, [
    totalPrice,
    dateRange,
    listing?.id,
    router,
    currentUser,
    loginModal
  ]);

  useEffect(() => {

    // finding the dayCount
    if (dateRange.startDate && dateRange.endDate) {
      // differenceInCalenderDays donot consider hours , but differenceInDays does
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      // setting the price according to daycount
      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price + listing.price);
      }
      else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);




  const category = useMemo(() => {
    // array of categories in navbar
    return categories.find((items) =>
      (items.label === listing.category)
    )
  }, [listing.category]);



  return (
    <Container>
      <div
        className="
          max-w-screen-lg 
          mx-auto
        "
      >
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          />
          <div
            className="
              grid 
              grid-cols-1 
              md:grid-cols-7
              md:gap-10 
              mt-6
            "
          >
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
            />
            <div
              className="
                order-first 
                mb-10 
                md:order-last 
                md:col-span-3
              "
            >
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                // when we pass the fuction , there is something like reverse nesting. tricky but easy look the nesting
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default ListingClient