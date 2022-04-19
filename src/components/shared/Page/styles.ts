import styled from 'styled-components';
import { colors } from 'theme/colors';
import { SM } from 'theme/sizeBreakpoints';

export const PageWrapper = styled.section`
  display: flex;
  position: relative;
`;

export const PageContent = styled.main`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  margin-left: 10px;
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
