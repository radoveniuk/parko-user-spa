import styled from 'styled-components';
import { colors } from 'theme/colors';

export const IconButtonWrapper = styled.div`
  button {
    background-color: transparent;
    height: 60px;
    width: 60px;
    border: none;
    cursor: pointer;
    font-size: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s;
    color: ${colors.primary};

    &:hover {
      background-color: #123c6929;
    }

    &:disabled {
      cursor: default;
    }
  }
`;
