import { useMutation } from 'react-query';

import api from 'api/common';
import { IResidence } from 'interfaces/residence.interface';

type mutationData = {
  data: IResidence;
  notificate: boolean;
}

export const useCreateResidence = () => {
  const request = ({ data, notificate = true }: mutationData) => api.post(`/residences?notificate=${notificate}`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useUpdateResidence = () => {
  const request = ({ data, notificate = true }: mutationData) => api.put(
    `/residences/${data._id}?notificate=${notificate}`, data).then(res => res.data.data,
  );
  return useMutation(request);
};

export const useDeleteResidence = () => {
  const request = (id: string) => api.delete(`/residences/${id}`).then(res => res.data.data);
  return useMutation(request);
};
