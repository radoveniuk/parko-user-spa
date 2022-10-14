import styled from 'styled-components';

import { themeConfig } from 'theme';

export const LabelWrapper = styled.label`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .input-label {
    margin: 0;
    font-size: 12px;
    color: ${themeConfig.palette.primary.main};
  }

  button {
    margin-top: 3px;
  }
`;

export const RowWrapper = styled.div`
  display: flex;
  margin-top: 12px;
  margin-bottom: 12px;
  align-items: center;

  .MuiTextField-root {
    margin: 10px;
  }

  .remove-row-button {
    min-height: 40px;
    max-height: 40px;
    min-width: 40px;
    max-width: 40px;
  }
`;

export const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
