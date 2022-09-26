import styled from 'styled-components';

import { themeConfig } from 'theme';

export const ProfileInfoFormWrapper = styled.div`
  text-align: center;

  .accordion {
    margin: 20px !important;

    .MuiSelect-select {
      text-align: left;
    }
  }

  .file-actions {
    text-align: left;

    .download-file-link {
      color: ${themeConfig.palette.primary.light};
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
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

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
`;
