import React from 'react';
import { isEmpty } from 'lodash-es';
import Autocomplete, { AutocompleteProps } from 'v2/uikit/Autocomplete';
import DatePicker, { DatePickerProps } from 'v2/uikit/DatePicker';
import IconButton from 'v2/uikit/IconButton';
import Input from 'v2/uikit/Input';
import Select, { SelectProps } from 'v2/uikit/Select';

import { ClearFiltersIcon } from 'components/icons';
import usePrev from 'hooks/usePrev';
import { MongoEntity } from 'interfaces/base.types';

import { ClearFiltersWrapper, FilterWrapper } from './styles';
import useFilters, { useFilterState } from './useFilters';

type FilterProps = {
  filterKey: string;
  label?: string;
}

export const FilterText = ({ filterKey, label }: FilterProps) => {
  const [value, setValue] = useFilterState(filterKey);
  return (
    <FilterWrapper>
      <Input
        theme="gray"
        label={label}
        value={value || ''}
        onChange={({ target }) => void setValue(target.value)}
      />
    </FilterWrapper>
  );
};

export const FilterDate = ({ filterKey, label, ...rest }: Required<FilterProps> & Partial<DatePickerProps>) => {
  const [value, setValue] = useFilterState(filterKey);
  const prevValue = usePrev(value);
  return (
    <FilterWrapper style={{ maxWidth: 200 }}>
      <DatePicker
        inputProps={{ theme: 'gray' }}
        {...rest}
        label={label}
        defaultValue={value || ''}
        onChange={(v) => {
          if (v !== prevValue) {
            setValue(v);
          }
        }}
      />
    </FilterWrapper>
  );
};

type FilterAutocompleteProps = FilterProps & AutocompleteProps;

export const FilterAutocomplete = ({ filterKey, options = [], ...rest }: FilterAutocompleteProps) => {
  const [value, setValue] = useFilterState(filterKey);

  return (
    <Autocomplete
      theme="gray"
      {...rest}
      style={{ minWidth: 200 }}
      options={options}
      value={!rest.multiple
        ? options.find((item) => item._id === value) || null
        : options.filter((item) => value.split(',').includes(item._id) || undefined)
      }
      onChange={(v) => {
        const newValue = rest.multiple ? v.map((item: MongoEntity) => item._id).toString() : v?._id || null;
        setValue(newValue || null);
      }}
    />
  );
};

export const FilterSelect = ({ filterKey, label, ...rest }: FilterProps & SelectProps<any>) => {
  const [value, setValue] = useFilterState(filterKey);

  return (
    <FilterWrapper>
      <Select
        theme="gray"
        label={label}
        value={rest.options?.length ? value || '' : ''}
        onChange={({ target }) => void setValue(target.value as string)}
        style={{ minWidth: 200 }}
        {...rest}
      />
    </FilterWrapper>
  );
};

export const ClearFiltersButton = () => {
  const { clearFilters, filtersState } = useFilters();
  return (
    <ClearFiltersWrapper>
      <IconButton disabled={isEmpty(filtersState)} onClick={clearFilters}>
        <ClearFiltersIcon />
      </IconButton>
    </ClearFiltersWrapper>
  );
};
