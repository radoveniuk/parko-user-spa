import api from 'api/common';
import { AnyObject } from 'interfaces/base.types';
import { IProject } from 'interfaces/project.interface';
import { useQuery } from 'react-query';

export const useGetProjects = (params: AnyObject = {}) => {
  const request = (): Promise<IProject[]> => api.get('/projects', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      ...params,
    },
  }).then(res => res.data.data);
  return useQuery(['projects', JSON.stringify(params)], request, { initialData: [], refetchOnWindowFocus: false });
};
