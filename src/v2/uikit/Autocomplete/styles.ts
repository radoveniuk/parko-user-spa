import AutocompleteMaterial from '@mui/material/Autocomplete';
import styled from 'styled-components';

export const StyledAutocomplete = styled(AutocompleteMaterial)`
  .MuiAutocomplete-endAdornment {
    background-color: ${({ theme }) => theme === 'white' ? '#fff' : '#FAFAFA'};
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
  }

  input {
    height: 1em !important;
    padding: 10px 14px !important;
  }

  &:has(input:disabled) {
    .MuiAutocomplete-endAdornment {
      background-color: transparent;
    }
  }
`;

export const DropdownIconWrapper = styled.div`
  height: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 3px;
`;
