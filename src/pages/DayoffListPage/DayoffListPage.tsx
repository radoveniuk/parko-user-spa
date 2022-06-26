import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Page, { PageTitle } from 'components/shared/Page';
import { ClearFiLtersButton, FiltersBar, FilterSelect, FiltersProvider, FilterText, useFilters } from 'components/shared/Filters';
import useDebounce from 'hooks/useDebounce';
import { useGetDaysoff } from 'api/query/dayoffQuery';
import { getDateFromIso } from 'helpers/datetime';
import { useGetProjects } from 'api/query/projectQuery';
import { IDayOff } from 'interfaces/dayoff.interface';
import Dialog from 'components/shared/Dialog';
import Input from 'components/shared/Input';
import Button from 'components/shared/Button';
import { useUpdateDayoffMutation } from 'api/mutations/dayoffMutation';
import Pagination from 'components/shared/Pagination';
import usePaginatedList from 'hooks/usePaginatedList';

import { CommentDialogWrapper } from './styles';

const columns = [
  'dayoff.user',
  'dayoff.dateStart',
  'dayoff.dateEnd',
  'dayoff.reason',
  'dayoff.comment',
  'dayoff.adminComment',
];

const DayoffListPageRender = () => {
  const { filtersState } = useFilters();
  const debouncedFiltersState = useDebounce(filtersState);
  const { t } = useTranslation();
  const { data, refetch } = useGetDaysoff(debouncedFiltersState);
  const { pageItems, paginationConfig } = usePaginatedList(data);
  const { data: projects = [] } = useGetProjects();
  const updateDayoffMutation = useUpdateDayoffMutation();

  const [selectedItem, setSelectedItem] = useState<IDayOff | null>(null);
  const [adminComment, setAdminComment] = useState('');

  const saveAdminComment = () => {
    updateDayoffMutation.mutateAsync({ ...selectedItem, adminComment }).then(() => {
      setSelectedItem(null);
      refetch();
    });
  };

  useEffect(() => {
    refetch();
  }, [debouncedFiltersState, refetch]);

  return (
    <Page title={t('dayoffList')}>
      <PageTitle>{t('dayoffList')}</PageTitle>
      <FiltersBar>
        <FilterText filterKey="search" label={t('search')} />
        <FilterSelect filterKey="project" label={t('user.project')} options={projects} valuePath="_id" labelPath="name" />
        <ClearFiLtersButton />
      </FiltersBar>
      <ListTable columns={columns} >
        {pageItems.map((item) => (
          <ListTableRow key={item._id} onClick={() => void setSelectedItem(item)}>
            <ListTableCell>{typeof item.user !== 'string' && `${item.user.name} ${item.user.surname}`}</ListTableCell>
            <ListTableCell>{getDateFromIso(item.dateStart)}</ListTableCell>
            <ListTableCell>{getDateFromIso(item.dateEnd)}</ListTableCell>
            <ListTableCell>{t(`selects.dayoffReason.${item.reason}`)}</ListTableCell>
            <ListTableCell>{item.description}</ListTableCell>
            <ListTableCell>{item.adminComment}</ListTableCell>
          </ListTableRow>
        ))}
      </ListTable>
      <Pagination {...paginationConfig} />
      {!!selectedItem && (
        <Dialog title={t('dayoff.adminComment')} open={!!selectedItem} onClose={() => void setSelectedItem(null)}>
          <CommentDialogWrapper>
            <strong>
              {typeof selectedItem.user !== 'string' && `${selectedItem.user.name} ${selectedItem.user.surname}`}
            </strong>
            <div className="dates">
              <p>{getDateFromIso(selectedItem.dateStart)}</p>
              &ndash;
              <p>{getDateFromIso(selectedItem.dateEnd)}</p>
            </div>
            <p>{t(`selects.dayoffReason.${selectedItem.reason}`)}</p>
            <p>{selectedItem.description}</p>
            <Input
              defaultValue={selectedItem.adminComment}
              onChange={({ target: { value } }) => void setAdminComment(value) }
              autoFocus
              multiline
            />
            <Button onClick={saveAdminComment}>{t('dayoff.send')}</Button>
          </CommentDialogWrapper>
        </Dialog>
      )}
    </Page>
  );
};

export default function DayoffListPage () {
  return (
    <FiltersProvider>
      <DayoffListPageRender />
    </FiltersProvider>
  );
};
