import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

import { IUser } from 'interfaces/users.interface';

const useUpdateCachedUserData = () => {
  const { id: userId } = useParams();
  const queryClient = useQueryClient();

  const updateFn = (values: Partial<IUser>) => {
    const prevValues = queryClient.getQueryData(['user-data', userId]) as IUser;

    queryClient.setQueryData(['user-data', userId], { ...prevValues, ...values });
  };

  return updateFn;
};

export default useUpdateCachedUserData;
