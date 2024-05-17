import { useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { useFilters } from 'v2/components/Filters';

import { useCreatePropertyMovement, useDeletePropertyMovement, useUpdatePropertyMovement } from 'api/mutations/propertyMovementMutation';
import { IPropertyMovement } from 'interfaces/propertyMovement.interface';

const usePropertyMovementActions = () => {
  const queryClient = useQueryClient();
  const { filtersState } = useFilters();
  const createPropertyMovementMutation = useCreatePropertyMovement();
  const updatePropertyMovementMutation = useUpdatePropertyMovement();
  const deletePropertyMovementMutation = useDeletePropertyMovement();

  const queryKey = useMemo(() => ['property-movements', JSON.stringify(filtersState)], [filtersState]);

  const create = (data: IPropertyMovement) => {
    createPropertyMovementMutation.mutateAsync(data).then(() => {
      queryClient.refetchQueries({ queryKey });
    });
  };

  const update = (data: IPropertyMovement) => {
    const prevValues = queryClient.getQueryData(queryKey) as IPropertyMovement<true>[];
    queryClient.setQueryData(queryKey, prevValues.map((item) => item._id === data._id ? { ...item, ...data } : item));
    updatePropertyMovementMutation.mutate(data);
  };

  const remove = (id: string) => {
    const prevValues = queryClient.getQueryData(queryKey) as IPropertyMovement<true>[];
    queryClient.setQueryData(queryKey, prevValues.filter((item) => item._id !== id));
    deletePropertyMovementMutation.mutate(id);
  };

  return { create, update, remove };
};

export default usePropertyMovementActions;
