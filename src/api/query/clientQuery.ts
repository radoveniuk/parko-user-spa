import { useQuery, useQueryClient } from 'react-query';

import api from 'api/common';
import { AnyObject } from 'interfaces/base.types';
import { IClient } from 'interfaces/client.interface';
import { QueryOptions } from 'interfaces/query.types';

export const useGetClients = (params: AnyObject = {}) => {
  const request = (): Promise<IClient[]> => api.get('/clients', params).then(res => res.data.data);
  return useQuery(['clients', JSON.stringify(params)], request, { initialData: [], refetchOnWindowFocus: false });
};

export const useGetClient = (id: string, options?: QueryOptions) => {
  const request = (): Promise<IClient> => api.get(`/clients/${id}`).then(res => res.data.data);
  return useQuery(['client', id], request, { enabled: !!id, ...options });
};

export const useGetCachedClient = (id: string) => {
  const queryClient = useQueryClient();
  const clients: IClient[] | undefined = queryClient.getQueryData(['clients', '{}']);
  if (!clients?.length) return null;

  return clients.find((client) => client._id === id);
};
