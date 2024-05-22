import { useQuery } from 'react-query';

import api from 'api/common';
import { AnyObject } from 'interfaces/base.types';
import { IPropertyMovement } from 'interfaces/propertyMovement.interface';

export const useGetPropertyMovements = (params: Partial<IPropertyMovement> = {}, queryOptions: AnyObject = {}) => {
  const request = (): Promise<IPropertyMovement<true>[]> => api.get('/property-movements', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      ...params,
    },
  }).then(res => res.data.data);
  return useQuery(['property-movements', JSON.stringify(params)], request, { staleTime: 30000, ...queryOptions });
};

export const useGetPropertyMovementsFilters = (params: AnyObject = {}, queryOptions: AnyObject = {}) => {
  const request = () => api.get('/property-movements-filters', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      ...params,
    },
  }).then(res => res.data.data);
  return useQuery(['property-movement-filters', JSON.stringify(params)], request, { staleTime: 30000, ...queryOptions });
};

export const useGetPropertyMovement = (id: string) => {
  const request = (): Promise<IPropertyMovement<true>> => api.get(`/property-movements/${id}`).then(res => res.data.data);
  return useQuery(['property-movement', id], request, { enabled: !!id });
};
