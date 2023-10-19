import { LinearProgress } from '@mui/material';
import styled from 'styled-components';

import { themeConfig } from 'theme';
import { SM } from 'theme/sizeBreakpoints';

export const PageWrapper = styled.section`
  display: flex;
  position: relative;

  .page-actions {
    position: absolute;
    right: 30px;
    top: 30px;
    display: flex;
    gap: 5px;
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
  color: #30384F;
  margin-bottom: 15px;
  margin-top: 10px;
`;

export const PageTitleV2 = styled.h2`
  font-weight: 400;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid ${themeConfig.client.secondary.light10};
  padding: 0 0 10px 30px;
  margin: 0;
  color: #000;
  margin-bottom: 15px;
  margin-top: 10px;
`;

export const PageLoader = styled(LinearProgress)`
  position: absolute !important;
  width: calc(100% - 20px);
`;

export const PageActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;
