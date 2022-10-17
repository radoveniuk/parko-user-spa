import React from 'react';
import { isEmpty } from 'lodash-es';

import { CloseIcon } from 'components/icons';
import usePrev from 'hooks/usePrev';
import { MongoEntity } from 'interfaces/base.types';

import Autocomplete, { AutocompleteProps } from '../Autocomplete';
import DatePicker from '../DatePicker';
import IconButton from '../IconButton';
import Input from '../Input';
import Select, { SelectProps } from '../Select';

import { ClearFiltersWrapper, FilterWrapper } from './styles';
import useFilters, { useFilterState } from './useFilters';

type FilterProps = {
  filterKey: string;
  label: string;
}

export const FilterText = ({ filterKey, label }: FilterProps) => {
  const [value, setValue] = useFilterState(filterKey);
  return (
    <FilterWrapper>
      <Input
        label={label}
        value={value || ''}
        onChange={({ target }) => void setValue(target.value)}
      />
    </FilterWrapper>
  );
};

export const FilterDate = ({ filterKey, label }: FilterProps) => {
  const [value, setValue] = useFilterState(filterKey);
  const prevValue = usePrev(value);
  return (
    <FilterWrapper>
      <DatePicker
        label={label}
        value={value || ''}
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
    <FilterWrapper>
      <Autocomplete
        {...rest}
        style={{ minWidth: 200 }}
        options={options}
        value={!rest.multiple ? options.find((item) => item._id === value) || null : options.filter((item) => value.includes(item._id) || undefined)}
        onChange={(v) => {
          const newValue = rest.multiple ? v.map((item: MongoEntity) => item._id).toString() : v?._id || null;
          setValue(newValue || null);
        }}
      />
    </FilterWrapper>
  );
};

export const FilterSelect = ({ filterKey, label, ...rest }: FilterProps & SelectProps) => {
  const [value, setValue] = useFilterState(filterKey);
  return (
    <FilterWrapper>
      <Select
        label={label}
        value={rest.options?.length ? value || '' : ''}
        onChange={({ target }) => void setValue(target.value as string)}
        style={{ minWidth: 200 }}
        {...rest}
      />
    </FilterWrapper>
  );
};

export const ClearFiLtersButton = () => {
  const { clearFilters, filtersState } = useFilters();
  return (
    <ClearFiltersWrapper>
      <IconButton disabled={isEmpty(filtersState)} onClick={clearFilters}>
        <CloseIcon />
      </IconButton>
    </ClearFiltersWrapper>
  );
};
