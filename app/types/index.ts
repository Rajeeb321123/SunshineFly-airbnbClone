// FOR MODIFY TYPES

// SAFE USER
// in USER date are unsanitized
// for safe user type with no date or date already turn to string for hydration error
// User is auto gen after we push schema to backend , it is User type that can be used in frontend
import { Listing, Reservation, User } from '@prisma/client';


// FOR SAFE USER
// we can use SafeUser type rather than User type
export type SafeUser = Omit<
User,
// changing the following field from User type
"createdAt" | "updatedAt" | "emailVerified"
> & {
    createdAt: string ,
    updatedAt: string | null,
    emailVerified: string | null,

};


// FOR SAFE LISTING
export type SafeListing = Omit<
Listing,
"createdAt"
> & {
    createdAt: string
};

// FOR SAFE RESERVATION
export type SafeReservation = Omit<
  Reservation, 
  "createdAt" | "startDate" | "endDate" | "listing"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  listing: SafeListing;
};