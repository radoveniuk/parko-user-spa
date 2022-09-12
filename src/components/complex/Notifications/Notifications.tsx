import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetNotifications } from 'api/query/notificationsQuery';
import { useDeleteNotificationMutation, useUpdateNotificationMutation } from 'api/mutations/notificationMutation';
import Dialog from 'components/shared/Dialog';
import Button from 'components/shared/Button';
import List from 'components/shared/List';
import { INotification } from 'interfaces/notification.interface';

import { NotificationContent, NotificationDeleteButton, NotificationTitle } from './NotificationContent';

import { DeleteModalContent, EmptyDataWrapper, NotificationWrapper } from './styles';

type Props = {
  options: Partial<INotification>;
  mode?: 'to' | 'from';
};

const Notifications = ({
  options,
  mode = 'from',
}: Props) => {
  const { data = [], refetch } = useGetNotifications(options);
  const { t } = useTranslation();
  const updateNotificationMutation = useUpdateNotificationMutation();
  const deleteNotificationMutation = useDeleteNotificationMutation();
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

  if (!data.length) {
    return (
      <EmptyDataWrapper>
        {t('noData')}
      </EmptyDataWrapper>
    );
  };

  return (
    <NotificationWrapper>
      <List
        className="notifications-list"
        data={data}
        fields={{
          primary: 'title',
          secondary: [`${mode}.name`, `${mode}.surname`],
        }}
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
    </NotificationWrapper>

  );
};

export default Notifications;
