'use client';

import { useMemo, useState } from "react";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";

// we cant directly import leaflet as it is greatly supported in react
// import Map from "../Map";



// our rent modal is going to have many steps like category, location, no of room etc...
enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5
}


const RentModal = () => {

  const router = useRouter();
  const rentModal = useRentModal();
  const [isLoading, setIsLoading] = useState(false);
  // controlls for our steps
  // category is the just the initial value
  const [step, setStep] = useState(STEPS.CATEGORY);




  // LISTING
  // INITIIALIZING OUR FORM for LISTING
  // useForm<FieldValue> means useform is going to work with field value
  // IMP:// we can't directly use register  ,handlesubmit... as we are using map funciton with custom category input in body contet
  // so: we have to create work around 
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      // name of key should match with database
      category: '',
      location: 'null',
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,

      imageSrc:'',
      price: 1,
      title: '',
      description: '',
    }
  });


  
  // WORKAROUND for our forms
  // to watch our  values
  const category = watch('category');
  const location = watch('location');
  const guestCount  = watch('guestCount');
  const roomCount = watch('roomCount');
  const bathroomCount = watch('bathroomCount');
  const imageSrc = watch('imageSrc');

  // Very IMP: Dynamically importing a component
  //how to import leaflet in react, dynamically
  const Map = useMemo(() => dynamic(() => import('../Map'),
    // ssr means server side rendering loading
    {ssr:false}
  ),[location]); 

  // setValue of useform set the value but doesnot re-render the page
  // so use callback funciton to re-render the page
  // id are  like categories, locaiton,guestcount....etc
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  

  // function for backward 
  const onBack = () => {
    // on step back on enum
    setStep((value) => value - 1);
  };

  // function for forward
  const onNext = () => {
    setStep((value) => value + 1);
  };


  // MOST IMPORTANT:
  // For onSubmit
  const onSubmit: SubmitHandler<FieldValues> = (data) =>{

    // making sure on submit happen in only last step: Price
    if ( step !== STEPS.PRICE ) {
      return onNext();
    }

    setIsLoading(true);

    axios.post( '/api/listings',data )
      .then(() => {
        toast.success('listing Created');
        router.refresh();
        // reset the react-hook
        reset();
        setStep(STEPS.CATEGORY)
        rentModal.onClose();
      })
      .catch(() => {
        toast.error('Somethng went wrong')
      }).finally(() => {
        setIsLoading(false);
      })
  }




  // dynamic actionlabel  for buttons
  const actionLabel = useMemo(() => {
    // if we last step i.e price
    if (step === STEPS.PRICE) {

      return 'Create';
    }

    return 'NEXT'
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    // if the first step i.e category there is no back button
    if (step === STEPS.CATEGORY) {
      return undefined
    }

    return 'BACK'

  }, [step]);




  // we want Dynamic body content ,so we are using let
  // Note: it isnot same as clicking our continue button(button also change what step is shown) , this show different step according to our step state

  // for step === category
  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your place"
        subtitle="Pick a Place"
      />
      <div
        className="
        grid
        grid-col-1
        md:grid-cols-2
        gap-3
        max-h-[50vh]
        overflow-y-auto
        ">
        {/* categories constant array from navbar  */}
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">

            <CategoryInput
              // cate or category is value in CategoryInput , we could have writtern anything instead of cate or category
              // look how we change value of cate with label in CategoryINput
              // using our watcharound function setCustomValue which will set the value of field category
              onClick={(cate) => setCustomValue('category', cate)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />

          </div>
        ))}
      </div>
    </div>
  );

  // for step === LOCATION
  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div>
        <div className="flex flex-col gap-8">
          <Heading
            title="where is your place located"
            subtitle="Hepl guest find you"
          />
          <CountrySelect
            value={location}
            onChange={(value) => setCustomValue('location', value)}
          />
          <Map
            center={location?.latlng}
          />
        </div>
      </div>
    )
  };

  // for step === INFO
  if(step === STEPS.INFO) {
    bodyContent=(
      <div className="flex flex-col gap-8">
        <Heading 
          title="Share some basics about your place"
          subtitle="what amenities do you have"
        />
        <Counter 
          title="Guests"
          subtitle="How many guests do you allow ?"
          value={guestCount}
          onChange={(value) => setCustomValue('guestCount',value)}
        />
        <hr />
        <Counter 
          title="Rooms"
          subtitle="How many rooms do you have ?"
          value={roomCount}
          onChange={(value) => setCustomValue('roomCount',value)}
        />
        <hr />
        <Counter 
          title="Bathromm"
          subtitle="How many bathroom do you have ?"
          value={bathroomCount}
          onChange={(value) => setCustomValue('bathroomCount',value)}
        />
      </div>
    )
  }

  // for step === IMAGES
  if( step === STEPS.IMAGES ) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading 
          title="Add a Photo of your place"
          subtitle="Show guests what your place looks like!"
        />
        <ImageUpload 
          value={imageSrc}
          onChange={(value) => setCustomValue('imageSrc',value)}
        />
      </div>
    )
  }

  // for step === DESCRIPTION
  if( step === STEPS.DESCRIPTION ) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading 
          title="How would you describe your place"
          subtitle="Short and sweet works best"
        />
        <Input
          id = 'title'
          label="Title"
          disabled = {isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id = 'description'
          label="Description"
          disabled = {isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  }

  // for step === STEPS.PRICE
  if ( step === STEPS.PRICE ) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading 
          title = 'Now, set your price'
          subtitle="How much do you charge per night?"
        />
        <Input 
          id="price"
          label="Price"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  } 

  return (
    <Modal
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      // our countinue button or onSubmit
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      title="SunshineFly your Home"
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      body={bodyContent}

    />
  )
}

export default RentModal