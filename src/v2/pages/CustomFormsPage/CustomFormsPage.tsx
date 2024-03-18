import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from 'v2/uikit';

import { useGetCustomForms } from 'api/query/customFormsQuery';

import HeaderTable from './HeaderTable';
// import MobileFieldCard from './MobileFieldCard';
import { DocsTemplatesWrapper, FilterTableWrapper } from './styles';
import Table from './Table';

const CustomFormsPage = () => {
  const { t } = useTranslation();
  const { data = [], isFetching, isLoading } = useGetCustomForms();

  const [searchValue, setSearchValue] = useState('');
  const forms = useMemo(() =>
    data.filter((item) => item.name.toLowerCase().includes(searchValue.toLowerCase())), [data, searchValue]);

  return (
    <DocsTemplatesWrapper>
      <div className="container-table">
        <HeaderTable count={forms.length} />
        <FilterTableWrapper>
          <Input label={t('search')} theme="gray" value={searchValue} onChange={(e) => void setSearchValue(e.target.value)} />
        </FilterTableWrapper>
        {/* <div className="mobile-list">
          {data.map((field) => (
            <MobileFieldCard
              key={field._id}
              data={field}
            />
          ))}
        </div> */}
        <Table data={forms} isFetching={isFetching || isLoading} />
      </div>
    </DocsTemplatesWrapper>
  );
};

export default CustomFormsPage;
