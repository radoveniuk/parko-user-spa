import { useQueryClient } from 'react-query';

import { useDeletePrepaymentMutation, useUpdatePrepaymentMutation } from 'api/mutations/prepaymentMutation';
import { useFilters } from 'v2/components/Filters';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { IUser } from 'interfaces/users.interface';

const useOrderMutations = () => {
  const queryClient = useQueryClient();
  const { debouncedFiltersState } = useFilters();
  const queryKey = ['prepayments', JSON.stringify(debouncedFiltersState)];
  const updatePrepaymentMutation = useUpdatePrepaymentMutation();
  const deletePrepaymentMutation = useDeletePrepaymentMutation();

  const update = (data: IPrepayment, values: Partial<IPrepayment>) => {
    const oldItems = queryClient.getQueryData(queryKey) as IPrepayment[];
    const users: IUser[] = queryClient.getQueryData(['users-filter', JSON.stringify({})]) || [];
    const valuesUser = users.find((user) => user._id === values.user);

    const user = data.user as IUser;

    queryClient.setQueryData(
      queryKey, oldItems.map((item) => item._id === data._id ? { ...data, ...values, user: valuesUser?._id !== user._id ? valuesUser : user } : item),
    );
    updatePrepaymentMutation.mutate({ ...values, _id: data._id });
  };

  const remove = (data: IPrepayment) => {
    deletePrepaymentMutation.mutate(data._id);
    const oldItems = queryClient.getQueryData(queryKey) as IPrepayment[];
    queryClient.setQueryData(queryKey, oldItems.filter((item) => item._id !== data._id));
  };

  return { updatePrepayment: update, removePrepayment: remove };
};

export default useOrderMutations;
