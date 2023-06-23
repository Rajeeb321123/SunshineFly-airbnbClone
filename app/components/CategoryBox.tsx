'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { IconType } from 'react-icons'
import qs from 'query-string';


interface CategoryBoxProps {
    icon: IconType,
    label: string,
    selected?: boolean,
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
    icon: Icon,
    label,
    selected
}) => {

    const router = useRouter();
    const params = useSearchParams();
   
    




    const handleClick = useCallback(() => {


        let currentQuery = {};

        // if params exist or not null
        // query string to make object outof all of our parameter using query string
        if (params) {
            // parse provide data in object form with key value pair
            // below toString donot consider ?
            currentQuery = qs.parse(params.toString());

           


        }

        const updatedQuery: any = {
            ...currentQuery,
            // for updating the category when we click different category
            category: label,

        }

        // if we have already selected the category
        // if we want to deselect the category and remove it from the category in url
        if(params?.get('category') === label){
            delete updatedQuery.category
        }
        
        // generating url with newest query
        const url = qs.stringifyUrl({
            url: '/',
            // newest query 
            query: updatedQuery

        },
        // skipping keys if null value
        {skipNull:true})

        // pushing our generated url
        router.push(url);

    },[label, params, router]);

  return (
    <div
        onClick={handleClick}
        className={`
            flex
            flex-col
            items-center
            justify-center
            gap-2
            p-3
            border-b-2
            hover:text-neutral-800
            transition
            cursor-pointer
            ${selected ? 'border-b-neutral-800' : 'border-transparent'}
            ${selected ? 'text-neutral-800' : 'text-neutral-500'}
        `}
    >
        <Icon size={26} />
        <div className="font-medium text-sm">
            { label }
        </div>
    </div>
  )
}

export default CategoryBox