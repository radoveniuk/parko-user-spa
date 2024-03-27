import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'v2/uikit';
import Autocomplete from 'v2/uikit/Autocomplete';
import BreadCrumbs from 'v2/uikit/BreadCrumbs';
import Dialog, { DialogActions } from 'v2/uikit/Dialog';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import Loader, { FullPageLoaderWrapper } from 'v2/uikit/Loader';
import { TabPanel, TabsContainer, useTabs } from 'v2/uikit/Tabs';

import { useDeleteOrder } from 'api/mutations/orderMutation';
import { useGetOrderParticipations } from 'api/query/orderParticipationQuery';
import { useGetOrder } from 'api/query/orderQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { DeleteIcon, PlusIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { IUser } from 'interfaces/users.interface';
import { themeConfig } from 'theme';

import OrderCard from './components/OrderCard';
import Participations from './components/Participations';
import useOrderParticipationActions from './hooks/useOrderParticipationActions';
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

  const [tab] = useTabs();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // create new participation
  const [openCreateParticipationDialog, setOpenCreateParticipationDialog] = useState(false);
  const { data: users = [] } = useGetUserListForFilter();
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const { create: createParticipation } = useOrderParticipationActions();

  if (!orderData) return <FullPageLoaderWrapper><Loader /></FullPageLoaderWrapper>;

  return (
    <OrderPageWrapper>
      <BreadCrumbs
        actions={(
          <>
            {role === 'admin' && tab === 0 && (
              <Button
                onClick={() => {
                  setOpenCreateParticipationDialog(true);
                }}
              >
                <PlusIcon />{t('order.addNewParticipation')}
              </Button>
            )}
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
        <OrderCard data={orderData} />
        <ContentWrapper>
          <TabPanel index={0}>
            <Participations participations={participations} />
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
      {!!openCreateParticipationDialog && (
        <Dialog
          onClose={() => void setOpenCreateParticipationDialog(false)}
          open={openCreateParticipationDialog}
          title={t('order.addNewParticipation')}
        >
          <Autocomplete
            options={users}
            label={t('profile')}
            theme="gray"
            getOptionLabel={(item) => `${item.name} ${item.surname}`}
            style={{ marginBottom: 12 }}
            value={selectedUser}
            onChange={(v) => void setSelectedUser(v)}
          />
          <DialogActions>
            <Button
              variant="contained"
              disabled={!selectedUser}
              onClick={async () => {
                if (selectedUser) {
                  setOpenCreateParticipationDialog(false);
                  await createParticipation(selectedUser._id);
                }
              }}
            >{t('approve')}</Button>
          </DialogActions>
        </Dialog>
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
