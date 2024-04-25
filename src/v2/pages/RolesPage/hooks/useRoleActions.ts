import { useQueryClient } from 'react-query';

import { useCreateRole, useDeleteRole, useUpdateRole } from 'api/mutations/roleMutation';
import { IRole } from 'interfaces/role.interface';

const useRoleActions = () => {
  const queryClient = useQueryClient();
  const queryKey = ['roles', '{}'];

  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const create = async (data: IRole) => {
    const createdRes = await createRole.mutateAsync(data);
    const prevData = queryClient.getQueryData(queryKey) as IRole[];

    queryClient.setQueryData(queryKey, [createdRes, ...prevData]);
  };

  const update = async (data: IRole) => {
    await updateRole.mutateAsync(data);
    const prevData = queryClient.getQueryData(queryKey) as IRole[];

    queryClient.setQueryData(queryKey, prevData.map(item => item._id === data._id ? data : item));
  };

  const remove = (id: string) => {
    deleteRole.mutate(id);
    const prevData = queryClient.getQueryData(queryKey) as IRole[];
    queryClient.setQueryData(queryKey, prevData.filter(item => item._id !== id));
  };

  return { create, update, remove };
};

export default useRoleActions;
