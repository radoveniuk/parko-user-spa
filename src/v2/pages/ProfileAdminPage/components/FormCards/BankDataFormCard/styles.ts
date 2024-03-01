import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const BankDataFormCardWrapper = styled.div`
  display: contents;
  .iban-field {
    position: relative;
    display: flex;
    align-items: flex-end;

    .iban-input {
      flex-grow: 1;

      .MuiInputBase-root {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
        border-right: 0px;
      }
    }
    
    button {
      display: flex;
      max-height: 36px;
      border-top-left-radius: 0px !important;
      border-bottom-left-radius: 0px !important;
    }

    @media (max-width: ${TB}) {
      button {
        max-height: 48px;
        height: 48px;
        font-size: 0px;
        min-width: 40px;
        width: 48px;
        padding: 0;
        gap: 0;
      }
    }
  }
`;
export const LoaderWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgb(255 255 255 / 50%);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
`;
