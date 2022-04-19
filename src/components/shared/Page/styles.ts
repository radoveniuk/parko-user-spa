import styled from 'styled-components';
import { colors } from 'theme/colors';
import { SM } from 'theme/sizeBreakpoints';

export const PageWrapper = styled.section`
  display: flex;
  position: relative;
`;

export const PageContent = styled.main`
  position: relative;
  width: calc(100vw - 300px);
  height: 100vh;
  margin: 0 12px;
  display: flex;
  flex-direction: column;

  @media (max-width: ${SM}) {
    margin: 0;
    width: 100%;
  }
`;

export const PageTitle = styled.h2`
  font-size: 400;
  text-align: center;
  margin: 0;
  color: ${colors.default};
`;
