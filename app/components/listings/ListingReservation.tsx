'use client';

import { Range } from "react-date-range";
import Calendar from "../inputs/Calendar";
import Button from "../Button";

interface ListingReservationProps {
    price: number;
    dateRange: Range;
    totalPrice: number;
    onChangeDate: (value: Range) => void;
    onSubmit: () => void;
    disabled?: boolean;
    disabledDates: Date[];
}



const ListingReservation:React.FC<ListingReservationProps> = ({
    price,
    dateRange,
    totalPrice,
    onChangeDate,
    onSubmit,
    disabled,
    disabledDates,
}) => {

  
  return (
    <div 
    className="
    bg-white 
      rounded-xl 
      border-[1px]
    border-neutral-200 
      overflow-hidden
    "
  >
    <div className="
    flex flex-row items-center justify-between gap-1 p-4">
      <div className=" flex flex-row gap-2 justify-between text-2xl font-semibold">
        $ {price}
        <span className="font-light text-xl text-neutral-600">
          night
        </span>
      </div>

      <div className="font-light text-neutral-600/50">
        Select the date range
      </div>
    </div>
    <hr />
    <Calendar
      dateRangeValue={dateRange}
      disabledDates={disabledDates}
      onChange={(value) => 
        // selection is the key value we created in listingClient.tsx
        onChangeDate(value.selection)}
    />
    <hr />
    <div className="p-4">
      <Button
      disabled = {disabled}
      label='Reserve'
      // we going to create Reservaion when onsubmit : look at listingClient.tsx
      onClick={onSubmit}
        
      />
    </div>
    <div className="
      p-4
      flex
      flex-row
      items-center
      justify-between
      font-semibold
      text-lg
    ">
      <div>
        Total
      </div>
      <div>
        $ {totalPrice}
      </div>
    </div>
        
    </div>
  )
}

export default ListingReservation