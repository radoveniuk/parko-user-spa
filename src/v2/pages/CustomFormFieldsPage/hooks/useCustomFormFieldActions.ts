import { useQueryClient } from 'react-query';

import {
  useCreateCustomFormFieldMutation,
  useDeleteCustomFormFieldMutation,
  useUpdateCustomFormFieldMutation,
} from 'api/mutations/customFormsMutation';
import { ICustomFormField } from 'interfaces/form.interface';

const useCustomFormFieldActions = () => {
  const queryClient = useQueryClient();
  const queryKey = ['customFormFields', JSON.stringify({})];

  const createField = useCreateCustomFormFieldMutation();
  const updateField = useUpdateCustomFormFieldMutation();
  const deleteField = useDeleteCustomFormFieldMutation();

  const create = async (data: ICustomFormField) => {
    const createdRes = await createField.mutateAsync(data);
    const prevData = queryClient.getQueryData(queryKey) as ICustomFormField[];

    queryClient.setQueryData(queryKey, [createdRes, ...prevData]);
  };

  const update = async (data: ICustomFormField) => {
    await updateField.mutateAsync(data);
    const prevData = queryClient.getQueryData(queryKey) as ICustomFormField[];

    queryClient.setQueryData(queryKey, prevData.map(item => item._id === data._id ? data : item));
  };

  const remove = (id: string) => {
    deleteField.mutate(id);
    const prevData = queryClient.getQueryData(queryKey) as ICustomFormField[];
    queryClient.setQueryData(queryKey, prevData.filter(item => item._id !== id));
  };

  return { create, update, remove };
};

export default useCustomFormFieldActions;
