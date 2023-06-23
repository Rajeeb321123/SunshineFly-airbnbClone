'use client';

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import { IconType } from "react-icons";
import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";
import dynamic from "next/dynamic";

// we cant directly import leaflet as it is greatly supported in react
// import Map from "../Map";
// Very IMP: for our map: use Dynamic import of component
const Map = dynamic(() => import('../Map'),{
  //ssr means server side rendering loading
  ssr: false
});


interface ListingInfoProps {
  user: SafeUser;
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  category: {
    icon: IconType;
    label: string;
    description: string;
  } | undefined;
  locationValue: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  category,
  locationValue,
}) => {

  const { getByValue } = useCountries();
  const coordinates = getByValue(locationValue)?.latlng;

  return (
    <div className="col-span-4 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div
          className="
              text-xl
              font-semibold
              flex
              flex-row
              items-center
              gap-2
              "
        >
          <div>Hosted by {user?.name}</div>
          <Avatar
            src={user?.image}
          />
        </div>
        <div
          className="
                flex
                flex-row
                items-center
                gap-4
                font-light
                text-neutral-500
              "
        >
          <div>
            {guestCount} guests
          </div>
          <div>
            {roomCount} rooms
          </div>
          <div>
            {bathroomCount} bathrooms
          </div>


        </div>
      </div>
      <hr />

      {category && (
        <ListingCategory
          icon={category.icon}
          label={category.label}
          description={category.description}
        />
      )}
      <hr />
      <div className="text-lg font-light text-neutral-500">
        {description}
      </div>
      <hr />
      {/* for map */}
      <Map center={coordinates} />

    </div>
  )
}

export default ListingInfo