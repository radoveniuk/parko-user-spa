import React from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';
import Autocomplete from 'v2/uikit/Autocomplete';

import { useGetOrders } from 'api/query/orderQuery';
import { SearchIcon } from 'components/icons';
import { CLIENT_STATUS, ORDER_COOPERATION_TYPE } from 'constants/selectsOptions';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IOrder } from 'interfaces/order.interface';
import { IProject } from 'interfaces/project.interface';

import HeaderTable from './components/HeaderTable';
import Table from './components/Table';
import { FilterTableWrapper, OrdersWrapper } from './styles';

type Props = {
  orders: IOrder<true>[];
  projects: IProject[];
}

const DEFAULT_COLS = [
  'order.name',
  'order.client',
  'order.project',
  'order.cooperationType',
  'order.status',
  'order.tableStats',
  'order.candidateTableStats',
  'order.dateFrom',
  'order.dateTo',
  'order.createdAt',
  'order.createdBy',
];

const Orders = ({ orders, projects }: Props) => {
  const { t } = useTranslation();
  useDocumentTitle(t('navbar.orders'));

  // filters
  const { data: filterList = [] } = useGetOrders();
  const statusList = useTranslatedSelect(CLIENT_STATUS, 'clientStatus');
  const cooperationTypeList = useTranslatedSelect(ORDER_COOPERATION_TYPE, 'orderCooperationType');

  return (
    <OrdersWrapper>
      <div className="container-table">
        <HeaderTable
          count={orders.length}
        />
        <FilterTableWrapper>
          <Autocomplete
            multiple
            options={filterList}
            getOptionLabel={(item) => item.name}
            valueKey="_id"
            prefixIcon={<SearchIcon className="search-icon"/>}
            className="filter-name"
            limitTags={1}
            label={t('search')}
            theme="gray"
          />
          <Autocomplete
            multiple
            label={t('order.status')}
            options={statusList}
            getOptionLabel={(option) => option.label}
            theme="gray"
          />
          <Autocomplete
            multiple
            label={t('order.project')}
            options={projects}
            getOptionLabel={(option) => `${option.client?.shortName ? `${option.client?.shortName} > ` : `${option.client?.name} > `}${option.name}`}
            theme="gray"
          />
          <Autocomplete
            multiple
            label={t('order.cooperationType')}
            options={cooperationTypeList}
            getOptionLabel={(option) => option.label}
            theme="gray"
          />
        </FilterTableWrapper>
        {/* <div className="mobile-list">
          {data.map((prepayment) => (
            <MobilePrepaymentCard
              key={prepayment._id}
              prepayment={prepayment}
            />
          ))}
        </div> */}
        <Table
          activeCols={DEFAULT_COLS}
          data={orders}
        />
      </div>
    </OrdersWrapper>
  );
};

export default Orders;
