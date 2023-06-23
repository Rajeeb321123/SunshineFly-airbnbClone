'use client';





import  axios from 'axios';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import {useCallback, useState} from 'react';
import Button from '../Button';
import { signIn } from 'next-auth/react';

import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';
import {toast} from 'react-hot-toast'

// zustand:
import useLoginModal from '@/app/hooks/useLoginModal';
import Modal from './Modal';
import { JsxElement } from 'typescript';
import Heading from '../Heading';
import Input from '../inputs/Input';
import useRegisterModal from '@/app/hooks/useRegisterModal';
// make sure useRouter isnot from next/router
import { useRouter } from 'next/navigation';


const LoginModal = () => {

    const router = useRouter();

    // zustand:
    const registerModal = useRegisterModal();
    const loginModal= useLoginModal();

    const [isLoading, setisLoading] = useState(false);


    // we can directly use register in ,handlesubmit... as we arenot using map funciton with custom category input like in Rent modal.tsx
    const{
        register,
        handleSubmit,
        formState:{
            errors,
        }
    } = useForm<FieldValues>({
      defaultValues:{
        
        email:'',
        password:'',
      }
    }); 


    
    // onsSubmit function
    // handlesubmit form reacthookform will wrap onSubmit for many propuse like erros
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
      setisLoading(true);

    //  IMP: FOR SIGN IN USING NEXT AUTH
    // credentials is in our pages/api/auth/nextauth
        signIn('credentials', {
          ...data,
          // redirect false make sure page isnot reloaded : good user experience
          // and also we will refresh after response not before response
          redirect:false,

        })
        // after response
        .then((callback) => {
          setisLoading(false)

          // if login is successfull
          if(callback?.ok){
            toast.success('logged in');
            // to update our page
            router.refresh();
            // closing the login modal
            loginModal.onClose();
          }

          // if login is unsuccessfull
          if(callback?.error) {
            // showing the error
            toast.error(callback.error)
          }
        })
    }


    // toggle for switching login to register Modal
    const toggle = useCallback(() => {
      loginModal.onClose();
      registerModal.onOpen();
    },[loginModal, registerModal])


    const bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title='Welcome to SunshineFly'
          subtitle='Login to your account'
        />
        {/* email */}
        <Input 
          id= 'email'
          label= 'Email'
          disabled = {isLoading}
          register={register}
          errors={errors}
          required
        />
        
        
        {/* password field */}
        <Input 
          id= 'password'
          label= 'password'
          type='password'
          disabled = {isLoading}
          register={register}
          errors={errors}
          required
        />
        

      </div>
    );

    const footerContent = (
      <div className='flex flex-col gap-4 mt-3'>
        <hr />
        <Button
          outline
          label = 'Continue with Google'
          icon = {FcGoogle}
          onClick={()=> signIn('google')}
        />
        <Button
          outline
          label = 'Continue with GitHub'
          icon = {AiFillGithub}
          onClick={()=> signIn('github')}
        />
        <div
          className='
            text-neutral-500
            text-center
            mt-4
            font-light
          '
        >
          <div className=" justify-center flex row items-center gap-2">
            <div>
              First time using SunshineFly?
            </div>
            <div
              onClick={toggle}
              className='
                text-neutral-800
                cursor-pointer
                hover:underline
              '
            >
              Create an account
            </div>
          </div>

        </div>
      </div>
    )



  return (


    <Modal 
      disabled = {isLoading}
      // zustand hook
      isOpen = {loginModal.isOpen}
      title='Login'
      actionLabel='Continue'
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />

    
  )
}

export default LoginModal