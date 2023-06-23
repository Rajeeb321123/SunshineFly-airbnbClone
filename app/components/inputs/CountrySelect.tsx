'use client';

import useCountries from '@/app/hooks/useCountries';
import Select from 'react-select';


// creating a type
export type CountrySelectValue = {
    flag: string;
    label: string;
    latlng:number[];
    region: string;
    value: string;
}



interface CountrySelectProps {
    value?: CountrySelectValue;
    onChange: (value: CountrySelectValue) => void;
    
}


const CountrySelect: React.FC<CountrySelectProps> = ({
    value,
    onChange,
}) => {

    const { getAll }  = useCountries();
    
    
    



  return (
    <div className='z-10' >
        <Select 
            placeholder = "Anywhere"
            isClearable
            options  = { getAll()}
            value={value}
            onChange={(value) => onChange(value as CountrySelectValue)}
            // our custom options
            formatOptionLabel={(option: any ) => (
                <div className='flex flex-row items-center gap-3 '>
                    <div>{option.flag}</div>
                    <div>
                        {option.label},
                        <span className='text-neutral-500 ml-1'>
                            {option.region}
                        </span>
                    </div>
                </div>
            )}
            // classNames( not className ) is used for inner component in Select package
            classNames={{
                control: () => 'p-3 border-2 ',
                input: () => 'text-lg',
                option: () => 'text-lg z-10 '
            }}
            theme={(theme) => ({
                ...theme,
                borderRadius: 6,
                colors: {
                  ...theme.colors,
                  primary: 'black',
                  primary25: '#ffe4e6'
                }
              })}
        />
    </div>
  )
}

export default CountrySelect