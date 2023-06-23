// FOR TRIPS Page

import getCurrentUser from "../actions/getCurrentUser";
import getListings from "../actions/getListings";


import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import PropertiesClient from "./PropertiesClient";



const PropertiesPage =async () => {
    
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
    const listings = await getListings({
        // passing the currentUser to get current user Properties
        userId: currentUser.id
    });

    if (listings.length === 0) {
        return (
            <EmptyState 
                title="No Properties found"
                subtitle="Looks like you have no properties"
            />
        )
    };

    return (
        <ClientOnly>
            <PropertiesClient
                listings = {listings}
                currentUser={currentUser} 
                
            />
        </ClientOnly>
    )
}

export default PropertiesPage;