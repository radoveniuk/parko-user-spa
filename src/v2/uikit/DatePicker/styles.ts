import styled from 'styled-components';

import { themeConfig } from 'theme';

export const FieldWrapper = styled.label`
  display: block;
  .label {
    color: #717171;
    font-size: 14px;
    margin-bottom: 3px;
  }
  &:has(.Mui-focused) {
    .label {
      color: ${themeConfig.palette.primary.main};
    }
  }
  .MuiInputBase-root {
    height: 40px;
    background: #fff;
  }
`;
