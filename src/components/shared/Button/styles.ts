import styled from 'styled-components';
import { colors } from 'theme/colors';

export const ButtonWrapper = styled.div`
  button {
    background: ${colors.primary};
    border-radius: 2px;
    border: none;
    color: #fff;
    width: 200px;
    height: 50px;
    cursor: pointer;
    font-size: 20px;

    transition: background-color 0.3s;

    &:hover {
      background-color: ${colors.primaryLight};
    }

    &:disabled {
      background-color: ${colors.primaryDisabled};
      cursor: default;
    }
  }
`;
