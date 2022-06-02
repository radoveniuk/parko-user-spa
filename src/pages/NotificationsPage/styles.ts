import styled from 'styled-components';

const borderColor = '#e9e9e9';

export const NotificationPageWrapper = styled.div`
  display: flex;
  border-top: 1px solid ${borderColor};

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
