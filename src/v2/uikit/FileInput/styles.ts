import styled from 'styled-components';

export const FileInputLabel = styled.label`
  cursor: pointer;
  display: block;
  button {
    pointer-events: none;
    transition: .3s;
  }
  &:hover {
    button {
      filter: brightness(0.85);
    }
  }
`;
