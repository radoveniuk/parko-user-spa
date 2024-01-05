import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const ProfilesWrapper = styled.div`
  border-radius: 5px;
  border: 1px solid #D0D0D0;

  .filter-name {
    max-width: 400px;
    .MuiOutlinedInput-root {
      border-radius: 40px;
    }

    .MuiAutocomplete-popupIndicator {
      display: none;
    }

    .MuiInputBase-input {
      height: 25px;
      padding: 3px 5px !important;
    }

    .MuiAutocomplete-inputRoot {
      padding: 5px 9px;
    }

    .MuiAutocomplete-tag {
      font-size: 12px;
      height: 25px;

      svg {
        width: 14px;
      }
    }

    .search-icon {
      width: 20px;
      height: 20px;
    }
    @media (max-width: ${TB}) {
      width: 100%;

      .MuiFormLabel-root {
        display: none;
      }
      .MuiOutlinedInput-root {
        border-radius: 0;
      }
      .MuiOutlinedInput-notchedOutline {
        border-color: transparent !important;
      }
      .MuiInputBase-input {
        height: 25px;
        padding: 10px !important;
      }
    }
  }
`;

export const FilterTableWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  border-bottom: 1px solid #e9e9e9;
  gap: 10px;
  padding: 14px 30px;
  @media (max-width: ${TB}) {
    padding: 0;
  }

  .filter-chip {
    height: 36px;
    @media (max-width: ${TB}) {
      display: none;;
    }
  }
`;
