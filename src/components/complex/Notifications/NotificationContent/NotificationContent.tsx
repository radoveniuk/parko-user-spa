import React from 'react';
import { Link, To } from 'react-router-dom';
import { IconButtonProps } from '@mui/material';

import { DeleteIcon } from 'components/icons';
import Button, { ButtonProps } from 'v2/uikit/Button';

import { DeleteNotificationIconButton, NotificationContentWrapper, NotificationTextWrapper, NotificationTitleWrapper } from './styles';

type NotificationBaseProps = {
  children: React.ReactNode;
}

export const NotificationContent = ({ children }: NotificationBaseProps) => (
  <NotificationContentWrapper>
    {children}
  </NotificationContentWrapper>
);

export const NotificationTitle = ({ children }: NotificationBaseProps) => (
  <NotificationTitleWrapper>
    {children}
  </NotificationTitleWrapper>
);

export const NotificationText = ({ children }: NotificationBaseProps) => (
  <NotificationTextWrapper>
    {children}
  </NotificationTextWrapper>
);

type NotificationLinkProps = NotificationBaseProps & ButtonProps & {
  to: To
}

export const NotificationLink = ({ to, children, ...rest }: NotificationLinkProps) => (
  <Link to={to}>
    <Button {...rest}>
      {children}
    </Button>
  </Link>
);

export const NotificationDeleteButton = (props: IconButtonProps) => (
  <DeleteNotificationIconButton {...props}>
    <DeleteIcon />
  </DeleteNotificationIconButton>
);
