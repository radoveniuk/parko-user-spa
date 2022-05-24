import React from 'react';
import Input from '../Input';
import Select, { SelectProps } from '../Select';
import { FilterWrapper } from './styles';
import { useFilterState } from './useFilters';

type FilterProps = {
  filterKey: string;
  label: string;
}

export const FilterText = ({ filterKey, label }: FilterProps) => {
  const [, setValue] = useFilterState(filterKey);
  return (
    <FilterWrapper>
      <Input
        label={label}
        onChange={({ target }) => void setValue(target.value)}
      />
    </FilterWrapper>
  );
};

export const FilterSelect = ({ filterKey, label, ...rest }: FilterProps & SelectProps) => {
  const [, setValue] = useFilterState(filterKey);
  return (
    <FilterWrapper>
      <Select
        label={label}
        onChange={({ target }) => void setValue(target.value as string)}
        style={{ minWidth: 200 }}
        {...rest}
      />
    </FilterWrapper>
  );
};
