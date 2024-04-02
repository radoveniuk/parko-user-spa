import styled from 'styled-components';

export const OrderParticipationCardTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  .status {
    margin-top: 2px;
  }
`;

export const FormCardContent = styled.div`
  position: relative;

  .delete-icon {
    position: absolute;
    bottom: 5px;
    right: 5px;
  }
`;

export const UpdatingStatsWrapper = styled.div`
  padding: 15px 20px;
  border-top: 1px solid #d0d0d0;
  font-size: 12px;
`;
