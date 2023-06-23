// IMP: we shouldnot  to be able to go to '/favorites' and other pages even if we arenot logged in

export { default } from "next-auth/middleware"

export const config = { 
  matcher: [
    "/trips",
    "/reservations",
    "/properties",
    "/favorites"
  ]
}