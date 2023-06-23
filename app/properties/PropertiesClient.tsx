'use client';

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { error } from "console";

import Container from "../components/Container";
import { SafeListing, SafeUser } from "../types";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";



interface PropertiesClientProps {
    listings: SafeListing[];
    currentUser?: SafeUser | null;
};

const PropertiesClient: React.FC<PropertiesClientProps> = ({
    listings,
    currentUser,
}) => {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');

    const onCancel = useCallback((id: string) => {
        setDeletingId(id);

        axios.delete(`/api/listings/${id}`)
            .then(() => {
                toast.success('Listing deleted');
                // for removing or getting the updated UI
                router.refresh();
            })
            .catch((error) => {
                toast.error(error?.response?.data?.error);
            })
            .finally(() => {
                setDeletingId('');
            });
    }, [router]);
    return (
        <div>
            <Container>
                <Heading
                    title="Properties"
                    subtitle="list of our properties"
                />
                <div
                    className="
                    mt-10
                    grid
                    grid-col-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    xl:grid-cols-5
                    2xl:grid-cols-6
                    gap-8
                "
                >
                    {listings.map((listing) => (
                        <ListingCard
                            key={listing.id}
                            data={listing}
                            
                            actionId={listing.id}
                            onAction={onCancel}
                            disabled={deletingId === listing.id}
                            actionLabel="Delete property"
                            currentUser={currentUser}
                        />
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default PropertiesClient;