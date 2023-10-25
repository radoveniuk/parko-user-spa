import React, { forwardRef, memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import SelectMaterial, { SelectProps as SelectPropsMaterial } from '@mui/material/Select';
import _, { isFunction } from 'lodash-es';

import { DropdownIcon } from 'components/icons';

import { SelectWrapper } from './styles';

type Option = {[key: string | number]: any}

export type SelectProps = SelectPropsMaterial & {
  options?: string[] | number[] | Option[];
  valuePath?: string;
  labelPath?: string | string[] | ((item: unknown) => string);
  emptyItem?: string;
  maxWidth?: number;
}

const Select = forwardRef(({
  label, options = [], valuePath = 'value',
  labelPath = 'label', emptyItem, defaultValue, onChange, maxWidth, placeholder, ...rest
}: SelectProps, ref) => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState<unknown>(defaultValue || '');
  const menuItems = useMemo(() => {
    if (options) {
      return options.map((item) => {
        if (typeof item === 'object' && (!valuePath || !labelPath)) {
          throw new Error('Object path not specified!');
        }
        if (['string', 'number'].includes(typeof item)) {
          return { value: item, label: item };
        }
        let label = '';
        if (typeof labelPath === 'string') {
          label = _.get(item, labelPath as string);
        }
        if (Array.isArray(labelPath)) {
          label = labelPath.map((path) => _.get(item, path)).join(' ');
        }
        if (isFunction(labelPath)) {
          label = labelPath(item);
        }
        return {
          value: Array.isArray(valuePath) ? valuePath.map((path) => _.get(item, path)).join('_') : _.get(item, valuePath as string),
          label: <>{label}</>,
        };
      });
    }
  }, [labelPath, options, valuePath]);

  return (
    <SelectWrapper style={{ maxWidth }}>
      <div className="label">{label}</div>
      <SelectMaterial
        value={selectedValue}
        IconComponent={(props) => <DropdownIcon {...props} color="rgba(0, 0, 0, 0.6)" size={18} />}
        ref={ref}
        style={{ minWidth: 200 }}
        onChange={(e, child) => {
          setSelectedValue(e.target.value);
          onChange?.(e, child);
        }}
        {...rest}
      >
        {emptyItem && (
          <MenuItem value="">
            <em>{t(emptyItem)}</em>
          </MenuItem>
        )}
        {menuItems?.map((menuItem) => (
          <MenuItem key={menuItem.value} value={menuItem.value}><>{menuItem.label}</></MenuItem>
        ))}
      </SelectMaterial>
    </SelectWrapper>
  );
});

Select.displayName = 'Select';

export default memo(Select);
