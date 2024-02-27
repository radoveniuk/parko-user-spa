import styled from 'styled-components';

export const DialogContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  min-width: 220px;
  margin-bottom: 12px;
  padding-right: 8px;

  .msg {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #717171;

    .text {
      margin-top: 5px;
    }
  }
`;
