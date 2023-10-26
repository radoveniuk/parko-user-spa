import styled from 'styled-components';

export const ButtonGroupWrapper = styled.div`
  display: flex;
  gap: 10px;

  button.selected {
    background-color: rgba(42, 106, 231, 0.10);
    border-color: rgb(233 240 253);
    pointer-events: none;
  }
`;
