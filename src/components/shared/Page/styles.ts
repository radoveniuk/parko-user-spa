import styled from 'styled-components';
import { colors } from 'theme';
import { SM } from 'theme/sizeBreakpoints';

export const PageWrapper = styled.section`
  display: flex;
  position: relative;

  .language-selector {
    position: absolute;
    right: 30px;
    top: 30px;
  }
`;

export const PageContent = styled.main`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  @media (max-width: ${SM}) {
    margin: 0;
    width: 100%;
  }

  .content-wrapper {
    margin: 10px;
  }
`;

export const PageTitle = styled.h2`
  font-size: 400;
  text-align: center;
  margin: 0;
  color: ${colors.default};
  margin-bottom: 15px;
`;
