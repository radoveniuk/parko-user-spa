import { useMutation } from 'react-query';

import api from 'api/common';
import { IProjectAccommodation } from 'interfaces/projectAccommodation.interface';

export const useCreateProjectAccommodation = () => {
  const request = (data: Partial<IProjectAccommodation>) =>
    api.post('/project-accommodations', data).then(res => res.data.data as IProjectAccommodation<true>);
  return useMutation(request);
};

export const useUpdateProjectAccommodation = () => {
  const request = (data: Partial<IProjectAccommodation>) =>
    api.put(`/project-accommodations/${data._id}`, data).then(res => res.data.data as IProjectAccommodation<true>);
  return useMutation(request);
};

export const useDeleteProjectAccommodation = () => {
  const request = (id: string) => api.delete(`/project-accommodations/${id}`).then(res => res.data.data as IProjectAccommodation);
  return useMutation(request);
};
