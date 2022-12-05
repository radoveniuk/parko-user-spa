import React, { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useDeleteProjectMutation, useUpdateProjectMutation } from 'api/mutations/projectMutation';
import { useGetDictionary } from 'api/query/dictionariesQuery';
import { useGetUserList, useGetUserListForFilter } from 'api/query/userQuery';
import PrintDocDialog from 'components/complex/PrintDocDialog';
import { CheckAllIcon, DeleteIcon, ExportIcon, PlusIcon, PrintIcon, RemoveCheckIcon, SaveIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Checkbox from 'components/shared/Checkbox';
import Dialog from 'components/shared/Dialog';
import { ClearFiLtersButton, FilterAutocomplete, FiltersBar, FilterSelect, FiltersProvider, useFilters } from 'components/shared/Filters';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Menu, { Divider, MenuItem } from 'components/shared/Menu';
import Pagination from 'components/shared/Pagination';
import Select from 'components/shared/Select';
import { Tab, TabPanel, Tabs, TabsContainer, useTabs } from 'components/shared/Tabs';
import { EMPLOYMENT_TYPE } from 'constants/selectsOptions';
import { STATUSES, STATUSES_COLORS } from 'constants/userStatuses';
import { getDateFromIso } from 'helpers/datetime';
import { useExportData } from 'hooks/useExportData';
import usePaginatedList from 'hooks/usePaginatedList';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
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

  const [activeTab] = useTabs();

  const {
    data: linkedUsers = [],
    refetch: refetchLinkedUsers,
  } = useGetUserList({ project: data._id, ...debouncedFiltersState });

  // filters data
  const employmentTypeOptions = useTranslatedSelect(EMPLOYMENT_TYPE, 'employmentType');
  const statusOptions = useTranslatedSelect(STATUSES, 'userStatus');
  const { data: profilePositionDictionary } = useGetDictionary('PROFILE_POSITIONS');
  const {
    data: linkedUsersFilter = [],
  } = useGetUserListForFilter({ project: data._id });

  // pagination
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const { pageItems: pageLinkedUsers, paginationConfig } = usePaginatedList(linkedUsers, { rowsPerPage });
  const deleteProjectMutation = useDeleteProjectMutation();

  const deleteProjectHandler = async () => {
    deleteProjectMutation.mutateAsync(data._id);
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
    updateProjectMutation.mutate(data);
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
        {activeTab === 0 && (
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
                <ExportIcon size={20} />{t('user.export')}
              </MenuItem>
            </Menu>
          </div>
        )}
      </Tabs>
      <TabPanel index={0}>
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
        <ListTable columns={TABLE_COLS} className="users-table" stickyHeader>
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
        </ProjectInfoDataWrapper>
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
