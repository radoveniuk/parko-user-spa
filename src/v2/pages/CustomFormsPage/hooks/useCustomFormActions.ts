import { useQueryClient } from 'react-query';

import {
  useCreateCustomFormMutation,
  useDeleteCustomFormMutation,
  useUpdateCustomFormMutation,
} from 'api/mutations/customFormsMutation';
import { ICustomForm } from 'interfaces/form.interface';

const useCustomFormActions = () => {
  const queryClient = useQueryClient();
  const queryKey = ['customForms', JSON.stringify({})];

  const createField = useCreateCustomFormMutation();
  const updateField = useUpdateCustomFormMutation();
  const deleteField = useDeleteCustomFormMutation();

  const create = async (data: ICustomForm) => {
    const createdRes = await createField.mutateAsync(data);
    const prevData = queryClient.getQueryData(queryKey) as ICustomForm[];

    queryClient.setQueryData(queryKey, [createdRes, ...prevData]);
  };

  const update = async (data: ICustomForm) => {
    const updateRes = await updateField.mutateAsync(data);
    const prevData = queryClient.getQueryData(queryKey) as ICustomForm[];

    queryClient.setQueryData(queryKey, prevData.map(item => item._id === updateRes._id ? updateRes : item));
  };

  const remove = (id: string) => {
    deleteField.mutate(id);
    const prevData = queryClient.getQueryData(queryKey) as ICustomForm[];
    queryClient.setQueryData(queryKey, prevData.filter(item => item._id !== id));
  };

  return { create, update, remove };
};

export default useCustomFormActions;
