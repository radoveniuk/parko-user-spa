import styled from 'styled-components';

import { themeConfig } from 'theme';

export const InputWrapper = styled.div`
  width: 100%;

  .MuiFormControl-root {
    width: 100%;
  }

  .MuiInputLabel-root {
    color: ${themeConfig.client.secondary.dark}
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: ${themeConfig.client.secondary.main}
  }
`;
