import { useQueryClient } from 'react-query';

import { useCreateCustomFormSectionMutation, useDeleteCustomFormSectionMutation } from 'api/mutations/customFormsMutation';
import { ICustomFormSection } from 'interfaces/form.interface';

const useSectionActions = () => {
  const createSectionMutation = useCreateCustomFormSectionMutation();
  const deleteSectionMutation = useDeleteCustomFormSectionMutation();
  const queryClient = useQueryClient();
  const queryKey = ['customFormSections', JSON.stringify({ entity: 'user' })];

  const create = async (data: ICustomFormSection) => {
    const prevSections: ICustomFormSection[] = queryClient.getQueryData(queryKey) || [];
    const response = await createSectionMutation.mutateAsync({ ...data, entity: 'user' });
    queryClient.setQueryData(queryKey, [...prevSections, response]);
  };

  const remove = async (id: string) => {
    const prevSections: ICustomFormSection[] = queryClient.getQueryData(queryKey) || [];
    deleteSectionMutation.mutate(id);
    queryClient.setQueryData(queryKey, prevSections.filter(item => item._id !== id));
  };

  return { create, remove };
};

export default useSectionActions;
