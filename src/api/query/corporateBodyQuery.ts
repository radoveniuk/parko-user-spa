import { useQuery } from 'react-query';

import api from 'api/common';
import { ICorporateBody } from 'interfaces/corporateBody.interface';
import { QueryOptions } from 'interfaces/query.types';

export const useGetCorporateBodies = (search: string, options?: QueryOptions) => {
  const request = (): Promise<ICorporateBody[]> => api.get('/api/corporate-bodies', { params: { search } }).then(res => res.data.data);
  return useQuery<ICorporateBody[]>(['corporate-bodies', search], request, { initialData: [], refetchOnWindowFocus: false, ...options });
};

export const useGetCorporateBody = (portalId: string, options?: QueryOptions) => {
  const request = (): Promise<Required<ICorporateBody>> | undefined => {
    if (!portalId) return;
    return api.get(`/api/corporate-bodies/${portalId}`).then(res => res.data.data);
  };
  return useQuery(['corporate-body', portalId], request, { enabled: !!portalId, ...options });
};
