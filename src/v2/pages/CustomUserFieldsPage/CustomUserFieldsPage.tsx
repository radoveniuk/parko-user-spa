import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from 'v2/uikit';

import { useGetCustomFormFieldSectionBindings } from 'api/query/customFormsQuery';

import HeaderTable from './HeaderTable';
import MobileBindingCard from './MobileBindingCard';
import { DocsTemplatesWrapper, FilterTableWrapper } from './styles';
import Table from './Table';

const CustomUserFieldsPage = () => {
  const { t, i18n } = useTranslation();
  const { data: allBindings = [], isFetching, isLoading } = useGetCustomFormFieldSectionBindings();

  const [searchValue, setSearchValue] = useState('');
  const bindings = useMemo(() =>
    allBindings.filter((item) => item?.section?.entity === 'user' &&
    (item?.field?.names[i18n.language].toLowerCase().includes(searchValue.toLowerCase()) ||
    item?.section?.names[i18n.language]?.toLowerCase()?.includes(searchValue.toLowerCase()))), [allBindings, i18n.language, searchValue]);

  return (
    <DocsTemplatesWrapper>
      <div className="container-table">
        <HeaderTable count={bindings.length} />
        <FilterTableWrapper>
          <Input label={t('search')} theme="gray" value={searchValue} onChange={(e) => void setSearchValue(e.target.value)} />
        </FilterTableWrapper>
        <div className="mobile-list">
          {bindings.map((binding) => (
            <MobileBindingCard
              key={binding._id}
              data={binding}
            />
          ))}
        </div>
        <Table data={bindings} isFetching={isFetching || isLoading} />
      </div>
    </DocsTemplatesWrapper>
  );
};

export default CustomUserFieldsPage;
