import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { pick } from 'lodash-es';

import { useGetCachedClient, useGetClient } from 'api/query/clientQuery';
import { useGetProjects } from 'api/query/projectQuery';
import usePageQueries from 'hooks/usePageQueries';
import { IClient } from 'interfaces/client.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

const ClientInfoContext = createContext<{
  client: IClient;
  projects: IProject[];
  selectedProfilesState: [IUser[], React.Dispatch<React.SetStateAction<IUser[]>>];
  selectedProjectsState: [IProject[], React.Dispatch<React.SetStateAction<IProject[]>>];
} | undefined>(undefined);

const ClientInfoProvider = ({ children }: PropsWithChildren<{}>) => {
  const pageQueries = usePageQueries();
  const cachedClient = useGetCachedClient(pageQueries.id);
  const { data: client } = useGetClient(pageQueries.id, { enabled: !cachedClient });
  const { data: projects = [] } = useGetProjects({ client: pageQueries.id }, { enabled: !!pageQueries.id });

  const selectedProjectsState = useState<IProject[]>([]);
  const selectedProfilesState = useState<IUser[]>([]);

  return (
    <ClientInfoContext.Provider value={{ client: cachedClient || client, projects, selectedProfilesState, selectedProjectsState }}>
      {children}
    </ClientInfoContext.Provider>
  );
};

export default ClientInfoProvider;

export const useGetClientInfo = () => {
  const context = useContext(ClientInfoContext);
  if (!context) throw new Error('Context is not connected');
  return pick(context, ['client', 'projects', 'profiles']);
};

export const useSelectedProfiles = () => {
  const context = useContext(ClientInfoContext);
  if (!context) throw new Error('Context is not connected');
  return context.selectedProfilesState;
};

export const useSelectedProjects = () => {
  const context = useContext(ClientInfoContext);
  if (!context) throw new Error('Context is not connected');
  return context.selectedProjectsState;
};
