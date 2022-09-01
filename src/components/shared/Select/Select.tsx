import _ from 'lodash-es';
import React, { forwardRef, useMemo } from 'react';
import SelectMaterial, { SelectProps as SelectPropsMaterial } from '@mui/material/Select';
import { FormControl, InputLabel, MenuItem } from '@mui/material';

type Option = {[key: string | number]: any}

export type SelectProps = SelectPropsMaterial & {
  options?: string[] | number[] | Option[];
  valuePath?: string;
  labelPath?: string;
}

const Select = forwardRef(({ label, options = [], valuePath = 'value', labelPath = 'label', ...rest }: SelectProps, ref) => {
  const menuItems = useMemo(() => {
    if (options) {
      return options.map((item) => {
        if (typeof item === 'object' && (!valuePath || !labelPath)) {
          throw new Error('Object path not specified!');
        }
        if (['string', 'number'].includes(typeof item)) {
          return { value: item, label: item };
        }
        return {
          value: Array.isArray(valuePath) ? valuePath.map((path) => _.get(item, path)).join('_') : _.get(item, valuePath as string),
          label: Array.isArray(labelPath) ? labelPath.map((path) => _.get(item, path)).join(' ') : _.get(item, labelPath as string),
        };
      });
    }
  }, [labelPath, options, valuePath]);

  return (
    <FormControl>
      <InputLabel>{label}</InputLabel>
      <SelectMaterial
        label={label}
        defaultValue=""
        ref={ref}
        style={{ minWidth: 200 }}
        {...rest}
      >
        {menuItems?.map((menuItem) => (
          <MenuItem key={menuItem.value} value={menuItem.value}>{menuItem.label}</MenuItem>
        ))}
      </SelectMaterial>
    </FormControl>
  );
});

Select.displayName = 'Select';

export default Select;
