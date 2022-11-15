import styled from 'styled-components';

import { themeConfig } from 'theme';

export const ResetPasswordWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;

  .error-wrapper {
    color: ${themeConfig.palette.error.main};
  }
`;
