import styled from 'styled-components';

import { themeConfig } from 'theme';

export const LanguageSelectorWrapper = styled.div`
  button {
    min-width: 0;
    max-width: 80px;
    border: 0;
    gap: 10px;
    color: ${themeConfig.client.main.dark};

    &:hover {
      border: 0;
      background: none;
    }
  }
`;

export const LangDialogWrapper = styled.div`
  max-width: 400px;
  min-width: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
`;

export const LangButton = styled.button`
  cursor: pointer;
  height: 50px;
  min-width: 100px;
  background-color: transparent;
  border: 1px solid #ffded2;
  color: ${themeConfig.palette.secondary.dark};
  text-align: left;
  border-radius: 3px;
  font-size: 15px;
  text-align: center;

  transition: color, background-color 0.3s;
  &:hover {
    background-color: #ffded2;
  }
`;
