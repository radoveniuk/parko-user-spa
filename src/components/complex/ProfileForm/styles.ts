import styled from 'styled-components';

import { themeConfig } from 'theme';
import { SM } from 'theme/sizeBreakpoints';

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

export const AccordionFieldsWrapper = styled.div<{ cols: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.cols}, 200px);
  grid-gap: 20px;

  .textarea {
    grid-column-start: 1;
    grid-column-end: ${(props) => props.cols + 1};
  }

  @media (max-width: ${SM}) {
    grid-template-columns: 1fr;
    .textarea {
      grid-column-start: 1;
      grid-column-end: 2;
    }
  }
`;
