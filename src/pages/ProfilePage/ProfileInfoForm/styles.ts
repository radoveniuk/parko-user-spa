import styled from 'styled-components';
import { themeConfig } from 'theme';

export const ProfileInfoFormWrapper = styled.div`
  text-align: center;

  .accordion {
    margin: 20px !important;

    .accordion-content {
      display: flex;
      flex-wrap: wrap;
  
      .field-wrap {
        margin: 10px;

        .MuiSelect-select {
          text-align: left;
        }
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
