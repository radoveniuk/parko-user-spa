import styled from 'styled-components';
import { colors } from 'theme/colors';

export const PageWrapper = styled.section`
  display: flex;
  position: relative;
`;

export const PageContent = styled.main`
  position: relative;
  width: 100%;
  margin: 0 12px;
  display: flex;
  flex-direction: column;
`;

export const PageTitle = styled.h2`
  font-size: 400;
  text-align: center;
  margin: 0;
  color: ${colors.default};
`;
