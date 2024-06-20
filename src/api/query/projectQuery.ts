import { useQuery } from 'react-query';

import api from 'api/common';
import { AnyObject } from 'interfaces/base.types';
import { IProject } from 'interfaces/project.interface';
import { QueryOptions } from 'interfaces/query.types';

export const useGetProjects = (params: AnyObject = {}, options?: QueryOptions) => {
  const request = (): Promise<IProject[]> => api.get('/projects', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      ...params,
    },
  }).then(res => res.data.data);
  return useQuery<IProject[]>(['projects', JSON.stringify(params)], request, { staleTime: 300_000, ...options });
};

export const useGetProject = (id: string) => {
  const request = (): Promise<IProject> => api.get(`/projects/${id}`).then(res => res.data.data);
  return useQuery(['project', id], request, { enabled: !!id, refetchOnWindowFocus: false });
};
