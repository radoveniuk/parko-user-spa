import { IconButton } from '@mui/material';
import styled from 'styled-components';

export const NotificationContentWrapper = styled.div`
  margin: 20px;
  position: relative;
  width: 100%;
`;

export const NotificationTitleWrapper = styled.h3`
  margin: 0;
  margin-bottom: 24px;
  
`;

export const NotificationTextWrapper = styled.p`
  margin: 0;
`;

export const DeleteNotificationIconButton = styled(IconButton)`
  position: absolute !important;
  top: 0;
  right: 0;
`;
