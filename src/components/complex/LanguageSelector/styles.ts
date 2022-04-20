import styled from 'styled-components';
import { themeConfig } from 'theme';

export const LanguageSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 25px ;
`;

export const LangButton = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  color: ${themeConfig.palette.secondary.dark};
  text-align: left;

  transition: color 0.3s;
  &:hover {
    color: ${themeConfig.palette.secondary.main};
  }
`;
