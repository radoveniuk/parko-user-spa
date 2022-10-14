import React from 'react';
import { isEmpty } from 'lodash-es';

import { CloseIcon } from 'components/icons';

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
  return (
    <FilterWrapper>
      <DatePicker
        label={label}
        value={value || ''}
        onChange={(v, isValid) => {
          if (isValid) {
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
        value={options.find((item) => item._id === value) || null}
        onChange={(newValue) => {
          setValue(newValue?._id || null);
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
