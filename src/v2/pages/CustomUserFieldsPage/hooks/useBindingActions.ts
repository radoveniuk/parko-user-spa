import { useQueryClient } from 'react-query';

import {
  useCreateCustomFormFieldSectionBindingMutation,
  useDeleteCustomFormFieldSectionBindingMutation,
  useUpdateCustomFormFieldSectionBindingMutation,
} from 'api/mutations/customFormsMutation';
import { ICustomFormFieldSectionBinding } from 'interfaces/form.interface';

const useBindingActions = () => {
  const createBindingMutation = useCreateCustomFormFieldSectionBindingMutation();
  const deleteBindingMutation = useDeleteCustomFormFieldSectionBindingMutation();
  const updateBindingMutation = useUpdateCustomFormFieldSectionBindingMutation();
  const queryClient = useQueryClient();
  const queryKey = ['customFormFieldSectionBindings', JSON.stringify({})];

  const create = async (data: ICustomFormFieldSectionBinding) => {
    const prevBindings: ICustomFormFieldSectionBinding[] = queryClient.getQueryData(queryKey) || [];
    const response = await createBindingMutation.mutateAsync(data);
    queryClient.setQueryData(queryKey, [...prevBindings, response]);
  };

  const update = async (data: ICustomFormFieldSectionBinding) => {
    const prevBindings: ICustomFormFieldSectionBinding[] = queryClient.getQueryData(queryKey) || [];
    const response = await updateBindingMutation.mutateAsync(data);
    queryClient.setQueryData(queryKey, prevBindings.map((item) => item._id === response._id ? response : item));
  };

  const remove = async (id: string) => {
    const prevBindings: ICustomFormFieldSectionBinding[] = queryClient.getQueryData(queryKey) || [];
    deleteBindingMutation.mutate(id);
    queryClient.setQueryData(queryKey, prevBindings.filter(item => item._id !== id));
  };

  return { create, update, remove };
};

export default useBindingActions;
