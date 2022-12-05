import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useDeleteProjectMutation } from 'api/mutations/projectMutation';
import { useGetCustomFormFields, useGetCustomFormSections } from 'api/query/customFormsQuery';
import { useGetDictionary } from 'api/query/dictionariesQuery';
import { useGetUserList, useGetUserListForFilter } from 'api/query/userQuery';
import PrintDocDialog from 'components/complex/PrintDocDialog';
import { CheckAllIcon, DeleteIcon, EditIcon, ExportIcon, PlusIcon, PrintIcon, RemoveCheckIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Checkbox from 'components/shared/Checkbox';
import Dialog from 'components/shared/Dialog';
import { ClearFiLtersButton, FilterAutocomplete, FiltersBar, FilterSelect, FiltersProvider, useFilters } from 'components/shared/Filters';
import Input from 'components/shared/Input';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Menu, { Divider, MenuItem } from 'components/shared/Menu';
import Pagination from 'components/shared/Pagination';
import { Tab, TabPanel, Tabs, TabsContainer, useTabs } from 'components/shared/Tabs';
import { EMPLOYMENT_TYPE } from 'constants/selectsOptions';
import { STATUSES, STATUSES_COLORS } from 'constants/userStatuses';
import { getDateFromIso } from 'helpers/datetime';
import { useExportData } from 'hooks/useExportData';
import usePaginatedList from 'hooks/usePaginatedList';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { ICustomFormField } from 'interfaces/form.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import OnboardModal from '../OnboardModal';

import { DialogContentWrapper, ProjectActionsWrapper, ProjectInfoDataWrapper, ProjectInfoWrapper } from './styles';

const TABLE_COLS = ['', 'user.name', 'user.employmentType', 'user.position', 'user.cooperationStartDate', 'user.cooperationEndDate', 'user.status'];

const projectInfoKeys: (keyof IProject)[] = ['name', 'email', 'phone', 'comment', 'cost', 'tariff', 'dateStart', 'dateEnd'];

type Props = {
  data: IProject;
  onDelete(): void;
}

const ProjectInfoRender = ({ data, onDelete }: Props) => {
  const { t, i18n } = useTranslation();
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

  const { pageItems: pageLinkedUsers, paginationConfig } = usePaginatedList(linkedUsers);

  const { data: customSections = [] } = useGetCustomFormSections({ entity: 'project' });
  const { data: customFields = [] } = useGetCustomFormFields({ entity: 'project' });
  const deleteProjectMutation = useDeleteProjectMutation();

  const prepareCustomFieldValue = (value: string, fieldData: ICustomFormField) => {
    if (fieldData.type === 'boolean') {
      return t(value);
    }
    if (fieldData.type === 'date') {
      return getDateFromIso(value);
    }
    return value;
  };

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
              <MenuItem onClick={() => void setSelectedItems(linkedUsers.map(prepareUserToExport))}>
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
            {projectInfoKeys.map((projectKey) => {
              let value = data[projectKey];
              if (projectKey.includes('date') && typeof value === 'string') {
                value = value ? getDateFromIso(value) : '';
              }
              if (projectKey === 'tariff') {
                value = value ? t(`selects.tariff.${value}`) : '';
              }
              return (
                <Input
                  key={projectKey}
                  value={value}
                  label={t(`project.${projectKey}`)}
                  InputProps={{ readOnly: true }}
                  className="project-prop"
                />
              );
            })}
            {customSections
              .filter((section) => customFields.some((customField) =>
                // eslint-disable-next-line no-prototype-builtins
                data?.customFields?.hasOwnProperty(customField._id) && customField.section === section._id))
              .map((section) => (
                <React.Fragment
                  key={section._id}
                >
                  {customFields
                    .filter((customField) => customField.section === section._id)
                    .map((customField) => (
                      <Input
                        key={customField._id}
                        value={prepareCustomFieldValue(data?.customFields?.[customField._id] as string, customField) || ''}
                        label={customField.names[i18n.language]}
                        InputProps={{ readOnly: true }}
                        className="project-prop"
                      />
                    ))}
                </React.Fragment>
              ))}
          </div>
          <ProjectActionsWrapper>
            <Button>
              <EditIcon />{t('project.edit')}
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
