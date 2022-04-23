import { ButtonProps } from '@mui/material';
import Button from 'components/shared/Button';
import React from 'react';
import { Link, To } from 'react-router-dom';
import { NotificationContentWrapper, NotificationTextWrapper, NotificationTitleWrapper } from './styles';

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
