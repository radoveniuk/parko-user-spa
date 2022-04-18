import styled from 'styled-components';
import { colors } from 'theme/colors';

export const LanguageSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 100px ;
`;

export const LangButton = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  color: ${colors.secondaryDark};
  text-align: left;

  transition: color 0.3s;
  &:hover {
    color: ${colors.secondary};
  }
`;
