import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useUpdatePrepaymentMutation } from 'api/mutations/prepaymentMutation';
import { useGetPrepayments } from 'api/query/prepaymentQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { BooleanIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Dialog from 'components/shared/Dialog';
import { ClearFiLtersButton, FiltersBar, FilterSelect, FiltersProvider, FilterText, useFilters } from 'components/shared/Filters';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Page, { PageTitle } from 'components/shared/Page';
import Pagination from 'components/shared/Pagination';
import { getDateFromIso } from 'helpers/datetime';
import useDebounce from 'hooks/useDebounce';
import usePaginatedList from 'hooks/usePaginatedList';
import { IPrepayment } from 'interfaces/prepayment.interface';

import { ApproveDialogWrapper } from './styles';

const columns = [
  'prepayment.user',
  'prepayment.date',
  'prepayment.sum',
  'prepayment.comment',
  'prepayment.approved',
];

const PrepaymentsListPageRender = () => {
  const { filtersState } = useFilters();
  const debouncedFiltersState = useDebounce(filtersState);
  const { t } = useTranslation();
  const { data, refetch } = useGetPrepayments(debouncedFiltersState);
  const { pageItems, paginationConfig } = usePaginatedList(data);
  const { data: projects = [] } = useGetProjects();
  const updatePrepaymentMutation = useUpdatePrepaymentMutation();

  const [selectedItem, setSelectedItem] = useState<IPrepayment | null>(null);

  const updatePrepaymentHandler = (isApproved: boolean) => {
    if (selectedItem !== null) {
      updatePrepaymentMutation.mutateAsync({ ...selectedItem, isApproved }).then(() => { setSelectedItem(null); refetch(); });
    }
  };

  useEffect(() => {
    refetch();
  }, [debouncedFiltersState, refetch]);

  return (
    <Page title={t('prepaymentsList')}>
      <PageTitle>{t('prepaymentsList')}</PageTitle>
      <FiltersBar>
        <FilterText filterKey="search" label={t('search')} />
        <FilterSelect filterKey="project" label={t('user.project')} options={projects} valuePath="_id" labelPath="name" />
        <ClearFiLtersButton />
      </FiltersBar>
      <ListTable columns={columns} >
        {pageItems.map((item) => (
          <ListTableRow key={item._id} onClick={() => void setSelectedItem(item)}>
            <ListTableCell>{typeof item.user !== 'string' && `${item.user.name} ${item.user.surname}`}</ListTableCell>
            <ListTableCell>{item.createdAt && getDateFromIso(item.createdAt)}</ListTableCell>
            <ListTableCell>{`${item.sum}€`}</ListTableCell>
            <ListTableCell>{item.userComment}</ListTableCell>
            <ListTableCell><BooleanIcon value={item.isApproved} size={20} /></ListTableCell>
          </ListTableRow>
        ))}
      </ListTable>
      <Pagination {...paginationConfig} />
      {!!selectedItem && (
        <Dialog title={t('prepayment.approval')} open={!!selectedItem} onClose={() => void setSelectedItem(null)}>
          <ApproveDialogWrapper>
            <strong>
              {typeof selectedItem.user !== 'string' && `${selectedItem.user.name} ${selectedItem.user.surname}`}
            </strong>
            <p>{selectedItem.createdAt && getDateFromIso(selectedItem.createdAt)}</p>
            <p>{`${selectedItem.sum}€`}</p>
            <i>{selectedItem.userComment}</i>
            <div className="actions">
              <Button color="success" onClick={() => void updatePrepaymentHandler(true)}>{t('prepayment.approve')}</Button>
              <Button color="error" onClick={() => void updatePrepaymentHandler(false)}>{t('prepayment.reject')}</Button>
            </div>
          </ApproveDialogWrapper>
        </Dialog>
      )}
    </Page>
  );
};

export default function PrepaymentsListPage () {
  return (
    <FiltersProvider>
      <PrepaymentsListPageRender />
    </FiltersProvider>
  );
};
