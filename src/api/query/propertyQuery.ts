import { useQuery } from 'react-query';

import api from 'api/common';
import { AnyObject } from 'interfaces/base.types';
import { IProperty } from 'interfaces/property.interface';

export const useGetProperties = (params: AnyObject = {}, queryOptions: AnyObject = {}) => {
  const request = (): Promise<IProperty<true>[]> => api.get('/properties', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      ...params,
    },
  }).then(res => res.data.data);
  return useQuery(['properties', JSON.stringify(params)], request, { staleTime: 30000, ...queryOptions });
};

export const useGetPropertiesFilters = (params: AnyObject = {}, queryOptions: AnyObject = {}) => {
  const request = () => api.get('/properties-filters', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      ...params,
    },
  }).then(res => res.data.data);
  return useQuery(['properties-filters', JSON.stringify(params)], request, { initialData: [], ...queryOptions });
};

export const useGetProperty = (id: string) => {
  const request = (): Promise<IProperty<true>> => api.get(`/properties/${id}`).then(res => res.data.data);
  return useQuery(['property', id], request, { enabled: !!id });
};
