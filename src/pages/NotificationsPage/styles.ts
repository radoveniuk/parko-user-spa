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
    max-height: calc(100vh - 190px);
    min-height: calc(100vh - 190px);
    overflow-y: auto;
  }
`;

export const EmptyDataWrapper = styled.div`
  height: calc(200px);
  font-size: 30px;
  font-weight: 600;
  color: #b9b9b9;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;
