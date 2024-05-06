import React, { memo } from 'react';
import { Checkbox, Stack } from 'v2/uikit';

import { generateDateCheckbox } from 'helpers/generateDate';

import { useFilterState } from './useFilters';

type TValue = Record<string, any> & {_id: string, label: string}

type TCheckboxGroupProps = {
  options: TValue[];
  filterKey: string
};

const FilterCheckboxGroup = ({ options, filterKey }: TCheckboxGroupProps) => {
  const [value, setValue] = useFilterState(filterKey);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = generateDateCheckbox(value, e.target.name);
    setValue(result);
  };

  return (
    <Stack>
      {options.map(item => (
        <Checkbox key={item._id} name={item._id} label={item.label} onChange={handleChange} checked={value?.includes(item._id)} />
      ))}
    </Stack>
  );
};

export default memo(FilterCheckboxGroup);
