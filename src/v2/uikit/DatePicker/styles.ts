import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { DesktopDatePicker as DatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import styled from 'styled-components';

export const StyledDatePicker = styled(DateTimePicker)`
  .MuiIconButton-root {
    margin-right: 0;
  }
` as typeof DateTimePicker;
