import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from 'v2/uikit';

import { useGetRoles } from 'api/query/roleQuery';

import HeaderTable from './HeaderTable';
import MobileRoleCard from './MobileRoleCard';
import { DocsTemplatesWrapper, FilterTableWrapper } from './styles';
import Table from './Table';

const RolesPage = () => {
  const { t } = useTranslation();
  const { data = [], isFetching, isLoading } = useGetRoles();

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
        <div className="mobile-list">
          {data.map((field) => (
            <MobileRoleCard
              key={field._id}
              data={field}
            />
          ))}
        </div>
        <Table data={forms} isFetching={isFetching || isLoading} />
      </div>
    </DocsTemplatesWrapper>
  );
};

export default RolesPage;
