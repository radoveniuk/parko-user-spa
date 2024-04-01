import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'v2/uikit';
import BreadCrumbs from 'v2/uikit/BreadCrumbs';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import Loader, { FullPageLoaderWrapper } from 'v2/uikit/Loader';
import { TabPanel, TabsContainer } from 'v2/uikit/Tabs';

import { useDeleteOrder } from 'api/mutations/orderMutation';
import { useGetOrderParticipations } from 'api/query/orderParticipationQuery';
import { useGetOrder } from 'api/query/orderQuery';
import { DeleteIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { themeConfig } from 'theme';

import OrderCard from './components/OrderCard';
import Participations from './components/Participations';
import { ContentWrapper, OrderPageWrapper } from './styles';

const OrderPageRender = () => {
  const { role } = useAuthData();
  const { t } = useTranslation();
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  // data
  const { data: orderData } = useGetOrder(orderId as string);
  const { data: participations = [] } = useGetOrderParticipations({ order: orderId });

  const deleteOrder = useDeleteOrder();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  if (!orderData) return <FullPageLoaderWrapper><Loader /></FullPageLoaderWrapper>;

  return (
    <OrderPageWrapper>
      <BreadCrumbs
        actions={(
          <>
            {role === 'admin' && (
              <Button color="error" onClick={() => void setOpenDeleteDialog(true)}>
                <DeleteIcon size={16} color={themeConfig.palette.error.main} />
                {t('delete')}
              </Button>
            )}
          </>
        )}
      >
        <Link to="/orders">{t('navbar.orders')}</Link>
        <Link to={`/order/${orderId}`}>{orderData.name}</Link>
      </BreadCrumbs>
      <div className="content">
        <OrderCard data={orderData} participations={participations} />
        <ContentWrapper>
          <TabPanel index={0}>
            <Participations participations={participations} order={orderData} />
          </TabPanel>
        </ContentWrapper>
      </div>
      <DialogConfirm
        open={openDeleteDialog}
        onClose={() => void setOpenDeleteDialog(false)}
        onSubmit={async () => {
          await deleteOrder.mutateAsync(orderId as string);
          navigate('/orders');
        }}
      />
    </OrderPageWrapper>
  );
};

const OrderPage = () => (
  <TabsContainer>
    <OrderPageRender />
  </TabsContainer>
);

export default OrderPage;
