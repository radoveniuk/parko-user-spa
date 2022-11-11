import { useQuery } from 'react-query';

import api from 'api/common';
import { AnyObject } from 'interfaces/base.types';
import { IDictionary } from 'interfaces/dictionary.interface';
import { QueryOptions } from 'interfaces/query.types';

export const useGetDictionaries = (params: AnyObject = {}, options?: QueryOptions) => useQuery<IDictionary[]>(
  ['dictionaries', JSON.stringify(params)],
  () => api.get('/dictionaries', { params }).then((res) => res.data.data),
  {
    initialData: [],
    refetchOnWindowFocus: false,
    ...options,
  },
);

export const useGetDictionary = (id: string, options?: QueryOptions) => useQuery<IDictionary>(
  ['dictionaries', id],
  () => api.get(`/dictionaries/${id}`).then((res) => res.data.data),
  {
    initialData: [],
    refetchOnWindowFocus: false,
    ...options,
  },
);
