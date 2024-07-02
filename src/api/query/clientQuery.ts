import { useQuery, useQueryClient } from 'react-query';

import api from 'api/common';
import { AnyObject } from 'interfaces/base.types';
import { IClient } from 'interfaces/client.interface';
import { QueryOptions } from 'interfaces/query.types';

export const useGetClients = (params: AnyObject = {}, options: AnyObject = {}) => {
  const request = (): Promise<IClient[]> => api.get('/clients', { params }).then(res => res.data.data);
  return useQuery(['clients', JSON.stringify(params)], request, { staleTime: 300_000, ...options });
};

export const useGetClient = (id: string, options?: QueryOptions) => {
  const request = (): Promise<IClient> | undefined => {
    if (!id) return;
    return api.get(`/clients/${id}`).then(res => res.data.data);
  };
  return useQuery<IClient | undefined>(['client', id], request, { enabled: !!id, ...options });
};

export const useGetCachedClient = (id: string) => {
  const queryClient = useQueryClient();
  const cachedClients: IClient[] | undefined = queryClient.getQueryData(['clients', JSON.stringify({})]);
  const { data: client } = useGetClient(id, { enabled: !cachedClients?.length && !!id });
  if (!cachedClients?.length) return client;

  return cachedClients.find((client) => client._id === id);
};
