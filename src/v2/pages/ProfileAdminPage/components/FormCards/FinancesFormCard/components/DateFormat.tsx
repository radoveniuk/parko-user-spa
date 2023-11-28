import React, { forwardRef, memo } from 'react';
import { PatternFormat, PatternFormatProps } from 'react-number-format';

interface NumberFormatProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const DateFormat = forwardRef<PatternFormatProps<string>, NumberFormatProps>(
  function NumberFormatCustom (props, ref) {
    const { onChange, ...other } = props;

    return (
      <PatternFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.formattedValue,
            },
          });
        }}
        format="##/####"
        mask="_"
      />
    );
  },
);

export default memo(DateFormat);
