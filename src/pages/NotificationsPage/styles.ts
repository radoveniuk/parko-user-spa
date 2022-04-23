import styled from 'styled-components';
import { themeConfig } from 'theme';

const borderColor = themeConfig.palette.primary.dark;

export const NotificationPageWrapper = styled.div`
  display: flex;
  border-top: 1px solid ${borderColor};
  margin-top: 20px;

  .notifications-list {
    border-right: 1px solid ${borderColor};
    min-width: 33%;
  }
`;
