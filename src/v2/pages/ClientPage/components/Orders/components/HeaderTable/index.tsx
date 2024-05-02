import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import OrderFormDialog from 'v2/components/OrderFormDialog';
import { Button } from 'v2/uikit';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { useCreateOrder } from 'api/mutations/orderMutation';
import { useAuthData } from 'contexts/AuthContext';
import { IOrder } from 'interfaces/order.interface';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { permissions } = useAuthData();
  const { t } = useTranslation();

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
        <div className="link">
          {permissions.includes('orders:create') && (
            <Button className="big-btn" onClick={() => void setOpenNewPrepayment(true)}>
              {t('order.new')}
            </Button>
          )}
        </div>
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
