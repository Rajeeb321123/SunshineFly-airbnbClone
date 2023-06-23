'use client';

import Image from 'next/image';
// make sure useRouter isnot from next/router
import { useRouter } from 'next/navigation';

const Logo =()=> {

    const router = useRouter();

    return (
        

        <Image 
            onClick={() => router.push('/')}
            alt = 'Log'
            className = " hidden md:block cursor-pointer   "
            width= '100'
            height = '100'
            
            src= '/images/logo.png'
            
            />
            
        
    )
}

export default  Logo ;