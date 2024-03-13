import styled from 'styled-components';

import { themeConfig } from 'theme';

export const FormFieldWrapper = styled.div`
  min-width: 200px;

  .MuiInputBase-root input {
    padding: 4px 0 5px !important;
  }

  .MuiAutocomplete-inputRoot {
    flex-wrap: nowrap !important;
   }
`;

export const LinkWrapper = styled.div`
  .table-link {
    color: ${themeConfig.palette.primary.main};
  }
`;
