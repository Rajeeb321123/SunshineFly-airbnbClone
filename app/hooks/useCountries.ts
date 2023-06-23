

//Hook  for our countries

import countries from 'world-countries';

// in countries.map((country)) countries act like type
const fromattedCountries = countries.map((country) => ({
    value: country.cca2,
    label: country.name.common,
    flag: country.flag,
    // lattidue and longitude
    latlng: country.latlng,
    region: country.region,
}));


const useCountries = () => {

    const getAll = () => fromattedCountries;

    const getByValue = (value: string) => {
        // how to use find in client and in hooks
        return fromattedCountries.find((item) => item.value === value);

    }

    return {
        getAll,
        getByValue
    }
}

export default useCountries;