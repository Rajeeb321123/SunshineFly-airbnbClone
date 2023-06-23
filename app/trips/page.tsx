// FOR TRIPS Page

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";

import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import TripsClient from "./TripsClient";



const TripsPage =async () => {
    
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState 
                    title="Unathorized"
                    subtitle="Please Login"
                />
            </ClientOnly>
        )
    };

    // 
    const reservations = await getReservations({
        // passing the currentUser to get his/her reserved trips
        userId: currentUser.id
    });

    if (reservations.length === 0) {
        return (
            <EmptyState 
                title="No trips found"
                subtitle="Looks like you havenot reserved any trips"
            />
        )
    };

    return (
        <ClientOnly>
            <TripsClient
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
    )
}

export default TripsPage;