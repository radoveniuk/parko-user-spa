import styled from 'styled-components';

export const DocList = styled.div`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0;
  margin: 0;
  &:has(*) {
    margin-bottom: 15px;
  }
`;

export const DocItem = styled.div`
  list-style: none;
  padding: 15px 20px;
  border-radius: 5px;
  border: 1px solid #D0D0D0;
  background: #FAFAFA;
  position: relative;

  .delete-btn {
    position: absolute;
    right: 6px;
    top: 6px;
  }
`;
