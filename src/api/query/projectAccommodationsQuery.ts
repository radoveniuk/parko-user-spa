import { useQuery } from 'react-query';

import api from 'api/common';
import { AnyObject } from 'interfaces/base.types';
import { IProjectAccommodation } from 'interfaces/projectAccommodation.interface';

export const useGetProjectAccommodations = (params: Partial<IProjectAccommodation> = {}, queryOptions: AnyObject = {}) => {
  const request = (): Promise<IProjectAccommodation<true>[]> => api.get('/project-accommodations', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      ...params,
    },
  }).then(res => res.data.data as IProjectAccommodation<true>[]);
  return useQuery(['projectAccommodations', JSON.stringify(params)], request, { initialData: [], ...queryOptions });
};

export const useGetProjectAccommodation = (id: string) => {
  const request = (): Promise<IProjectAccommodation<true>> => api.get(`/project-accommodations/${id}`).then(res => res.data.data);
  return useQuery(['projectAccommodation', id], request, { enabled: !!id });
};
