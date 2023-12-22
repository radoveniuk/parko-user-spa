import React, { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import IconButton from 'v2/uikit/IconButton';
import Select from 'v2/uikit/Select';

import { useDeleteProjectMutation, useUpdateProjectMutation } from 'api/mutations/projectMutation';
import { useGetClients } from 'api/query/clientQuery';
import { useGetDictionary } from 'api/query/dictionariesQuery';
import { useGetUserList, useGetUserListForFilter } from 'api/query/userQuery';
import PrintDocDialog from 'components/complex/PrintDocDialog';
import { ArrowUpIcon, CheckAllIcon, DeleteIcon, ExcelIcon, PlusIcon, PrintIcon, RemoveCheckIcon, SaveIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Checkbox from 'components/shared/Checkbox';
import Dialog from 'components/shared/Dialog';
import { ClearFiLtersButton, FilterAutocomplete, FiltersBar, FilterSelect, FiltersProvider, useFilters } from 'components/shared/Filters';
import { FilterDate } from 'components/shared/Filters/Filters';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Menu, { Divider, MenuItem } from 'components/shared/Menu';
import Pagination from 'components/shared/Pagination';
import { Tab, TabPanel, Tabs, TabsContainer } from 'components/shared/Tabs';
import { EMPLOYMENT_TYPE } from 'constants/selectsOptions';
import { STATUSES_COLORS, USER_STATUSES } from 'constants/statuses';
import { getDateFromIso } from 'helpers/datetime';
import { useExportData } from 'hooks/useExportData';
import usePaginatedList from 'hooks/usePaginatedList';
import useSortedList from 'hooks/useSortedList';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { Path } from 'interfaces/base.types';
import { IClient } from 'interfaces/client.interface';
import { IProject } from 'interfaces/project.interface';
import { ROWS_PER_PAGE_OPTIONS } from 'interfaces/table.types';
import { IUser } from 'interfaces/users.interface';

import OnboardModal from '../OnboardModal';
import ProjectForm from '../ProjectForm';

import { DialogContentWrapper, ProjectActionsWrapper, ProjectInfoDataWrapper, ProjectInfoWrapper } from './styles';

const TABLE_COLS = ['', 'user.name', 'user.employmentType', 'user.position', 'user.cooperationStartDate', 'user.cooperationEndDate', 'user.status'];

type Props = {
  data: IProject;
  onDelete(): void;
}

const ProjectInfoRender = ({ data, onDelete }: Props) => {
  const { t } = useTranslation();
  const methods = useForm<IProject>({ defaultValues: data });
  const [openOnboard, setOpenOnboard] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<IUser[]>([]);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const { debouncedFiltersState } = useFilters();
  const exportData = useExportData({
    data: selectedItems,
    colsToExport: TABLE_COLS.filter((col) => !!col).map((col) => col.replace('user.', '')),
    cols: TABLE_COLS.filter((col) => !!col).map((col) => col.replace('user.', '')),
    entity: 'user',
  });
  const updateProjectMutation = useUpdateProjectMutation();

  // profiles data
  const {
    data: linkedUsers = [],
    refetch: refetchLinkedUsers,
  } = useGetUserList({ project: data._id, ...debouncedFiltersState });

  const { sortedData: sortedLinkedUsers, sorting, sortingToggler } = useSortedList(linkedUsers);

  const toggleSorting = (userKey: keyof IUser) => {
    let sortingValue: Path<IUser> | ((v: IUser) => unknown) = userKey;
    if ([
      'cooperationStartDate', 'birthDate', 'permitStartDate',
      'permitExpire', 'cooperationEndDate', 'permitType', 'status', 'source',
    ].includes(userKey)) {
      sortingValue = (_) => _[userKey] || null;
    }
    sortingToggler(userKey, sortingValue);
  };

  // pagination
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const { pageItems: pageLinkedUsers, paginationConfig } = usePaginatedList(sortedLinkedUsers, { rowsPerPage });

  const {
    data: clients = [],
  } = useGetClients();

  // filters data
  const employmentTypeOptions = useTranslatedSelect(EMPLOYMENT_TYPE, 'employmentType');
  const statusOptions = useTranslatedSelect(USER_STATUSES, 'userStatus');
  const { data: profilePositionDictionary } = useGetDictionary('PROFILE_POSITIONS');
  const {
    data: linkedUsersFilter = [],
  } = useGetUserListForFilter({ project: data._id });

  // delete
  const deleteProjectMutation = useDeleteProjectMutation();

  const deleteProjectHandler = async () => {
    await deleteProjectMutation.mutateAsync(data._id);
    setIsOpenDeleteDialog(false);
    onDelete();
  };

  const prepareUserToExport = (user: IUser): IUser => ({
    ...user,
    cooperationStartDate: getDateFromIso(user.cooperationStartDate),
    cooperationEndDate: getDateFromIso(user.cooperationEndDate),
    status: t(`selects.userStatus.${user.status}`),
    employmentType: t(`selects.employmentType.${user.employmentType}`),
  });

  const submitEdit: SubmitHandler<IProject> = async (data) => {
    updateProjectMutation.mutate({ ...data, client: data.client || null });
  };

  useEffect(() => {
    if (debouncedFiltersState) {
      refetchLinkedUsers();
    }
  }, [debouncedFiltersState, refetchLinkedUsers]);

  return (
    <ProjectInfoWrapper>
      <Tabs>
        <Tab label={t('project.users')} />
        <Tab label={t('project.data')} />
      </Tabs>
      <TabPanel index={0}>
        <div className="table-actions">
          <Menu>
            <MenuItem color="secondary" onClick={() => void setOpenOnboard(true)}>
              <PlusIcon size={20} />{t('project.addProfile')}
            </MenuItem>
            <Divider />
            <MenuItem disabled={!linkedUsers.length} onClick={() => void setSelectedItems(linkedUsers.map(prepareUserToExport))}>
              <CheckAllIcon size={20} />{t('selectAll')}
            </MenuItem>
            <MenuItem disabled={!selectedItems.length} onClick={() => void setSelectedItems([])}>
              <RemoveCheckIcon size={20} />{t('removeSelect')}
            </MenuItem>
            <Divider />
            <MenuItem disabled={!selectedItems.length} onClick={() => void setOpenPrintDialog(true)}>
              <PrintIcon size={20} />{t('docsTemplates.print')}
            </MenuItem>
            <Divider />
            <MenuItem disabled={!selectedItems.length} onClick={() => void exportData('xlsx')}>
              <ExcelIcon size={20} />{t('user.export')}
            </MenuItem>
          </Menu>
        </div>
        <FiltersBar>
          <FilterAutocomplete
            multiple
            options={linkedUsersFilter}
            getOptionLabel={(user) => `${user.name} ${user.surname}`}
            filterKey="ids"
            label={t('search')}
          />
          <FilterSelect
            options={profilePositionDictionary?.options || []}
            filterKey="position"
            label={t('user.position')}
          />
          <FilterSelect
            options={statusOptions}
            filterKey="status"
            label={t('user.status')}
          />
          <FilterSelect
            options={employmentTypeOptions}
            filterKey="employmentType"
            label={t('user.employmentType')}
          />
          <FilterDate
            filterKey="cooperationFrom"
            label={t('project.cooperationFrom')}
          />
          <FilterDate
            filterKey="cooperationTo"
            label={t('project.cooperationTo')}
          />
          <ClearFiLtersButton />
          <div className="table-settings">
            <Select
              label={t('rowsPerPage')}
              value={rowsPerPage}
              options={ROWS_PER_PAGE_OPTIONS}
              onChange={(e) => void setRowsPerPage(e.target.value as number)}
              style={{ minWidth: 200 }}
            />
          </div>
        </FiltersBar>
        <ListTable
          columns={TABLE_COLS}
          className="users-table"
          stickyHeader
          columnComponent={(col) => col && (
            <div role="button" className="col-item" onClick={() => void toggleSorting(col.replace('user.', '') as keyof IUser) }>
              {t(col)}
              <IconButton
                className={sorting?.key === col.replace('user.', '') as keyof IUser ? `sort-btn active ${sorting.dir}` : 'sort-btn'}
              >
                <ArrowUpIcon />
              </IconButton>
            </div>
          )}
        >
          {pageLinkedUsers.map((user) => (
            <ListTableRow key={user._id}>
              <ListTableCell>
                <Checkbox
                  checked={selectedItems.some((item) => item._id === user._id)}
                  onChange={(e) => {
                    const { checked } = e.target;
                    setSelectedItems((prev) => {
                      if (checked) {
                        return [...prev, prepareUserToExport(user)];
                      }
                      return prev.filter((item) => item._id !== user._id);
                    });
                  }}
                />
              </ListTableCell>
              <ListTableCell>
                <Link to={`/profile/${user._id}`} className="table-link" >
                  {user.name} {user.surname}
                </Link>
              </ListTableCell>
              <ListTableCell>{!!user.employmentType && t(`selects.employmentType.${user.employmentType}`)}</ListTableCell>
              <ListTableCell>{user.position}</ListTableCell>
              <ListTableCell>{getDateFromIso(user.cooperationStartDate)}</ListTableCell>
              <ListTableCell>{getDateFromIso(user.cooperationEndDate)}</ListTableCell>
              <ListTableCell color={STATUSES_COLORS[user.status]}>{t(`selects.userStatus.${user.status}`)}</ListTableCell>
            </ListTableRow>
          ))}
        </ListTable>
        <Pagination {...paginationConfig} />
      </TabPanel>
      <TabPanel index={1}>
        <ProjectInfoDataWrapper>
          <div className="project-props">
            <FormProvider {...methods}>
              <ProjectForm defaultValues={data} />
            </FormProvider>
          </div>
          <div className="project-client">
            <Select
              options={clients}
              emptyItem={t('noSelected')}
              label={t('project.client')}
              labelPath="name"
              valuePath="_id"
              defaultValue={(data.client as IClient)?._id || ''}
              {...methods.register('client')}
            />
          </div>
        </ProjectInfoDataWrapper>
        <ProjectActionsWrapper>
          <Button disabled={!methods.formState.isDirty} onClick={methods.handleSubmit(submitEdit)}>
            <SaveIcon />{t('project.submit')}
          </Button>
          <Button
            color="error"
            variant="outlined"
            onClick={() => void setIsOpenDeleteDialog(true)}
          >
            <DeleteIcon />
            {t('project.delete')}
          </Button>
          <Dialog title={t('project.delete')} open={isOpenDeleteDialog} onClose={() => void setIsOpenDeleteDialog(false)}>
            <DialogContentWrapper>
              <p className="warning-text">
                {t('project.approveRemoving')} <strong>({data.name})</strong>
              </p>
              <div className="actions"><Button color="error" onClick={deleteProjectHandler}>{t('project.approve')}</Button></div>
            </DialogContentWrapper>
          </Dialog>
        </ProjectActionsWrapper>
      </TabPanel>
      {openPrintDialog && (
        <PrintDocDialog users={selectedItems} open={openPrintDialog} onClose={() => void setOpenPrintDialog(false)} />
      )}
      {openOnboard && (
        <OnboardModal
          onClose={() => { setOpenOnboard(false); refetchLinkedUsers(); }}
          open={openOnboard}
          project={data._id}
        />
      )}
    </ProjectInfoWrapper>
  );
};

export default function ProjectInfo (props: Props) {
  return (
    <TabsContainer>
      <FiltersProvider disablePageQueries>
        <ProjectInfoRender {...props} />
      </FiltersProvider>
    </TabsContainer>
  );
};
