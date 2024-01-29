import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import IconButton from 'v2/uikit/IconButton';

import { useCreateDayoffMutation, useDeleteDayoffMutation, useUpdateDayoffMutation } from 'api/mutations/dayoffMutation';
import { useGetDaysoff } from 'api/query/dayoffQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { ArrowUpIcon, CloseIcon, EditIcon, PlusIcon } from 'components/icons';
import Button from 'components/shared/Button';
import DialogConfirm from 'components/shared/DialogConfirm';
import { ClearFiLtersButton, FilterAutocomplete, FiltersBar, FiltersProvider, useFilters } from 'components/shared/Filters';
import { FilterDate } from 'components/shared/Filters/Filters';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { PageActions } from 'components/shared/PageComponents';
import Pagination from 'components/shared/Pagination';
import { STATUSES_COLORS, USER_STATUSES } from 'constants/statuses';
import { getDateFromIso } from 'helpers/datetime';
import usePaginatedList from 'hooks/usePaginatedList';
import useSortedList, { SortingValue } from 'hooks/useSortedList';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IDayOff } from 'interfaces/dayoff.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import DayoffDialog from './DayoffDialog';

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

  const createDayoffMutation = useCreateDayoffMutation();
  const updateDayoffMutation = useUpdateDayoffMutation();
  const deleteDayoffMutation = useDeleteDayoffMutation();

  const [selectedItem, setSelectedItem] = useState<IDayOff | boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const saveAdminComment = (values: IDayOff) => {
    if (typeof selectedItem === 'object' && selectedItem?._id) {
      updateDayoffMutation.mutateAsync({ ...selectedItem, ...values }).then(() => { setSelectedItem(false); refetch(); });
    } else {
      createDayoffMutation.mutateAsync({ ...values }).then(() => { setSelectedItem(false); refetch(); });
    }
  };

  useEffect(() => {
    refetch();
  }, [debouncedFiltersState, refetch]);

  return (
    <>
      <PageActions>
        <Button onClick={() => void setSelectedItem(true)}><PlusIcon size={20} />{t('dayoff.new')}</Button>
      </PageActions>
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
                {!!project && (
                  <Link
                    to={`/projects?id=${project._id}`}
                    className="table-link"
                  >
                    {project.name}
                  </Link>
                )}
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
        <DayoffDialog
          open={!!selectedItem}
          onClose={() => void setSelectedItem(false)}
          submit={saveAdminComment}
          {...(typeof selectedItem === 'object' && { dayoff: selectedItem })}
        />
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
    </>
  );
};

export default function DayoffListPage () {
  return (
    <FiltersProvider>
      <DayoffListPageRender />
    </FiltersProvider>
  );
};
