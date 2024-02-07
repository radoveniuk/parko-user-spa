import { useQuery } from 'react-query';

import api from 'api/common';
import { IClient } from 'interfaces/client.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

type SearchResult = {
  users: IUser[],
  projects: IProject[],
  clients: IClient[],
};

export const useGetSearchResults = (search: string) => {
  const request = (): Promise<SearchResult> => api.get('/search', { params: { search } }).then(res => res.data.data);
  return useQuery(['search', JSON.stringify(search)], request, { refetchOnWindowFocus: false, enabled: search.length > 3 });
};
