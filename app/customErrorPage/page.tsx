// VERY IMP: this is only for cloudinary upload page error . In all other error we use error.ts in app folder

'use client';
// just write these error is automatically connected to nextjs

import { useEffect } from "react";

import EmptyState from "@/app/components/EmptyState";

interface CustomErrorPageProps {
  error: Error
}

const CustomErrorPage: React.FC<CustomErrorPageProps> = ({ error }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return ( 
    <EmptyState
      title="Uh Oh"
      subtitle="Cloudinary load error. Just reload the page and open the image upload again. Its error of NextCloudinary . It happens rarely"
    />
   );
}
 
export default CustomErrorPage;