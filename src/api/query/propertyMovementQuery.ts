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
  return useQuery(['propertyMovements', JSON.stringify(params)], request, { staleTime: 3000, ...queryOptions });
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
  return useQuery(['propertyMovement-filters', JSON.stringify(params)], request, { ...queryOptions });
};

export const useGetPropertyMovement = (id: string) => {
  const request = (): Promise<IPropertyMovement<true>> => api.get(`/property-movements/${id}`).then(res => res.data.data);
  return useQuery(['propertyMovement', id], request, { enabled: !!id });
};
