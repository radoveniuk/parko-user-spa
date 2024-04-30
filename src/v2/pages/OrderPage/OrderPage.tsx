import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import omit from 'lodash-es/omit';
import OrderFormDialog from 'v2/components/OrderFormDialog';
import BreadCrumbs from 'v2/uikit/BreadCrumbs';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import Loader, { FullPageLoaderWrapper } from 'v2/uikit/Loader';
import Menu, { MenuItem } from 'v2/uikit/Menu';
import { TabPanel, TabsContainer } from 'v2/uikit/Tabs';

import { useCreateOrder, useDeleteOrder } from 'api/mutations/orderMutation';
import { useGetOrderParticipations } from 'api/query/orderParticipationQuery';
import { useGetOrder } from 'api/query/orderQuery';
import { CopyIcon, DeleteIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';

import OrderCard from './components/OrderCard';
import Participations from './components/Participations';
import { ContentWrapper, OrderPageWrapper } from './styles';

const OrderPageRender = () => {
  const { permissions } = useAuthData();
  const { t } = useTranslation();
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  // data
  const { data: orderData } = useGetOrder(orderId as string);
  const { data: participations = [] } = useGetOrderParticipations({ order: orderId });

  const deleteOrder = useDeleteOrder();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // clone
  const [openCloneDialog, setOpenCloneDialog] = useState(false);
  const createOrderMutation = useCreateOrder();

  if (!orderData) return <FullPageLoaderWrapper><Loader /></FullPageLoaderWrapper>;

  return (
    <OrderPageWrapper>
      <BreadCrumbs
        actions={(
          <>
            <Menu className="big-btn" isCloseOnMenu>
              {permissions.includes('orders:create') && (
                <MenuItem onClick={() => void setOpenCloneDialog(true)}>
                  <CopyIcon size={16} />
                  {t('clone')}
                </MenuItem>
              )}
              {permissions.includes('orders:delete') && (
                <MenuItem color="error" onClick={() => void setOpenDeleteDialog(true)}>
                  <DeleteIcon size={16} />
                  {t('delete')}
                </MenuItem>
              )}
            </Menu>
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
      {!!openCloneDialog && (
        <OrderFormDialog
          open={openCloneDialog}
          onClose={() => void setOpenCloneDialog(false)}
          data={orderData}
          onSave={(values) => {
            createOrderMutation.mutateAsync(omit(values, ['_id', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'])).then((res) => {
              setOpenCloneDialog(false);
              navigate(`/order/${res._id}`);
            });
          }}
        />
      )}
    </OrderPageWrapper>
  );
};

const OrderPage = () => (
  <TabsContainer>
    <OrderPageRender />
  </TabsContainer>
);

export default OrderPage;
