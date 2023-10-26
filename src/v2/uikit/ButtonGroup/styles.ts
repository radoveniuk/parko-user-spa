import styled from 'styled-components';

export const ButtonGroupWrapper = styled.div`
  display: flex;
  gap: 10px;

  button.selected {
    background-color: rgba(42, 106, 231, 0.10);
    pointer-events: none;
  }
`;
