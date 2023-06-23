'use client';

// LISTING CARD
import Image from "next/image";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {format} from "date-fns";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser, SafeListing, SafeReservation } from "@/app/types";
import HeartButton from "../HeartButton";
import Button from "../Button";




interface ListingCardProps {
    data: SafeListing;
    reservation?: SafeReservation;
    onAction?: (id: string) =>  void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null;
}

const ListingCard:React.FC<ListingCardProps> = ({
    data,
    reservation,
    onAction,
    disabled,
    actionLabel,
    actionId = '',
    currentUser,
}) => {

    const router = useRouter();
    const { getByValue } = useCountries(); 

    const location = getByValue(data.locationValue);

    const handleCancel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if(disabled) {
            return;
        }
        onAction?.(actionId);
    },[onAction, actionId, disabled]);

    const price = useMemo(() => {
        if(reservation) {
            return reservation.totalPrice;
        }
        return data.price;
    },[reservation, data.price]);

    // for showing reservatoin data: from and to and start and end
    const reservationDate = useMemo(() => {
        if (!reservation) {
            return null;
        }
        const start  = new Date(reservation.startDate);
        const end = new Date(reservation.endDate)

        return (
            `${format(start, 'PP')} - ${format(end, 'PP')}`
        ) 
    },[reservation])

  return (
    <div
        
        // col-span-1 is for grid we used in page.tsx
        // group is used for hover like in Image below . Group hover facilitate different hover action of different element in same hover
        className="col-span-1 cursor-pointer group"
    >
        <div className="flex flex-col gap-2 w-full">
            <div
                className="
                    aspect-square
                    w-full
                    relative
                    overflow-hidden
                    rounded-xl
                "
            >
                <Image 
                    onClick={() => router.push(`/listings/${data.id}`)} 
                    priority
                    fill
                    alt="Listing"
                    src={data.imageSrc}
                    className="
                        object-cover
                        h-full
                        w-full
                        group-hover:scale-110
                        transition
                    "
                />
                <div className="absolute top-3 right-3">
                    <HeartButton 
                        listingId = {data.id}
                        currentUser = {currentUser}
                    />
                </div>
            </div>

            <div className="font-semibold text-lg">
                {location?.region},{location?.label}
            </div>

            {/* reservation date or if no reservation then category */}
            <div className="font-light text-neutral-500">
                {reservationDate || data.category}
            </div>

            <div className="flex flex-row items-center gap-1">
                <div className="font-semibold">
                    ${price}
                </div>
                {!reservation && (
                    <div className="font-light"> night</div>
                )}
            </div>

            {onAction && actionLabel && (
                <Button 
                    disabled = {disabled}
                    small
                    label= {actionLabel}
                    onClick={handleCancel}
                />
            )}
        </div>
    </div>
  )

}

export default ListingCard