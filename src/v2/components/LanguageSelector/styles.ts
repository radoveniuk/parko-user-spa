import styled from 'styled-components';

import { themeConfig } from 'theme';

export const LanguageSelectorWrapper = styled.div`
  button {
    min-width: 0;
    max-width: 80px;
    border: 0;
    gap: 10px;
    color: ${themeConfig.client.main.dark};
    text-transform: uppercase;

    &:hover {
      border: 0;
      background: none;
    }
  }
`;
