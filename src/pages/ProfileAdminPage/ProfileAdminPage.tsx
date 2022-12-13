import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { isEmpty } from 'lodash-es';

import { useDeleteUserMutation, useUpdateUserMutation } from 'api/mutations/userMutation';
import { useGetDictionary } from 'api/query/dictionariesQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUser } from 'api/query/userQuery';
import Notifications from 'components/complex/Notifications';
import Paychecks from 'components/complex/Paychecks';
import PrintDocDialog from 'components/complex/PrintDocDialog';
import ProfileForm from 'components/complex/ProfileForm';
import ProfileScans from 'components/complex/ProfileScans';
import { DeleteIcon, EditIcon, EmailIcon, NotificationIcon, PasswordIcon, PhoneIcon, PrintIcon, SaveIcon } from 'components/icons';
import Button from 'components/shared/Button';
import DatePicker from 'components/shared/DatePicker';
import Dialog, { DialogActions } from 'components/shared/Dialog';
import IconButton from 'components/shared/IconButton';
import Input from 'components/shared/Input';
import Page from 'components/shared/Page';
import RadioButtonGroup, { RadioButton } from 'components/shared/RadioButtonGroup';
import Select from 'components/shared/Select';
import Stepper from 'components/shared/Stepper';
import { Tab, TabPanel, Tabs, TabsContainer, useTabs } from 'components/shared/Tabs';
import { EMPLOYMENT_TYPE } from 'constants/selectsOptions';
import { ROLES } from 'constants/userRoles';
import { STATUSES } from 'constants/userStatuses';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import useViewportWidth from 'hooks/useViewportWsdth';
import { AnyObject } from 'interfaces/base.types';
import { IClient } from 'interfaces/client.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';
import { SM } from 'theme/sizeBreakpoints';

import Daysoff from './Daysoff';
import Prepayments from './Prepayments';
import ResetPasswordDialog from './ResetPasswordDialog';
import Residences from './Residences';
import SalarySettings from './SalarySettings';
import { DeleteDialogContent, ProfileCard, ProfileDataWrapper, ProfileTabContent } from './styles';

const smBreakpoint = Number(SM.replace('px', ''));

const ProfileAdminPageRender = () => {
  const { t } = useTranslation();
  const { id: userId } = useParams();
  const { data: profileData, refetch } = useGetUser(userId as string);
  const updateUserMutation = useUpdateUserMutation();
  const methods = useForm<IUser>();
  const viewportWidth = useViewportWidth();
  const [activeTab] = useTabs();

  const translatedRoles = useTranslatedSelect(ROLES, 'userRole');
  const translatedEmploymentTypes = useTranslatedSelect(EMPLOYMENT_TYPE, 'employmentType', true, false);
  const translatedStatuses = useTranslatedSelect(STATUSES, 'userStatus');
  const { data: projects = [] } = useGetProjects();

  const { data: cooperationTypeDictionary } = useGetDictionary('PROFILE_COOPERATION_TYPES');
  const { data: profilePositionDictionary } = useGetDictionary('PROFILE_POSITIONS');

  const [openPrintDialog, setOpenPrintDialog] = useState(false);

  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const deleteUserMutation = useDeleteUserMutation();
  const navigate = useNavigate();

  const [openResetPass, setOpenResetPass] = useState(false);

  const updateUser = (values: Partial<IUser>) => {
    if (userId) {
      updateUserMutation.mutateAsync({ ...values, _id: userId, project: values.project || null })
        .then(() => {
          refetch();
          setOpenResetPass(false);
        });
    }
  };

  const deleteUser = () => {
    deleteUserMutation.mutateAsync(profileData as IUser).then(() => {
      setTimeout(() => {
        navigate('/profiles');
      }, 1000);
    });
  };

  const tabContentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (tabContentRef.current !== null) {
      tabContentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab]);

  // stages
  const [openStages, setOpenStages] = useState(false);
  const [stages, setStages] = useState(profileData?.projectStages || null);
  const [projectStages, setProjectStages] = useState((profileData?.project as IProject)?.stages || []);

  const activeStage = useMemo(() => {
    if (!stages) return null;
    const activeKey = Object.keys(stages).find((stageName) => stages[stageName].active);
    return activeKey || null;
  }, [stages]);

  useEffect(() => {
    if (!profileData || !profileData.project) return;
    const project = profileData.project as unknown as IProject;
    if (!project.stages?.length) return;

    setProjectStages(project.stages || []);
    const stagesObject: AnyObject = {};
    project.stages.forEach((stageName) => {
      stagesObject[stageName] = {
        active: false,
        date: '',
        comment: '',
      };
    });

    setStages({
      ...stagesObject,
      ...profileData.projectStages,
    });
  }, [profileData]);

  const onSubmit: SubmitHandler<IUser> = async (values) => {
    const updatedUserData = { ...profileData, ...values };
    if (!updatedUserData.password) {
      delete updatedUserData.password;
    }
    updateUser({ ...updatedUserData, projectStages: stages });
  };

  const profileActions = (
    <div className="profile-actions">
      {[0, 1].includes(activeTab) && (
        <Button
          disabled={!methods.formState.isDirty || !isEmpty(methods.formState.errors)}
          onClick={methods.handleSubmit(onSubmit)}
        >
          <SaveIcon />
          {t('user.updateData')}
        </Button>
      )}
      {activeTab === 0 && (
        <Button variant="outlined" color="error" onClick={() => void setOpenResetPass(true)}>
          <PasswordIcon />
          {t('user.resetPassword')}
        </Button>
      )}
      <Button color="error" onClick={() => void setIsOpenDeleteDialog(true)} className="delete-button">
        <DeleteIcon/>
        {t('project.delete')}
      </Button>
    </div>
  );

  return (
    <Page title={t('user.admin')}>
      <FormProvider {...methods}>
        <ProfileDataWrapper>
          {profileData && (
            <>
              <div>
                <ProfileCard>
                  <div className="card-title">{profileData.name} {profileData.surname}</div>
                  <div className="card-fast-actions">
                    <Link to={{ pathname: '/create-notification' }} state={{ defaultProfileId: profileData._id }}>
                      <Button><NotificationIcon size={20} /></Button>
                    </Link>
                    <a href={`mailto:${profileData.email}`}>
                      <Button><EmailIcon size={20} /></Button>
                    </a>
                    <a href={`tel:${profileData.phone}`}>
                      <Button><PhoneIcon size={20} /></Button>
                    </a>
                    <Button onClick={() => void setOpenPrintDialog(true)}><PrintIcon size={20} /></Button>
                  </div>
                  <div className="role-select">
                    <Select
                      options={translatedRoles}
                      defaultValue={profileData.role || ''}
                      fullWidth
                      label={t('user.role')}
                      {...methods.register('role')}
                    />
                  </div>
                  <div className="profile-contacts">
                    <div>{profileData.phone}</div>
                    <div>{profileData.email}</div>
                  </div>
                  <div className="card-divider" />
                  <Tabs className="tabs-options" orientation="vertical" variant="scrollable" scrollButtons>
                    <Tab label={t('user.baseFields')} />
                    <Tab label={t('user.salary')} />
                    <Tab label={t('user.scancopies')} />
                    <Tab label={t('navbar.paychecks')} />
                    <Tab label={t('navbar.prepayments')} />
                    <Tab label={t('navbar.daysoff')} />
                    <Tab label={t('navbar.notifications')} />
                    <Tab label={t('accommodation.residences')} />
                  </Tabs>
                </ProfileCard>
                {viewportWidth > smBreakpoint && profileActions}
              </div>
              <ProfileTabContent ref={tabContentRef}>
                <TabPanel index={0}>
                  <ProfileForm defaultValues={profileData as unknown as IUser} />
                </TabPanel>
                <TabPanel index={1}>
                  <div className="section-card">
                    <div className="section-title">{t('user.salary')}</div>
                    <SalarySettings data={profileData} />
                  </div>
                </TabPanel>
                <TabPanel index={2}>
                  <div className="section-card">
                    <div className="section-title">{t('user.scancopies')}</div>
                    <ProfileScans id={userId || ''} />
                  </div>
                </TabPanel>
                <TabPanel index={3}>
                  <div className="section-card">
                    <div className="section-title">{t('navbar.paychecks')}</div>
                    <Paychecks filter={{ user: profileData._id }} />
                  </div>
                </TabPanel>
                <TabPanel index={4}>
                  <div className="section-card">
                    <div className="section-title">{t('navbar.prepayments')}</div>
                    <Prepayments />
                  </div>
                </TabPanel>
                <TabPanel index={5}>
                  <div className="section-card">
                    <div className="section-title">{t('navbar.daysoff')}</div>
                    <Daysoff />
                  </div>
                </TabPanel>
                <TabPanel index={6}>
                  <div className="section-card">
                    <div className="section-title">{t('navbar.notifications')}</div>
                    <Notifications options={{ to: userId }} />
                  </div>
                </TabPanel>
                <TabPanel index={7}>
                  <div className="section-card">
                    <div className="section-title">{t('accommodation.residences')}</div>
                    <Residences />
                  </div>
                </TabPanel>
              </ProfileTabContent>
              {viewportWidth <= smBreakpoint && profileActions}
              <ProfileCard>
                <div className="card-title">
                  {!!projects.length && (
                    <>
                      <Select
                        options={projects}
                        defaultValue={(profileData.project as IProject)?._id || ''}
                        label={t('user.project')}
                        valuePath="_id"
                        labelPath={(row) => {
                          const project = row as IProject;
                          const client = project.client as IClient | null;
                          return `${project.name} ${client ? `(${t('project.client')} - ${client.name})` : ''}`;
                        }}
                        {...methods.register('project', {
                          onChange (e) {
                            const project = projects.find((item) => item._id === e.target.value);
                            const stagesObject: AnyObject = {};
                            project?.stages?.forEach((stageName) => {
                              stagesObject[stageName] = {
                                active: false,
                                date: '',
                                comment: '',
                              };
                            });
                            setStages(stagesObject);
                            setProjectStages(project?.stages || []);
                          },
                        })}
                      />
                    </>
                  )}
                </div>
                <div className="card-profile-settings">
                  <Select
                    options={translatedStatuses}
                    defaultValue={profileData.status || ''}
                    label={t('user.status')}
                    {...methods.register('status')}
                  />
                  <Select
                    options={translatedEmploymentTypes}
                    defaultValue={profileData.employmentType || ''}
                    label={t('user.employmentType')}
                    {...methods.register('employmentType')}
                  />
                  <Select
                    options={cooperationTypeDictionary?.options || []}
                    defaultValue={profileData.cooperationType || ''}
                    label={t('user.cooperationType')}
                    {...methods.register('cooperationType')}
                  />
                  <Select
                    options={profilePositionDictionary?.options || []}
                    defaultValue={profileData.position || ''}
                    label={t('user.position')}
                    {...methods.register('position')}
                  />
                  <Controller
                    control={methods.control}
                    name="cooperationStartDate"
                    defaultValue={profileData.cooperationStartDate}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value as string}
                        onChange={field.onChange}
                        label={t('user.cooperationStartDate')}
                      />
                    )}
                  />
                  <Controller
                    control={methods.control}
                    name="cooperationEndDate"
                    defaultValue={profileData.cooperationEndDate}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value as string}
                        onChange={field.onChange}
                        label={t('user.cooperationEndDate')}
                      />
                    )}
                  />
                </div>
                <div className="card-divider" />
                <div className="card-title">
                  {t('project.stages')}<IconButton onClick={() => void setOpenStages(true)}><EditIcon /></IconButton>
                </div>
                <div className="project-stages">
                  <Stepper
                    orientation="vertical"
                    steps={projectStages}
                    activeStep={projectStages.indexOf(activeStage as string)}
                  />
                </div>
              </ProfileCard>
            </>
          )}
        </ProfileDataWrapper>
      </FormProvider>
      {openPrintDialog && profileData !== undefined && (
        <PrintDocDialog users={[profileData]} open={openPrintDialog} onClose={() => void setOpenPrintDialog(false)} />
      )}
      <Dialog title={t('user.delete')} open={isOpenDeleteDialog} onClose={() => void setIsOpenDeleteDialog(false)}>
        <DeleteDialogContent>
          <p className="warning-text">
            {t('user.approveRemoving')} <strong>({profileData?.name} {profileData?.surname})</strong>
          </p>
          <div className="actions"><Button color="error" onClick={deleteUser}>{t('user.approve')}</Button></div>
        </DeleteDialogContent>
      </Dialog>
      <Dialog title={t('project.stages')} open={openStages} onClose={() => void setOpenStages(false)} maxWidth={false}>
        <RadioButtonGroup
          value={activeStage}
          onChange={(e) => {
            setStages((prev) => {
              if (!prev) return prev;
              const stagesObject: AnyObject = {};
              Object.keys(prev).forEach((stageName) => {
                stagesObject[stageName] = {
                  ...prev[stageName],
                  active: e.target.value === stageName,
                };
              });
              return stagesObject;
            });
          }}
        >
          {projectStages.map((stage) => {
            const stageInfo = stages?.[stage] || null;
            const updateStage = (name: string, params: AnyObject) => {
              setStages((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  [name]: {
                    ...prev[name],
                    ...params,
                  },
                };
              });
            };
            return (
              <div key={stage} style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <RadioButton label={stage} value={stage} />
                {stageInfo?.active && (
                  <>
                    <DatePicker
                      label={t('date')}
                      value={stageInfo.date || ''}
                      onChange={(date) => void updateStage(stage, { date })}
                    />
                    <Input
                      label={t('comment')}
                      value={stageInfo.comment || ''}
                      onChange={(e) => void updateStage(stage, { comment: e.target.value })}
                    />
                  </>
                )}
              </div>
            );
          })}
        </RadioButtonGroup>
        <DialogActions>
          <Button onClick={() => { setOpenStages(false); methods.setValue('projectStages', stages, { shouldDirty: true }); }}>OK</Button>
        </DialogActions>
      </Dialog>
      {openResetPass && (
        <ResetPasswordDialog open={openResetPass} onClose={() => void setOpenResetPass(false)} onUpdate={updateUser} />
      )}
    </Page>
  );
};

export default function ProfileAdminPage () {
  return (
    <TabsContainer>
      <ProfileAdminPageRender />
    </TabsContainer>
  );
};
