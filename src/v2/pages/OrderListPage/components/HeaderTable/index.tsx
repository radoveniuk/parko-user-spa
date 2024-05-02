import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import OrderFormDialog from 'v2/components/OrderFormDialog';
import { Button } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { useCreateOrder } from 'api/mutations/orderMutation';
import { PlusIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { IOrder } from 'interfaces/order.interface';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

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
      <ListTableHeader title={`${t('navbar.orders')}: ${count}`}>
        {permissions.includes('orders:create') && (
          <div className="link">
            <IconButton className="small-btn primary" onClick={() => void setOpenNewPrepayment(true)}><PlusIcon size={25} /></IconButton>
            <Button className="big-btn" onClick={() => void setOpenNewPrepayment(true)}>
              {t('order.new')}
            </Button>
          </div>
        )}
      </ListTableHeader>
      <OrderFormDialog
        open={openNewPrepayment}
        onClose={() => void setOpenNewPrepayment(false)}
        onSave={createNewOrderHandler}
      />
    </>
  );
};

export default memo(HeaderTable);
