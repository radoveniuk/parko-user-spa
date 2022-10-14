import { useMutation } from 'react-query';

import api from 'api/common';
import { IProject } from 'interfaces/project.interface';

export const useCreateProjectMutation = () => {
  const request = (data: IProject) => api.post('/projects', data).then(res => res.data.data);
  return useMutation(request);
};

export const useUpdateProjectMutation = () => {
  const request = (data: Partial<IProject> & { _id: string }) => api.put(`/projects/${data._id}`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useDeleteProjectMutation = () => {
  const request = (id: string) => api.delete(`/projects/${id}`).then(res => res.data.data);
  return useMutation(request);
};
