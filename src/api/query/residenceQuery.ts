import { useQuery } from 'react-query';

import api from 'api/common';
import { AnyObject } from 'interfaces/base.types';
import { IProject } from 'interfaces/project.interface';
import { QueryOptions } from 'interfaces/query.types';
import { IResidence } from 'interfaces/residence.interface';
import { IUser } from 'interfaces/users.interface';

export const useGetResidences = (params: AnyObject = {}, options?: QueryOptions) => {
  const request = (): Promise<IResidence[]> => api.get('/residences', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      ...params,
    },
  }).then(res => res.data.data);
  return useQuery<IResidence[]>(
    ['residences', JSON.stringify(params)], request, { initialData: [], ...options },
  );
};

export const useGetResidence = (id: string) => {
  const request = (): Promise<IResidence> => api.get(`/residences/${id}`).then(res => res.data.data);
  return useQuery(['residence', id], request, { enabled: !!id });
};

export const useGetResidenceFilterLists = () => {
  const request = (): Promise<{users: IUser[], projects: IProject[]}> => api.get('/residences-filter-lists')
    .then(res => res.data.data);
  return useQuery(
    ['residence', 'filters'],
    request,
  );
};
