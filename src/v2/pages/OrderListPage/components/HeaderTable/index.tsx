import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Button, Stack } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';

import { useCreatePrepaymentMutation } from 'api/mutations/prepaymentMutation';
import { PlusIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import createId from 'helpers/createId';
import { IOrder } from 'interfaces/order.interface';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { IUser } from 'interfaces/users.interface';

import OrderDialog from '../OrderDialog';

import { HeaderWrapper } from './styles';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();
  const { role } = useAuthData();

  const [openNewPrepayment, setOpenNewPrepayment] = useState(false);
  const createPrepaymentMutation = useCreatePrepaymentMutation();
  const queryClient = useQueryClient();

  const createNewPrepaymentHandler = (values: Partial<IOrder>) => {
    setOpenNewPrepayment(false);
    const queryKey = ['orders', JSON.stringify({})];
    // const users: IUser[] = queryClient.getQueryData(['users-filter', JSON.stringify({})]) || [];
    // queryClient.setQueryData(
    //   queryKey, [
    //     { ...values, user: users.find((user) => user._id === values.user), _id: createId() },
    //     ...(queryClient.getQueryData(queryKey) as IPrepayment[]),
    //   ],
    // );
    // createPrepaymentMutation.mutateAsync(values).then((res) => {
    //   const [, ...oldItems] = queryClient.getQueryData(queryKey) as IPrepayment[];
    //   queryClient.setQueryData(queryKey, [res, ...oldItems]);
    // });
  };

  return (
    <>
      <HeaderWrapper>
        <Stack direction="row" gap="9px" alignContent="center">
          <span className="bold">{t('navbar.orders')}: {count}</span>
        </Stack>
        <Stack direction="row" gap="15px">
          <div className="link">
            <IconButton className="small-btn primary" onClick={() => void setOpenNewPrepayment(true)}><PlusIcon size={25} /></IconButton>
            {role === 'admin' && (
              <Button className="big-btn" onClick={() => void setOpenNewPrepayment(true)}>
                {t('order.new')}
              </Button>
            )}
          </div>
        </Stack>
      </HeaderWrapper>
      <OrderDialog
        open={openNewPrepayment}
        onClose={() => void setOpenNewPrepayment(false)}
        onSave={createNewPrepaymentHandler}
      />
    </>
  );
};

export default memo(HeaderTable);
