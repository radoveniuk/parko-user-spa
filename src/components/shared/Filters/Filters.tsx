import React from 'react';
import { isEmpty } from 'lodash-es';

import IconButton from '../IconButton';
import Input from '../Input';
import Select, { SelectProps } from '../Select';
import useFilters, { useFilterState } from './useFilters';
import { CloseIcon } from 'components/icons';

import { ClearFiltersWrapper, FilterWrapper } from './styles';

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

export const FilterSelect = ({ filterKey, label, ...rest }: FilterProps & SelectProps) => {
  const [value, setValue] = useFilterState(filterKey);
  return (
    <FilterWrapper>
      <Select
        label={label}
        value={value || ''}
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
