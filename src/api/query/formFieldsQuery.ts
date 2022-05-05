import api from 'api/common';
import { useQuery } from 'react-query';

export const useGetCountries = () => {
  const countriesRequest = (): Promise<string[]> => api.get('https://restcountries.com/v3.1/all')
    .then(res => res.data.map((countryData: any) => countryData.name.common).sort());
  return useQuery('countries', countriesRequest, { refetchOnWindowFocus: false });
};
