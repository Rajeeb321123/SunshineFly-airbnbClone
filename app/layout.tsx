
import { Nunito } from 'next/font/google';

import './globals.css'

import Navbar from './components/navbar/Navbar';
import ClientOnly from './components/ClientOnly';
import RegisterModal from './components/modals/RegisterModal';
import ToasterProvider from './providers/ToasterProvider';
import LoginModal from './components/modals/LoginModal';
import getCurrentUser from './actions/getCurrentUser';
import RentModal from './components/modals/RentModal';
import SearchModal from './components/modals/SearchModal';





export const metadata = {
  title: 'SunshineFly',
  description: 'airbnb clone',
}

const font = Nunito({
  subsets: ['latin'],
});



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // for getting the current logged in user
  const currentUser = await getCurrentUser();
  
  return (
    <html lang="en">
      <body className={font.className}>

        <ClientOnly>
          
          {/* for alert  */}
          <ToasterProvider />
          <SearchModal/>
          <LoginModal />
          <RegisterModal />
          <RentModal />
          <Navbar currentUser = {currentUser} />

        </ClientOnly>
        
        <div className="pb-20 pt-28">
          {children}
        </div>

      </body>
    </html>
  )
}



// NOTE:
// Make middleware.ts file outside app folder and copy below code
// // MIDDLEWARE

// getting error in nextjs 13.4.4 version so I didn't secure routes wiht middleware
// It is said it will be solve in 13.4.5 so waiting for update

// IMP: we shouldnot  to be able to go to '/favorites' and other pages even if we arenot logged in

// export { default } from "next-auth/middleware"

// export const config = { 
//   matcher: [
//     "/trips",
//     "/reservations",
//     "/properties",
//     "/favorites"
//   ]
// }


