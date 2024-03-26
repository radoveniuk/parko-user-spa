import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Button, Stack } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';

import { useCreateOrder } from 'api/mutations/orderMutation';
import { PlusIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { IOrder } from 'interfaces/order.interface';

import OrderDialog from '../OrderDialog';

import { HeaderWrapper } from './styles';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();
  const { role } = useAuthData();

  const [openNewPrepayment, setOpenNewPrepayment] = useState(false);
  const createOrder = useCreateOrder();
  const queryClient = useQueryClient();

  const createNewOrderHandler = (values: IOrder) => {
    setOpenNewPrepayment(false);
    const queryKey = ['orders', JSON.stringify({})];
    createOrder.mutateAsync(values).then((res) => {
      const oldItems = queryClient.getQueryData(queryKey) as IOrder[];
      queryClient.setQueryData(queryKey, [res, ...oldItems]);
    });
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
        onSave={createNewOrderHandler}
      />
    </>
  );
};

export default memo(HeaderTable);
