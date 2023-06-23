'use client';





import  axios from 'axios';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import {useCallback, useState} from 'react';
import Button from '../Button';

import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';
import {toast} from 'react-hot-toast'

// zustand:
import useRegisterModal from '@/app/hooks/useRegisterModal';
import Modal from './Modal';
import { JsxElement } from 'typescript';
import Heading from '../Heading';
import Input from '../inputs/Input';
import { signIn } from 'next-auth/react';
import useLoginModal from '@/app/hooks/useLoginModal';


const RegisterModal = () => {

    // zustand:
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();

    const [isLoading, setisLoading] = useState(false);


    const{
        register,
        handleSubmit,
        formState:{
            errors,
        }
    } = useForm<FieldValues>({
      defaultValues:{
        name:'',
        email:'',
        password:'',
      }
    }); 


    
    // onsSubmit function
    // handlesubmit form reacthookform will wrap onSubmit for many propuse like erros
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
      setisLoading(true);

      // IMP:for registration
      axios.post( '/api/register', data )
        .then(()=> {
          toast.success("Successfully registered")
          registerModal.onClose();
          loginModal.onOpen();
        })
        .catch((error) => {
          toast.error("Something went wrong.");
        })
        .finally(() => {
          setisLoading(false);
        })

    }

     // toggle for switching  register Modal to  login Modal
     const toggle = useCallback(() => {
       registerModal.onClose();
       loginModal.onOpen();
    },[loginModal, registerModal])



    const bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title='Welcome to SunshineFly'
          subtitle='Create an account'
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
        
        {/* name field */}
        <Input 
          id= 'name'
          label= 'name'
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
          onClick={() => signIn('google')}
        />
        <Button
          outline
          label = 'Continue with GitHub'
          icon = {AiFillGithub}
          // for github signIn
          onClick={() => signIn('github')}
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
              Already have an account?
            </div>
            <div
              onClick={toggle}
              className='
                text-neutral-800
                cursor-pointer
                hover:underline
              '
            >
              Log in
            </div>
          </div>

        </div>
      </div>
    )



  return (


    <Modal 
      disabled = {isLoading}
      // zustand hook
      isOpen = {registerModal.isOpen}
      title='Register'
      actionLabel='Continue'
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />

    
  )
}

export default RegisterModal