'use client';

import React from 'react'

import  Container from '../Container';
import Logo from './Logo';
import Search from './Search';
import UserMenu from './UserMenu';
import Categories from './Categories';

// User from "@prisma/client" is auto generated after we did push our schema in our backend , its like magic that we can use our Schema Type directly in our frontend. dont need this as we using our own created Safe user type
import { User } from '@prisma/client';


import { SafeUser } from '@/app/types';

interface NavbarProps{
  currentUser?: SafeUser | null 
}

const Navbar: React.FC<NavbarProps> = ({
  currentUser
}) => {

  return (
    <div className=' fixed w-full bg-white z-10 shadow-sm '>
        <div className=' p-4 border-b-[1px] '>

            <Container>
               <div className='flex flex-row items-center justify-between gap-3 md:gap-0'>

                <Logo />

                <Search />

                <UserMenu currentUser = {currentUser}/>

               </div>
            </Container>

            <Categories />
            
        </div>
    </div>
  )
}

export default Navbar