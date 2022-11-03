import styled from 'styled-components';

import { themeConfig } from 'theme';

export const ProfileFormWrapper = styled.div`
  .accordion {
    margin: 20px !important;

    .MuiSelect-select {
      text-align: left;
    }
  }

  .form-errors {
    text-align: left;
    color: ${themeConfig.palette.error.main};

    p {
      padding-left: 20px;
      font-weight: 600;
    }

    ul {
      padding-left: 30px;
    }
  }
`;
