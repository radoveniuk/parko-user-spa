import { useQueryClient } from 'react-query';

import { useDeleteDayoffMutation, useUpdateDayoffMutation } from 'api/mutations/dayoffMutation';
import { useFilters } from 'components/shared/Filters';
import { IDayOff } from 'interfaces/dayoff.interface';
import { IUser } from 'interfaces/users.interface';

const useDayoffMutations = () => {
  const queryClient = useQueryClient();
  const { debouncedFiltersState } = useFilters();
  const queryKey = ['daysoff', JSON.stringify(debouncedFiltersState)];
  const updateDayoffMutation = useUpdateDayoffMutation();
  const deleteDayoffMutation = useDeleteDayoffMutation();

  const update = (data: IDayOff, values: Partial<IDayOff>) => {
    const oldItems = queryClient.getQueryData(queryKey) as IDayOff[];
    const users: IUser[] = queryClient.getQueryData(['users-filter', JSON.stringify({})]) || [];
    const valuesUser = users.find((user) => user._id === values.user);

    const user = data.user as IUser;

    queryClient.setQueryData(
      queryKey, oldItems.map((item) => item._id === data._id ? { ...data, ...values, user: valuesUser?._id !== user._id ? valuesUser : user } : item),
    );
    updateDayoffMutation.mutate({ ...values, user: values.user as string, _id: data._id });
  };

  const remove = (data: IDayOff) => {
    deleteDayoffMutation.mutate(data._id);
    const oldItems = queryClient.getQueryData(queryKey) as IDayOff[];
    queryClient.setQueryData(queryKey, oldItems.filter((item) => item._id !== data._id));
  };

  return { updateDayoff: update, removeDayoff: remove };
};

export default useDayoffMutations;
