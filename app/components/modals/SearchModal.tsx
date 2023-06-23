'use client';

import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";

import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import useSearchModal from "@/app/hooks/useSearchModal";
import Modal from "./Modal";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import qs from "query-string";
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2,
};

const SearchModal = () => {
    const router = useRouter();
    const params = useSearchParams();
    const searchModal = useSearchModal();

    const [location, setLocation] = useState<CountrySelectValue>();
    const [step, setStep] = useState(STEPS.LOCATION);
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);
    const [dateRange, setDateRange] = useState<Range>({
        // initializing wiht current date
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    });

    // dynamically importing map. look at RentModal.tsx for why we are using it
    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location]);

    const onBack = useCallback(() => {
        setStep((value) => value - 1);
    }, []);

    const onNext = useCallback(() => {
        setStep((value) => value + 1);
    }, []);


    // our main on submit function or Search button
    const onSubmit = useCallback(async () => {
        if (step !== STEPS.INFO) {
            return onNext();
        };

        // for serach  query
        let currentQuery = {};
        // from url
        if (params) {
            currentQuery = qs.parse(params.toString());
        };
        // our initial query
        const updateQuery: any = {
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount,
        };

        // VERY IMP: date query -> how we did it
        if (dateRange.startDate) {
            // formating the date  to ISO
            updateQuery.startDate = formatISO(dateRange.startDate);
        };
        if (dateRange.endDate) {
            updateQuery.endDate = formatISO(dateRange.endDate);
        };

        // changing the date to string as they will be going to url
        const url = qs.stringifyUrl({
            url: '/',
            query: updateQuery
        },
            // skipping the undefined key with no values
            { skipNull: true });

        setStep(STEPS.LOCATION);
        searchModal.onClose();
        // pushing our created url
        router.push(url);

    }, [
        step,
        searchModal,
        location,
        router,
        guestCount,
        roomCount,
        bathroomCount,
        dateRange,
        onNext,
        params,
    ]);

    // just or actionlabel or name on the button
    const actionLabel = useMemo(() => {
        if (step === STEPS.INFO) {
            return 'Search';
        }
        return "Next";
    },[step]);

    const secondaryActionLabel = useMemo(() => {
        if(step === STEPS.LOCATION) {
            return undefined;
        };
        return 'Back';
    },[step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading 
                title="Where do you wanan go?"
                subtitle="Find your perfect location!"
            />
            <CountrySelect 
                value={location}
                onChange={(value) => setLocation(value as CountrySelectValue)}

            />
            <hr />
            <Map 
                center={location?.latlng}
            />
        </div>
    );

    if (step === STEPS.DATE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="When do you plan to go?"
                    subtitle="Make sure everyone is free"
                />
                <Calendar 
                    dateRangeValue = {dateRange}
                    onChange={(value) => setDateRange(value.selection)}
                />
            </div>
        )
    };

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="More Information"
                    subtitle="Find your perfect place"
                />
                <Counter 
                    title="Guest"
                    subtitle="How many guest are coming?"
                    value={guestCount}
                    onChange={(value => setGuestCount(value))}
                />
                <Counter 
                    title="Room"
                    subtitle="How many rooms do you need?"
                    value={roomCount}
                    onChange={(value => setRoomCount(value))}
                />
                <Counter 
                    title="Bathroom"
                    subtitle="How many bathroom do you nedd?"
                    value={bathroomCount}
                    onChange={(value => setBathroomCount(value))}
                />
                
            </div>
        )
    }

    


    return (
        <Modal
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={onSubmit}
            title="Filters"
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
            body={bodyContent}
        />
    )
}

export default SearchModal