import styled from 'styled-components';

import { themeConfig } from 'theme';

export const ButtonWrapper = styled.div`
  button {
    color: ${themeConfig.client.secondary.dark};
    min-width: 0;
    font-size: 16px;
    gap: 5px;
    text-transform: capitalize;

    &:hover {
        background-color: unset;
    }
  }
`;
