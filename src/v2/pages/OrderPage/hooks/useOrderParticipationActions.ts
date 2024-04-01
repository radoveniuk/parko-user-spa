import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

import { useCreateOrderParticipation, useDeleteOrderParticipation, useUpdateOrderParticipation } from 'api/mutations/orderParticipationMutation';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';

const useOrderParticipationActions = () => {
  const { id: orderId } = useParams();
  const queryClient = useQueryClient();
  const queryKey = ['orderParticipations', JSON.stringify({ order: orderId })];

  const createParticipation = useCreateOrderParticipation();
  const updateParticipation = useUpdateOrderParticipation();
  const deleteParticipation = useDeleteOrderParticipation();

  const create = (user: string) => createParticipation.mutateAsync({
    order: orderId as string,
    user,
    screaning: {},
    stages: [],
  }).then((res) => {
    const participations: IOrderParticipation<true>[] = queryClient.getQueryData(queryKey) || [];
    queryClient.setQueryData(queryKey, [res, ...participations]);
  });

  const update = (values: Partial<IOrderParticipation>) => updateParticipation.mutateAsync(values).then((res) => {
    const participations: IOrderParticipation<true>[] = queryClient.getQueryData(queryKey) || [];
    queryClient.setQueryData(queryKey, participations.map((item) => item._id === res._id ? res : item));
  });

  const remove = (id: string) => {
    deleteParticipation.mutate(id);
    const oldItems = queryClient.getQueryData(queryKey) as IOrderParticipation<true>[];
    queryClient.setQueryData(queryKey, oldItems.filter((item) => item._id !== id));
  };

  return { update, remove, create };
};

export default useOrderParticipationActions;
