import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';
import Button from 'v2/uikit/Button';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';

import { useCreatePrepaymentMutation, useDeletePrepaymentMutation, useUpdatePrepaymentMutation } from 'api/mutations/prepaymentMutation';
import { useGetPrepayments } from 'api/query/prepaymentQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { ArrowUpIcon, CloseIcon, EditIcon, PlusIcon } from 'components/icons';
import { ClearFiltersButton, FilterAutocomplete, FiltersBar, FiltersProvider, useFilters } from 'components/shared/Filters';
import { FilterDate, FilterSelect } from 'components/shared/Filters/Filters';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { PageActions } from 'components/shared/PageComponents';
import Pagination from 'components/shared/Pagination';
import { PREPAYMENT_STATUS } from 'constants/selectsOptions';
import { STATUSES_COLORS, USER_STATUSES } from 'constants/statuses';
import { getDateFromIso } from 'helpers/datetime';
import usePaginatedList from 'hooks/usePaginatedList';
import useSortedList, { SortingValue } from 'hooks/useSortedList';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import PrepaymentDialog from './PrepaymentDialog';

const COLS = [
  'prepayment.user',
  'user.project',
  'user.status',
  'prepayment.date',
  'prepayment.sum',
  'prepayment.comment',
  'prepayment.status',
  'prepayment.paymentDate',
  '',
  '',
];

const PrepaymentsListPageRender = () => {
  const { debouncedFiltersState } = useFilters();
  const { t } = useTranslation();

  const { data = [], refetch } = useGetPrepayments(debouncedFiltersState);
  const { sortedData, sorting, sortingToggler } = useSortedList(data);
  const toggleSorting = (prepaymentKey: string) => {
    let sortingValue: SortingValue<IPrepayment> = prepaymentKey as keyof IPrepayment;
    if (prepaymentKey === 'user') {
      sortingValue = 'user.name';
    }
    if (prepaymentKey === 'user.project') {
      sortingValue = 'user.project.name';
    }
    if (prepaymentKey === 'comment') {
      sortingValue = 'userComment';
    }
    sortingToggler(prepaymentKey, sortingValue);
  };

  const { pageItems, paginationConfig } = usePaginatedList(sortedData);

  const translatedStatuses = useTranslatedSelect(USER_STATUSES, 'userStatus');
  const translatedPrepaymentStatuses = useTranslatedSelect(PREPAYMENT_STATUS, 'prepaymentStatus');
  const { data: projects = [] } = useGetProjects();
  const { data: users = [] } = useGetUserListForFilter();
  const createPrepaymentMutation = useCreatePrepaymentMutation();
  const updatePrepaymentMutation = useUpdatePrepaymentMutation();
  const deletePrepaymentMutation = useDeletePrepaymentMutation();

  const [activePrepayment, setActivePrepayment] = useState<IPrepayment | boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const updatePrepaymentHandler = (values: IPrepayment) => {
    if (typeof activePrepayment === 'object' && activePrepayment?._id) {
      updatePrepaymentMutation.mutateAsync({ ...activePrepayment, ...values }).then(() => { setActivePrepayment(false); refetch(); });
    } else {
      createPrepaymentMutation.mutateAsync({ ...values, createdByRole: 'admin' }).then(() => { setActivePrepayment(false); refetch(); });
    }
  };

  useEffect(() => {
    refetch();
  }, [debouncedFiltersState, refetch]);

  useDocumentTitle(t('prepaymentsList'));

  return (
    <>
      <PageActions><Button onClick={() => void setActivePrepayment(true)}><PlusIcon size={20} />{t('prepayment.new')}</Button></PageActions>
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
        <FilterSelect
          filterKey="status"
          label={t('prepayment.status')}
          options={translatedPrepaymentStatuses}
          emptyItem="noSelected"
        />
        <FilterDate filterKey="firstDate" label={t('firstDate')} />
        <FilterDate filterKey="lastDate" label={t('lastDate')} />
        <ClearFiltersButton />
      </FiltersBar>
      <ListTable
        columns={COLS}
        columnComponent={(col) => col && (
          <div
            role="button"
            className="col-item"
            onClick={() => void toggleSorting(col.replace(/prepayment./gi, ''))}
          >
            {t(col)}
            <IconButton
              className={sorting?.key === col.replace(/prepayment./gi, '') ? `sort-btn active ${sorting.dir}` : 'sort-btn'}
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
              <ListTableCell>{item.createdAt && getDateFromIso(item.createdAt)}</ListTableCell>
              <ListTableCell>{`${item.sum}€`}</ListTableCell>
              <ListTableCell>{item.userComment}</ListTableCell>
              <ListTableCell color={STATUSES_COLORS[item.status]}>{t(`selects.prepaymentStatus.${item.status}`)}</ListTableCell>
              <ListTableCell>{getDateFromIso(item.paymentDate)}</ListTableCell>
              <ListTableCell><IconButton onClick={() => void setActivePrepayment(item)}><EditIcon /></IconButton></ListTableCell>
              <ListTableCell><IconButton onClick={() => void setItemToDelete(item._id)}><CloseIcon /></IconButton></ListTableCell>
            </ListTableRow>
          );
        })}
      </ListTable>
      <Pagination {...paginationConfig} />
      {!!activePrepayment && (
        <PrepaymentDialog
          open={!!activePrepayment}
          onClose={() => void setActivePrepayment(false)}
          submit={updatePrepaymentHandler}
          {...(typeof activePrepayment === 'object' && { prepayment: activePrepayment })}
        />
      )}
      <DialogConfirm
        onClose={() => void setItemToDelete(null)}
        open={!!itemToDelete}
        onSubmit={() => {
          deletePrepaymentMutation.mutateAsync(itemToDelete as string).then(() => {
            setItemToDelete(null);
            refetch();
          });
        }}
      />
    </>
  );
};

export default function PrepaymentsListPage () {
  return (
    <FiltersProvider>
      <PrepaymentsListPageRender />
    </FiltersProvider>
  );
};
