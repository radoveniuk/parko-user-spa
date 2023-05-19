/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, FormControlLabel, Input, Radio, RadioGroup, Stack } from 'v2/uikit';

import { useGetProjects } from 'api/query/projectQuery';
import { FilterCheckboxGroup } from 'components/shared/Filters';
import { useFilterState } from 'components/shared/Filters/useFilters';

// eslint-disable-next-line no-unused-vars
enum FilterOrg {
  ALL = 'all',
  SELECT = 'select'
}

const FilterOrganization = () => {
  const { t } = useTranslation();
  const { data: projects = [] } = useGetProjects();
  const [valueQuery, setValueQuey] = useFilterState('projects');

  const [valueRadio, setValueRadio] = React.useState<FilterOrg>(valueQuery.length ? FilterOrg.SELECT : FilterOrg.ALL);
  const [searchValue, setSearchValue] = useState('');

  const filteredSearch = useMemo(
    () => projects.filter(elem => elem.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1).map((elem) => ({ ...elem, label: elem.name })),
    [searchValue, projects],
  );

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValueRadio((event.target as HTMLInputElement).value as FilterOrg);

    if (event.target.value === FilterOrg.ALL) {
      setSearchValue('');
      setValueQuey('');
    }
  }, []);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

  useEffect(() => {
    if (valueQuery.length && valueRadio !== FilterOrg.SELECT) {
      setValueRadio(FilterOrg.SELECT);
    } else if (!valueQuery.length && valueRadio !== FilterOrg.ALL) {
      setValueRadio(FilterOrg.ALL);
    }
  }, [valueRadio, valueQuery]);

  return (
    <>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={valueRadio}
        onChange={handleChange}
      >
        <Stack gap="5px">
          <FormControlLabel
            value={FilterOrg.ALL}
            control={<Radio />}
            label={t('profilesPage.all_workers')}
          />
          <FormControlLabel
            value={FilterOrg.SELECT}
            control={<Radio />}
            label={t('profilesPage.selected_workers')}
          />
        </Stack>
      </RadioGroup>
      <Input
        variant="standard"
        placeholder={t('profilesPage.search_workers')}
        className="search-projects"
        onChange={handleInput}
        value={searchValue}
      />
      <span className="title-choose">{t('profilesPage.choose_few')}</span>
      <Divider />
      <Stack className="list-projects">
        <FilterCheckboxGroup
          options={filteredSearch}
          filterKey="projects"
        />
      </Stack>
      <Divider className="divider-bottom" />
      <span className="text-control">{t('profilesPage.control_organization')}</span>
    </>
  );
};

export default FilterOrganization;
