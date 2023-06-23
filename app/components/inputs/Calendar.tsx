'use client';

import { DateRange, Range, RangeKeyDict } from "react-date-range";
// for calender stype
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

interface CalendarProps {
    dateRangeValue: Range;
    onChange: (value: RangeKeyDict ) => void;
    disabledDates?: Date[];
}

const Calendar: React.FC<CalendarProps> = ({
    dateRangeValue,
    onChange,
    disabledDates,
}) => {

  return (
    <DateRange 
        rangeColors={["#262626"]}

        ranges={[dateRangeValue]}
        date={new Date()}
        // we get the value we set in caleder as data with key selection(our created key) and then set in onChange fuction we import using interface
        onChange={onChange}
        direction="vertical"
        showDateDisplay
        // setting the minDate as current date so older date is disabled
        minDate={new Date()}
        disabledDates={disabledDates}
    />
  )
}

export default Calendar