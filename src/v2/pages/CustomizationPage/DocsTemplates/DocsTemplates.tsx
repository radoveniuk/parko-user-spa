import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from 'v2/uikit';

import { useGetDocsTemplates } from 'api/query/docsTemplateQuery';
import { IDocsTemplateCategory } from 'interfaces/docsTemplateCategory.interface';

import HeaderTable from './HeaderTable';
import MobileTemplateCard from './MobileTemplateCard';
import { DocsTemplatesWrapper, FilterTableWrapper } from './styles';
import Table from './Table';

const DocsTemplates = () => {
  const { t } = useTranslation();
  const { data = [], isFetching, isLoading } = useGetDocsTemplates();

  const [searchValue, setSearchValue] = useState('');
  const docsTemplates = useMemo(() =>
    data.filter((item) => item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    (item.category as IDocsTemplateCategory)?.name?.toLowerCase()?.includes(searchValue.toLowerCase())), [data, searchValue]);

  return (
    <DocsTemplatesWrapper>
      <div className="container-table">
        <HeaderTable count={docsTemplates.length} />
        <FilterTableWrapper>
          <Input label={t('search')} theme="gray" value={searchValue} onChange={(e) => void setSearchValue(e.target.value)} />
        </FilterTableWrapper>
        <div className="mobile-list">
          {data.map((dayoff) => (
            <MobileTemplateCard
              key={dayoff._id}
              data={dayoff}
            />
          ))}
        </div>
        <Table data={docsTemplates} isFetching={isFetching || isLoading} />
      </div>
    </DocsTemplatesWrapper>
  );
};

export default DocsTemplates;
