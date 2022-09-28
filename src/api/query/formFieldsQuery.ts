import { useQuery } from 'react-query';

import api from 'api/common';

export const useGetCountries = () => {
  const countriesRequest = (): Promise<string[]> => Promise.all([
    api.get('https://restcountries.com/v3.1/region/europe'),
    api.get('https://restcountries.com/v3.1/region/asia'),
  ])
    .then(([europe, asia]) => [...europe.data, ...asia.data].map((countryData: any) => countryData.translations.slk.common).sort());
  return useQuery('countries', countriesRequest, { refetchOnWindowFocus: false, cacheTime: Infinity });
};
