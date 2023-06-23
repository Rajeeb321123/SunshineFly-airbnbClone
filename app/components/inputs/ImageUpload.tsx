'use client';


// For uploading images to cloundianry

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";
import { useRouter } from "next/navigation";

import useRentModal from "@/app/hooks/useRentModal";



// global variables
declare global {
    var cloudinary : any;
}

interface ImageUploadProps {
    onChange: ( value: string ) => void;
    value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onChange,
    value
}) => {
    const rentModal = useRentModal();
    const router = useRouter()

    // for Uploading
    const handleUpload = useCallback((result: any) => {

        onChange(result.info.secure_url);

    },[onChange]);

    
    
  return (
    <CldUploadWidget 
        onUpload={handleUpload}
        // create a upload unsigned upload preset in cloundaiary page and mention it here
        uploadPreset="sunshine-fly"
        options={{maxFiles:1}}

    >
        {({open}) => {

            // for cloudianry open error
            if(!open){
                rentModal.onClose();
                router.push('/customErrorPage');
                
            }
            return (
                // our upload section
                <div
                    // in documentation of cloudinary  there is only open() but may lead to error sometimes so we use open?.()
                    onClick={() =>  open() }
                    className="
                        relative
                        cursor-pointer
                        hover:opacity-70
                        transition
                        border-dashed
                        border-2
                        p-20
                        border-neutral-300
                        flex
                        flex-col
                        justify-center
                        items-center
                        gap-4
                        text-neutral-600
                    "
                >
                    <TbPhotoPlus size={50} />
                    <div className="font-semibold text-lg">
                        Click to upload
                    </div>
                    {
                        // for showing image after we choose our image
                        value && (
                            <div className="absolute inset-0 w-full h-full">
                                <Image 
                                    alt ="Upload"
                                    fill
                                    style={{ objectFit: 'cover'}}
                                    src = {value}
                                />
                            </div>
                        )
                    }
                </div>
            )
        }}

    </CldUploadWidget>
  )
}

export default ImageUpload