import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from 'v2/uikit';

import { useGetCustomFormFields } from 'api/query/customFormsQuery';

import HeaderTable from './HeaderTable';
import MobileFieldCard from './MobileFieldCard';
import { DocsTemplatesWrapper, FilterTableWrapper } from './styles';
import Table from './Table';

const FormFields = () => {
  const { t, i18n } = useTranslation();
  const { data = [], isFetching, isLoading } = useGetCustomFormFields();

  const [searchValue, setSearchValue] = useState('');
  const fields = useMemo(() =>
    data.filter((item) => item.names[i18n.language].toLowerCase().includes(searchValue.toLowerCase())), [data, i18n.language, searchValue]);

  return (
    <DocsTemplatesWrapper>
      <div className="container-table">
        <HeaderTable count={fields.length} />
        <FilterTableWrapper>
          <Input label={t('search')} theme="gray" value={searchValue} onChange={(e) => void setSearchValue(e.target.value)} />
        </FilterTableWrapper>
        <div className="mobile-list">
          {data.map((field) => (
            <MobileFieldCard
              key={field._id}
              data={field}
            />
          ))}
        </div>
        <Table data={fields} isFetching={isFetching || isLoading} />
      </div>
    </DocsTemplatesWrapper>
  );
};

export default FormFields;
