import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MobileOrderCard from 'v2/components/MobileOrderCard';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';
import Autocomplete from 'v2/uikit/Autocomplete';

import { useGetOrders } from 'api/query/orderQuery';
import { SearchIcon } from 'components/icons';
import { ORDER_COOPERATION_TYPE, ORDER_STATUS } from 'constants/selectsOptions';
import { useAuthData } from 'contexts/AuthContext';
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
  const statusList = useTranslatedSelect(ORDER_STATUS, 'orderStatus', true, false);
  const cooperationTypeList = useTranslatedSelect(ORDER_COOPERATION_TYPE, 'orderCooperationType', true, false);

  const [idsFilter, setIdsFilter] = useState<IOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<{_id: string}[]>([]);
  const [projectFilter, setProjectFilter] = useState<IProject[]>([]);
  const [cooperationTypeFilter, setCooperationTypeFilter] = useState<{_id: string}[]>([]);

  const filteredOrders = useMemo(() => {
    let res = [...orders];
    if (idsFilter.length) {
      res = res.filter((item) => idsFilter.some(filterOrder => filterOrder._id === item._id));
    }
    if (statusFilter.length) {
      res = res.filter((item) => statusFilter.some(status => status._id === item.status));
    }
    if (projectFilter.length) {
      res = res.filter((item) => projectFilter.some(project => project._id === item.project._id));
    }
    if (cooperationTypeFilter.length) {
      res = res.filter((item) => cooperationTypeFilter.some(cooperationType => cooperationType._id === item.cooperationType));
    }
    return res;
  }, [cooperationTypeFilter, idsFilter, orders, projectFilter, statusFilter]);

  const { permissions } = useAuthData();

  if (!permissions.includes('orders:read')) return null;

  return (
    <OrdersWrapper>
      <div className="container-table">
        <HeaderTable count={orders.length} />
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
            onChange={setIdsFilter}
            value={idsFilter}
          />
          <Autocomplete
            multiple
            label={t('order.status')}
            options={statusList}
            getOptionLabel={(option) => option.label}
            theme="gray"
            onChange={setStatusFilter}
            value={statusFilter}
          />
          <Autocomplete
            multiple
            label={t('order.project')}
            options={projects}
            getOptionLabel={(option) => `${option.client?.shortName ? `${option.client?.shortName} > ` : `${option.client?.name} > `}${option.name}`}
            theme="gray"
            onChange={setProjectFilter}
            value={projectFilter}
          />
          <Autocomplete
            multiple
            label={t('order.cooperationType')}
            options={cooperationTypeList}
            getOptionLabel={(option) => option.label}
            theme="gray"
            onChange={setCooperationTypeFilter}
            value={cooperationTypeFilter}
          />
        </FilterTableWrapper>
        <div className="mobile-list">
          {orders.map((order) => (
            <MobileOrderCard
              key={order._id}
              order={order}
            />
          ))}
        </div>
        <Table
          activeCols={DEFAULT_COLS}
          data={filteredOrders}
        />
      </div>
    </OrdersWrapper>
  );
};

export default Orders;
