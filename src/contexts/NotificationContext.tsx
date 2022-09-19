import React, {
  createContext, ReactNode, useContext, useEffect, useState,
} from 'react';
// import { io } from 'socket.io-client';
// import { useQueryClient } from 'react-query';

import useLocalStorageState from 'hooks/useLocalStorageState';
import { useGetNotifications } from 'api/query/notificationsQuery';
// import { INotification } from 'interfaces/notification.interface';
// import { BASE_URL } from 'api/common';

type contextType = {
  newNotification: boolean;
};

const NotificationContext = createContext<contextType | undefined>(undefined);
NotificationContext.displayName = 'NotificationContext';

// const socket = io(BASE_URL, { autoConnect: true });

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [userId] = useLocalStorageState('userId');
  const {
    data: userNotifications = [],
    refetch: refetchNotifications,
  } = useGetNotifications({ to: userId }, { enabled: !!userId, refetchOnWindowFocus: false });
  const [newNotification, setNewNotification] = useState(false);
  // const queryClient = useQueryClient();

  useEffect(() => {
    if (userNotifications.length) {
      setNewNotification(!!userNotifications.filter((item) => !item.viewed).length);
    }
  }, [userNotifications]);

  useEffect(() => {
    if (userId) {
      refetchNotifications();
    }
  }, [refetchNotifications, userId]);

  // useEffect(() => {
  //   socket.on('connect', () => {
  //     console.log('Wss connected');
  //   });
  //   socket.on('newNotification', (data: INotification) => {
  //     if (data.to === userId) {
  //       queryClient.setQueryData(['notifications', JSON.stringify({ to: userId })], [data, ...userNotifications]);
  //     }
  //   });
  // }, [queryClient, userId, userNotifications]);

  return (
    <NotificationContext.Provider value={{ newNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('Notifications provider not exist');
  }

  return ctx.newNotification;
};

export default NotificationProvider;
