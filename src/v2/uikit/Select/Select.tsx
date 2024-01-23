import React, { ForwardedRef, forwardRef, memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import SelectMaterial, { SelectProps as SelectPropsMaterial } from '@mui/material/Select';
import get from 'lodash-es/get';
import isFunction from 'lodash-es/isFunction';

import { DropdownIcon } from 'components/icons';
import { Path } from 'interfaces/base.types';

import { SelectWrapper } from './styles';

type FieldTheme = 'white' | 'gray';

const COLORS_MAP: Record<FieldTheme, string> = {
  gray: '#FAFAFA',
  white: '#FFFFFF',
};

export type SelectProps<T> = SelectPropsMaterial & {
  options?: T[];
  valuePath?: Path<T>;
  labelPath?: string | string[] | ((item: T) => string | React.ReactNode);
  emptyItem?: string;
  maxWidth?: number | string;
  theme?: FieldTheme;
}

function Select<T> ({
  label, options = [], valuePath,
  labelPath = 'label', emptyItem, defaultValue,
  onChange, maxWidth, placeholder, theme = 'white', value, ...rest
}: SelectProps<T>, ref: ForwardedRef<HTMLSelectElement>) {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState<Path<T>>((defaultValue || '') as Path<T>);
  const menuItems = useMemo(() => {
    if (options) {
      return options.map((item) => {
        if (['string', 'number'].includes(typeof item)) {
          return { value: item as string, label: item as string };
        }
        let label: string | React.ReactNode = '';
        if (typeof labelPath === 'string') {
          label = get(item, labelPath as string);
        }
        if (Array.isArray(labelPath)) {
          label = labelPath.map((path) => get(item, path)).join(' ');
        }
        if (isFunction(labelPath)) {
          label = labelPath(item);
        }
        return {
          value: (Array.isArray(valuePath) ? valuePath.map((path) => get(item, path)).join('_') : get(item, valuePath || 'value')) as string,
          label: <>{label}</>,
        };
      });
    }
  }, [labelPath, options, valuePath]);

  useEffect(() => {
    if (value) {
      setSelectedValue(value as Path<T>);
    }
  }, [value]);

  return (
    <SelectWrapper style={{ maxWidth }} fieldColor={COLORS_MAP[theme]} >
      <div className={`label${rest.error ? ' error' : ''}`}>{label}</div>
      <SelectMaterial
        value={selectedValue}
        IconComponent={(props) => <DropdownIcon {...props} color="#131313" size={12} />}
        ref={ref}
        // style={{ minWidth: 200 }}
        onChange={(e, child) => {
          setSelectedValue(e.target.value as Path<T>);
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
};

Select.displayName = 'Select';

export default memo(forwardRef(Select)) as typeof Select;
