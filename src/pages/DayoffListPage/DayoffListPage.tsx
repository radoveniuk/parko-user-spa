import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useDeleteDayoffMutation, useUpdateDayoffMutation } from 'api/mutations/dayoffMutation';
import { useGetDaysoff } from 'api/query/dayoffQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { ArrowUpIcon, CloseIcon, EditIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Dialog from 'components/shared/Dialog';
import DialogConfirm from 'components/shared/DialogConfirm';
import { ClearFiLtersButton, FilterAutocomplete, FiltersBar, FiltersProvider, useFilters } from 'components/shared/Filters';
import { FilterDate } from 'components/shared/Filters/Filters';
import IconButton from 'components/shared/IconButton';
import Input from 'components/shared/Input';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Page, { PageTitle } from 'components/shared/Page';
import Pagination from 'components/shared/Pagination';
import { STATUSES_COLORS, USER_STATUSES } from 'constants/statuses';
import { getDateFromIso } from 'helpers/datetime';
import usePaginatedList from 'hooks/usePaginatedList';
import useSortedList, { SortingValue } from 'hooks/useSortedList';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IDayOff } from 'interfaces/dayoff.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import { CommentDialogWrapper } from './styles';

const COLS = [
  'dayoff.user',
  'user.project',
  'user.status',
  'dayoff.dateStart',
  'dayoff.dateEnd',
  'dayoff.reason',
  'dayoff.comment',
  'dayoff.adminComment',
  '',
  '',
];

const DayoffListPageRender = () => {
  const { debouncedFiltersState } = useFilters();
  const { t } = useTranslation();
  // data
  const { data = [], refetch } = useGetDaysoff(debouncedFiltersState);
  const { sortedData, sorting, sortingToggler } = useSortedList(data);
  const toggleSorting = (userKey: string) => {
    let sortingValue: SortingValue<IDayOff> = userKey as keyof IDayOff;
    if (userKey === 'project') {
      sortingValue = 'user.project.name';
    }
    if (userKey === 'user') {
      sortingValue = 'user.name';
    }
    sortingToggler(userKey, sortingValue);
  };
  const { pageItems, paginationConfig } = usePaginatedList(sortedData);

  const { data: projects = [] } = useGetProjects();
  const { data: users = [] } = useGetUserListForFilter();
  const translatedStatuses = useTranslatedSelect(USER_STATUSES, 'userStatus');

  const updateDayoffMutation = useUpdateDayoffMutation();
  const deleteDayoffMutation = useDeleteDayoffMutation();

  const [selectedItem, setSelectedItem] = useState<IDayOff | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
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
        <FilterAutocomplete
          multiple
          options={users}
          getOptionLabel={(user) => `${user.name} ${user.surname}`}
          filterKey="users"
          label={t('search')}
        />
        <FilterAutocomplete
          multiple
          filterKey="projects"
          label={t('user.project')}
          options={projects}
          labelKey="name"
        />
        <FilterAutocomplete
          multiple
          filterKey="userStatuses"
          label={t('user.status')}
          options={translatedStatuses}
          labelKey="label"
        />
        <FilterDate filterKey="firstDate" label={t('firstDate')} />
        <FilterDate filterKey="lastDate" label={t('lastDate')} />
        <ClearFiLtersButton />
      </FiltersBar>
      <ListTable
        columns={COLS}
        columnComponent={(col) => col && (
          <div role="button" className="col-item" onClick={() => void toggleSorting(col.replace(/user.|dayoff./gi, ''))}>
            {t(col)}
            <IconButton
              className={sorting?.key === col.replace(/user.|dayoff./gi, '')
                ? `sort-btn active ${sorting.dir}`
                : 'sort-btn'
              }
            >
              <ArrowUpIcon />
            </IconButton>
          </div>
        )}
      >
        {pageItems.map((item) => {
          const user = item.user as IUser;
          const project = user.project as IProject;
          return (
            <ListTableRow key={item._id}>
              <ListTableCell>
                <Link
                  to={`/profile/${user._id}`}
                  className="table-link"
                >
                  {user.name} {user.surname}
                </Link>
              </ListTableCell>
              <ListTableCell>
                <Link
                  to={`/projects?id=${project._id}`}
                  className="table-link"
                >
                  {project.name}
                </Link>
              </ListTableCell>
              <ListTableCell>
                <p
                  style={{ color: STATUSES_COLORS[user.status] }}>
                  {t(`selects.userStatus.${user.status}`)}
                </p>
              </ListTableCell>
              <ListTableCell>{getDateFromIso(item.dateStart)}</ListTableCell>
              <ListTableCell>{getDateFromIso(item.dateEnd)}</ListTableCell>
              <ListTableCell>{t(`selects.dayoffReason.${item.reason}`)}</ListTableCell>
              <ListTableCell>{item.description}</ListTableCell>
              <ListTableCell>{item.adminComment}</ListTableCell>
              <ListTableCell><IconButton onClick={() => void setSelectedItem(item)}><EditIcon /></IconButton></ListTableCell>
              <ListTableCell><IconButton onClick={() => void setItemToDelete(item._id)}><CloseIcon /></IconButton></ListTableCell>
            </ListTableRow>
          );
        })}
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
      <DialogConfirm
        onClose={() => void setItemToDelete(null)}
        open={!!itemToDelete}
        onSubmit={() => {
          deleteDayoffMutation.mutateAsync(itemToDelete as string).then(() => {
            setItemToDelete(null);
            refetch();
          });
        }}
      />
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
