import AutocompleteMaterial from '@mui/material/Autocomplete';
import styled from 'styled-components';

export const StyledAutocomplete = styled(AutocompleteMaterial)`
  .MuiAutocomplete-endAdornment {
    background-color: #fff;
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
