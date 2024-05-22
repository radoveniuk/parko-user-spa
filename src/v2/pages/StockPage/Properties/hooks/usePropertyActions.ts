import { useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { useFilters } from 'v2/components/Filters';

import { useCreateProperty, useDeleteProperty, useUpdateProperty } from 'api/mutations/propertyMutation';
import { IProperty } from 'interfaces/property.interface';

const usePropertyActions = () => {
  const queryClient = useQueryClient();
  const { filtersState } = useFilters();
  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();
  const deletePropertyMutation = useDeleteProperty();

  const queryKey = useMemo(() => ['properties', JSON.stringify(filtersState)], [filtersState]);

  const create = (data: IProperty) => {
    createPropertyMutation.mutateAsync(data).then(() => {
      queryClient.refetchQueries({ queryKey });
    });
  };

  const update = (data: IProperty) => {
    const prevValues = queryClient.getQueryData(queryKey) as IProperty<true>[];
    queryClient.setQueryData(queryKey, prevValues.map((item) => item._id === data._id ? { ...item, ...data } : item));
    updatePropertyMutation.mutate(data);
  };

  const remove = (id: string) => {
    const prevValues = queryClient.getQueryData(queryKey) as IProperty<true>[];
    queryClient.setQueryData(queryKey, prevValues.filter((item) => item._id !== id));
    deletePropertyMutation.mutate(id);
  };

  return { create, update, remove };
};

export default usePropertyActions;
