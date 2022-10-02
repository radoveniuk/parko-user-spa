import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';

import { useDeleteProjectMutation } from 'api/mutations/projectMutation';
import { useGetCustomFormFields, useGetCustomFormSections } from 'api/query/customFormsQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserList } from 'api/query/userQuery';
import { DeleteIcon, EditIcon, PlusIcon } from 'components/icons';
import Autocomplete from 'components/shared/Autocomplete';
import Button from 'components/shared/Button';
import Dialog from 'components/shared/Dialog';
import { FiltersBar } from 'components/shared/Filters';
import IconButton from 'components/shared/IconButton';
import Input from 'components/shared/Input';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Page, { PageTitle } from 'components/shared/Page';
import { Tab, TabPanel, Tabs, TabsContainer } from 'components/shared/Tabs';
import { STATUSES_COLORS } from 'constants/userStatuses';
import { getDateFromIso } from 'helpers/datetime';
import usePageQueries from 'hooks/usePageQueries';
import { IProject } from 'interfaces/project.interface';

import OnboardModal from './OnboardModal';
import { DialogContentWrapper, ProjectActionsWrapper, ProjectInfoDataWrapper, ProjectInfoWrapper, ProjectsListWrapper } from './styles';

const usersTableCols = ['user.name', 'user.email', 'user.status'];
const projectInfoKeys: (keyof IProject)[] = ['name', 'email', 'phone', 'comment', 'cost', 'tariff', 'dateStart', 'dateEnd'];

const ProjectListPage = () => {
  const { t, i18n } = useTranslation();

  const { data = [], refetch, isFetching } = useGetProjects();
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [openOnboard, setOpenOnboard] = useState(false);

  const { data: customSections = [] } = useGetCustomFormSections({ entity: 'project' });
  const { data: customFields = [] } = useGetCustomFormFields({ entity: 'project' });

  const {
    data: linkedUsers,
    refetch: refetchLinkedUsers,
  } = useGetUserList({ project: selectedProject?._id }, { enabled: selectedProject !== null, refetchOnWindowFocus: false });

  const deleteProjectMutation = useDeleteProjectMutation();

  const navigate = useNavigate();
  const pageQueries = usePageQueries();

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
    if (selectedProject) {
      refetchLinkedUsers();
    }
  }, [selectedProject, refetchLinkedUsers]);

  useEffect(() => {
    if (!pageQueries.id) {
      setSelectedProject(null);
      return;
    }
    const project = data.find((item) => item._id === pageQueries.id) || null;
    setSelectedProject(project);
  }, [data, pageQueries.id]);

  return (
    <Page title={t('projectList')}>
      <PageTitle>{t('projectList')}</PageTitle>
      <FiltersBar>
        <Autocomplete
          options={data}
          value={selectedProject}
          loading={isFetching}
          label={t('search')}
          labelKey="name"
          style={{ minWidth: 350, maxWidth: 350 }}
          onChange={(value: IProject) => {
            navigate({
              search: value ? createSearchParams({ id: value._id }).toString() : '',
            });
          }}
        />
        <Link to="/project" style={{ marginLeft: 'auto' }}>
          <Button><PlusIcon size={20} />{t('project.new')}</Button>
        </Link>
      </FiltersBar>
      <ProjectsListWrapper>
        {selectedProject !== null && (
          <ProjectInfoWrapper>
            <TabsContainer key={selectedProject._id}>
              <Tabs>
                <Tab label={t('project.users')} />
                <Tab label={t('project.data')} />
              </Tabs>
              <TabPanel index={0}>
                <ListTable columns={usersTableCols} className="users-table" stickyHeader>
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
                <IconButton onClick={() => void setOpenOnboard(true)}><PlusIcon size={30}/></IconButton>
                {openOnboard && (
                  <OnboardModal
                    onClose={() => { setOpenOnboard(false); refetchLinkedUsers(); }}
                    open={openOnboard}
                    project={selectedProject._id}
                  />
                )}
              </TabPanel>
              <TabPanel index={1}>
                <ProjectInfoDataWrapper>
                  <div className="project-props">
                    {projectInfoKeys.map((projectKey) => {
                      let value = selectedProject[projectKey];
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
                        selectedProject?.customFields?.[customField._id as string] && customField.section === section._id))
                      .map((section) => (
                        <React.Fragment
                          key={section._id}
                        >
                          {customFields
                            .filter((customField) => customField.section === section._id)
                            .map((customField) => (
                              <Input
                                key={customField._id}
                                value={selectedProject?.customFields?.[customField._id as string] || ''}
                                label={customField.names[i18n.language]}
                                InputProps={{ readOnly: true }}
                                className="project-prop"
                              />
                            ))}
                        </React.Fragment>
                      ))}
                  </div>
                  <ProjectActionsWrapper>
                    <Link to={{
                      pathname: '/project',
                      search: `?id=${selectedProject._id}`,
                    }}>
                      <Button color="secondary"><EditIcon style={{ marginRight: 5 }} />{t('project.edit')}</Button>
                    </Link>
                    <Button
                      color="error"
                      variant="outlined"
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
                        <div className="actions"><Button color="error" onClick={deleteProjectHandler}>{t('project.approve')}</Button></div>
                      </DialogContentWrapper>
                    </Dialog>
                  </ProjectActionsWrapper>
                </ProjectInfoDataWrapper>
              </TabPanel>
            </TabsContainer>
          </ProjectInfoWrapper>
        )}
      </ProjectsListWrapper>
    </Page>
  );
};

export default ProjectListPage;
