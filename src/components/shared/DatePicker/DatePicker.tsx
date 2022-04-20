import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { DatePickerProps } from '@mui/x-date-pickers';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

const DatePicker = ({ ...rest }: Partial<DatePickerProps>) => {
  const [value, setValue] = useState<any>(null);
  return (
    <MobileDatePicker
      value={value}
      onChange={setValue}
      renderInput={(params) => <TextField {...params} />}
      inputFormat="dd.MM.yyyy"
      {...rest}
    />
  );
};

export default DatePicker;
