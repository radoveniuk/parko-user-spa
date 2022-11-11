import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useDeletePrepaymentMutation, useUpdatePrepaymentMutation } from 'api/mutations/prepaymentMutation';
import { useGetPrepayments } from 'api/query/prepaymentQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { BooleanIcon, CloseIcon, EditIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Dialog from 'components/shared/Dialog';
import DialogConfirm from 'components/shared/DialogConfirm';
import { ClearFiLtersButton, FilterAutocomplete, FiltersBar, FiltersProvider, useFilters } from 'components/shared/Filters';
import { FilterDate } from 'components/shared/Filters/Filters';
import IconButton from 'components/shared/IconButton';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Page, { PageTitle } from 'components/shared/Page';
import Pagination from 'components/shared/Pagination';
import { STATUSES, STATUSES_COLORS } from 'constants/userStatuses';
import { getDateFromIso } from 'helpers/datetime';
import useDebounce from 'hooks/useDebounce';
import usePaginatedList from 'hooks/usePaginatedList';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import { ApproveDialogWrapper } from './styles';

const columns = [
  'prepayment.user',
  'user.project',
  'user.status',
  'prepayment.date',
  'prepayment.sum',
  'prepayment.comment',
  'prepayment.approved',
  '',
  '',
];

const PrepaymentsListPageRender = () => {
  const { filtersState } = useFilters();
  const debouncedFiltersState = useDebounce(filtersState);
  const { t } = useTranslation();
  const { data, refetch } = useGetPrepayments(debouncedFiltersState);
  const translatedStatuses = useTranslatedSelect(STATUSES, 'userStatus');
  const { pageItems, paginationConfig } = usePaginatedList(data);
  const { data: projects = [] } = useGetProjects();
  const { data: users = [] } = useGetUserListForFilter();
  const updatePrepaymentMutation = useUpdatePrepaymentMutation();
  const deletePrepaymentMutation = useDeletePrepaymentMutation();

  const [selectedItem, setSelectedItem] = useState<IPrepayment | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

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
      <ListTable columns={columns} >
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
              <ListTableCell>{item.createdAt && getDateFromIso(item.createdAt)}</ListTableCell>
              <ListTableCell>{`${item.sum}€`}</ListTableCell>
              <ListTableCell>{item.userComment}</ListTableCell>
              <ListTableCell><BooleanIcon value={item.isApproved} size={20} /></ListTableCell>
              <ListTableCell><IconButton onClick={() => void setSelectedItem(item)}><EditIcon /></IconButton></ListTableCell>
              <ListTableCell><IconButton onClick={() => void setItemToDelete(item._id)}><CloseIcon /></IconButton></ListTableCell>
            </ListTableRow>
          );
        })}
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
