'use client';


import { useCallback, useEffect, useState } from "react";
import {IoMdClose} from 'react-icons/io';

import Button from "../Button";


interface ModalProps {
    isOpen?:boolean;
    onClose:() => void;
    onSubmit: () => void;
    title?: string;
    body?: React.ReactElement;
    footer?: React.ReactElement;
    actionLabel: string;
    disabled?: boolean;
    secondaryAction?: ()=> void;
    secondaryActionLabel?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    body,
    footer,
    actionLabel,
    disabled,
    secondaryAction,
    secondaryActionLabel,
}) => {

    const [showModal, setShowModal] = useState(isOpen);

    useEffect(() => {
        setShowModal(isOpen);
    },[isOpen]);

    const handleClose = useCallback(()=> {

        // breaking the funcion if modal is disabled
        if(disabled) { return; };

        setShowModal(false);

        // timeout for 3000 millisecond and then only onClose funciton run
        setTimeout(() => {
            onClose();
        },300 );

    },[disabled, onClose]);



    const handleSubmit = useCallback(
      () => {

        if(disabled) { return; };

        onSubmit();

      },
      [disabled, onSubmit]);


    
      const handleSecondaryAction = useCallback(() => {

        if(disabled ||  !secondaryAction ) { return;}

        secondaryAction();

      },[ disabled, secondaryAction ]);



    // returning nothing on UI if not opened or isOpen is false
    if(!isOpen) { return null };



  return (

    
    <>
    
    {/* 800/70 : 70% opacity of background : fading effect on background */}
    <div className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">

        <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-full lg:h-auto md:h-auto ">

            {/* Content */}
            {/* 300 is from above setTimeout */}
            <div className = {`translate duration-300 h-full ${showModal ? 'translate-y-0' :'translate-y-full'} ${showModal ? 'opacity-100' : 'opacity-0 '}  `}>

                <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

                    {/* Header */}
                    <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px] ">
                        <button
                        onClick={handleClose}
                        className="p-1 border-0 hover:opacity-0 transition absolute left-9  ">

                            <IoMdClose size={18} />
                        </button>
                        <div className="text-lg font-semibold ">
                                {title}
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="relative p-6 flex-auto">
                        {body}
                    </div>

                    {/* FOOTER */}
                    <div className="flex flex-col gap-2 p-6">
                        <div className="flex flex-row items-center gap-4 w-full">
                            
                            {secondaryAction && secondaryActionLabel && (

                                <Button 
                                outline  
                                label={secondaryActionLabel}
                                disabled = {disabled}
                                onClick={handleSecondaryAction}
                                />
                            )}

                            <Button   
                            label={actionLabel}
                            disabled = {disabled}
                            onClick={handleSubmit}
                            />
                        </div>
                        {footer}
                    </div>

                </div>
            </div>

        </div>


    </div>
    
    </>
  )
}

export default Modal