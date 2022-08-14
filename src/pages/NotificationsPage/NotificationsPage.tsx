import React, { useState } from 'react';
import Page, { PageTitle } from 'components/shared/Page';
import { useTranslation } from 'react-i18next';

import List from 'components/shared/List';
import { INotification } from 'interfaces/notification.interface';
import { NotificationContent, NotificationTitle } from './NotificationContent';
import { useGetNotifications } from 'api/query/notificationsQuery';
import { useAuthData } from 'contexts/AuthContext';
import Button from 'components/shared/Button';
import { EditIcon } from 'components/icons';
import { useDeleteNotificationMutation, useUpdateNotificationMutation } from 'api/mutations/notificationMutation';

import { CreateMessageLink, DeleteModalContent, EmptyDataWrapper, NotificationPageWrapper } from './styles';
import { NotificationDeleteButton } from './NotificationContent/NotificationContent';
import Dialog from 'components/shared/Dialog';

const fields = {
  primary: 'title',
  secondary: ['from.name', 'from.surname'],
};

const NotificationsPage = () => {
  const { t } = useTranslation();
  const { id } = useAuthData();
  const { data = [], refetch } = useGetNotifications({ to: id });
  const updateNotificationMutation = useUpdateNotificationMutation();
  const deleteNotificationMutation = useDeleteNotificationMutation();
  const { role } = useAuthData();
  const [selectedNotification, setSelectedNotification] = useState<INotification | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const closeDeleteModal = () => setOpenDeleteModal(false);

  const selectNotificationHandler = (data: unknown) => {
    const notification = data as INotification;
    setSelectedNotification(notification);
    updateNotificationMutation.mutateAsync({ ...notification, viewed: true })
      .then(() => void refetch());
  };

  const deleteNotificatoin = () => {
    if (selectedNotification?._id) {
      const id = selectedNotification._id;
      setSelectedNotification(null);
      closeDeleteModal();
      deleteNotificationMutation.mutateAsync(id).then(() => {
        refetch();
      });
    }
  };

  return (
    <Page title={t('notifications')}>
      <PageTitle>{t('notifications')}</PageTitle>
      {!!data.length && (
        <NotificationPageWrapper>
          <List
            className="notifications-list"
            data={data}
            fields={fields}
            onSelect={selectNotificationHandler}
            highlite={['viewed', false]}
          />
          {selectedNotification !== null && (
            <NotificationContent>
              <NotificationDeleteButton onClick={() => void setOpenDeleteModal(true)} />
              <NotificationTitle>{selectedNotification.title}</NotificationTitle>
              <div dangerouslySetInnerHTML={{ __html: selectedNotification.message }} />
            </NotificationContent>
          )}
          <Dialog
            open={openDeleteModal}
            onClose={closeDeleteModal}
            title={t('notification.delete')}
          >
            <DeleteModalContent>
              <Button color="error" variant="outlined" onClick={deleteNotificatoin}>{t('true')}</Button>
              <Button color="primary" variant="outlined" onClick={closeDeleteModal}>{t('false')}</Button>
            </DeleteModalContent>
          </Dialog>
        </NotificationPageWrapper>
      )}
      {!data.length && (
        <EmptyDataWrapper>
          {t('noData')}
        </EmptyDataWrapper>
      )}
      {role === 'admin' && (
        <CreateMessageLink to="/create-notification">
          <Button color="secondary"><EditIcon size={20} /></Button>
        </CreateMessageLink>
      )}
    </Page>
  );
};

export default NotificationsPage;
