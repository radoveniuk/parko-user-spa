import { useQueryClient } from 'react-query';
import { useFilters } from 'v2/components/Filters';

import {
  useCreateProjectAccommodation,
  useDeleteProjectAccommodation,
  useUpdateProjectAccommodation,
} from 'api/mutations/projectAccommodationMutation';
import { IProjectAccommodation } from 'interfaces/projectAccommodation.interface';

const useProjectAccommodationActions = () => {
  const queryClient = useQueryClient();
  const { filtersState } = useFilters();
  const queryKey = ['projectAccommodations', JSON.stringify(filtersState)];

  const createProjectAccommodation = useCreateProjectAccommodation();
  const updateProjectAccommodation = useUpdateProjectAccommodation();
  const deleteProjectAccommodation = useDeleteProjectAccommodation();

  const create = (data: IProjectAccommodation) => createProjectAccommodation.mutateAsync(data).then((res) => {
    const participations: IProjectAccommodation<true>[] = queryClient.getQueryData(queryKey) || [];
    queryClient.setQueryData(queryKey, [res, ...participations]);
  });

  const update = (values: Partial<IProjectAccommodation>) => updateProjectAccommodation.mutateAsync(values).then((res) => {
    const participations: IProjectAccommodation<true>[] = queryClient.getQueryData(queryKey) || [];
    queryClient.setQueryData(queryKey, participations.map((item) => item._id === res._id ? res : item));
  });

  const remove = (id: string) => {
    deleteProjectAccommodation.mutate(id);
    const oldItems = queryClient.getQueryData(queryKey) as IProjectAccommodation<true>[];
    queryClient.setQueryData(queryKey, oldItems.filter((item) => item._id !== id));
  };

  return { update, remove, create };
};

export default useProjectAccommodationActions;
