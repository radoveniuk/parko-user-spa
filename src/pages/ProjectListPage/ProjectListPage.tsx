import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { IProject } from 'interfaces/project.interface';
import { STATUSES_COLORS } from 'constants/userStatuses';
import useDebounce from 'hooks/useDebounce';
import { getDateFromIso } from 'helpers/datetime';
import Page, { PageTitle } from 'components/shared/Page';
import { FiltersBar, FiltersProvider, FilterText, useFilters } from 'components/shared/Filters';
import List from 'components/shared/List';
import Button from 'components/shared/Button';
import Input from 'components/shared/Input';
import { DeleteIcon, EditIcon, PlusIcon } from 'components/icons';
import { Tab, TabPanel, Tabs, TabsContainer } from 'components/shared/Tabs';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Dialog from 'components/shared/Dialog';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserList } from 'api/query/userQuery';

import { DialogContentWrapper, ProjectActionsWrapper, ProjectInfoDataWrapper, ProjectInfoWrapper, ProjectsListWrapper } from './styles';
import { useDeleteProjectMutation } from 'api/mutations/projectMutation';

const listFields = {
  primary: 'name',
  secondary: 'email',
};

const usersTableCols = ['user.name', 'user.email', 'user.status'];
const projectInfoKeys: (keyof IProject)[] = ['name', 'email', 'phone', 'comment', 'dateStart', 'dateEnd'];

const ProjectListPageRender = () => {
  const { t } = useTranslation();
  const { filtersState } = useFilters();
  const debouncedFiltersState = useDebounce(filtersState);

  const { data = [], refetch } = useGetProjects(debouncedFiltersState);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const {
    data: linkedUsers,
    refetch: refetchLinkedUsers,
  } = useGetUserList({ project: selectedProject?._id }, { enabled: selectedProject !== null, refetchOnWindowFocus: false });

  const deleteProjectMutation = useDeleteProjectMutation();

  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  const deleteProjectHandler = async () => {
    if (selectedProject) {
      await deleteProjectMutation.mutateAsync(selectedProject._id);
      refetch();
      setSelectedProject(null);
      setIsOpenDeleteDialog(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [debouncedFiltersState, refetch]);

  useEffect(() => {
    if (selectedProject) {
      refetchLinkedUsers();
    }
  }, [selectedProject, refetchLinkedUsers]);

  return (
    <Page title={t('projectList')}>
      <PageTitle>{t('projectList')}</PageTitle>
      <FiltersBar>
        <FilterText filterKey="search" label={t('search')} />
        <Link to="/project" style={{ marginLeft: 'auto' }}>
          <Button color="secondary"><PlusIcon size={20} style={{ marginRight: 5 }} />{t('project.new')}</Button>
        </Link>
      </FiltersBar>
      <ProjectsListWrapper>
        <List
          className="projects-list"
          data={data}
          fields={listFields}
          onSelect={(project) => void setSelectedProject(project)}
        />
        {selectedProject !== null && (
          <ProjectInfoWrapper>
            <TabsContainer key={selectedProject._id}>
              <Tabs>
                <Tab label={t('project.data')} />
                <Tab label={t('project.users')} />
              </Tabs>
              <TabPanel index={0}>
                <ProjectInfoDataWrapper>
                  {projectInfoKeys.map((projectKey) => (
                    <Input
                      key={projectKey}
                      value={!projectKey.includes('date') ? selectedProject[projectKey] : getDateFromIso(selectedProject[projectKey])}
                      label={t(`project.${projectKey}`)}
                      InputProps={{ readOnly: true }}
                      fullWidth
                    />
                  ))}
                  <ProjectActionsWrapper>
                    <Link to={{
                      pathname: '/project',
                      search: `?id=${selectedProject._id}`,
                    }}>
                      <Button color="secondary"><EditIcon style={{ marginRight: 5 }} />{t('project.edit')}</Button>
                    </Link>
                    <Button
                      color="error"
                      onClick={() => void setIsOpenDeleteDialog(true)}
                    >
                      <DeleteIcon style={{ marginRight: 5 }} />
                      {t('project.delete')}
                    </Button>
                    <Dialog title={t('project.delete')} open={isOpenDeleteDialog} onClose={() => void setIsOpenDeleteDialog(false)}>
                      <DialogContentWrapper>
                        <p className="warning-text">
                          {t('project.approveRemoving')} <strong>({selectedProject.name})</strong>
                        </p>
                        <div className="actions"><Button color="error" onClick={deleteProjectHandler}>{t('approve')}</Button></div>
                      </DialogContentWrapper>
                    </Dialog>
                  </ProjectActionsWrapper>
                </ProjectInfoDataWrapper>
              </TabPanel>
              <TabPanel index={1}>
                <ListTable columns={usersTableCols}>
                  {linkedUsers?.map((user) => (
                    <Link key={user._id} to={`/profile/${user._id}`} style={{ display: 'contents', color: '#000' }}>
                      <ListTableRow>
                        <ListTableCell>{`${user.name} ${user.surname}`}</ListTableCell>
                        <ListTableCell>{user.email}</ListTableCell>
                        <ListTableCell style={{ color: STATUSES_COLORS[user.status] }}>{t(`selects.userStatus.${user.status}`)}</ListTableCell>
                      </ListTableRow>
                    </Link>
                  ))}
                </ListTable>
              </TabPanel>
            </TabsContainer>
          </ProjectInfoWrapper>
        )}
      </ProjectsListWrapper>
    </Page>
  );
};

export default function ProjectListPage () {
  return (
    <FiltersProvider>
      <ProjectListPageRender />
    </FiltersProvider>
  );
};
