import styled from 'styled-components';

import { themeConfig } from 'theme';

export const LanguageSelectorWrapper = styled.div`
  button {
    max-width: 80px;
    path {
      stroke: ${themeConfig.palette.primary.main} !important;
    }
  }
`;

export const LangDialogWrapper = styled.div`
  max-width: 400px;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const LangButton = styled.button`
  cursor: pointer;
  height: 50px;
  min-width: 100px;
  width: 30%;
  background-color: transparent;
  border: 1px solid;
  border-color: ${themeConfig.palette.secondary.dark};
  color: ${themeConfig.palette.secondary.dark};
  text-align: left;
  border-radius: 3px;

  transition: color, border-color 0.3s;
  &:hover {
    color: ${themeConfig.palette.secondary.main};
    border-color: ${themeConfig.palette.secondary.main};
  }
`;
