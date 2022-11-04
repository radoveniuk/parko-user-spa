import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { isEmpty } from 'lodash-es';
import { useSnackbar } from 'notistack';

import { useDeleteUserMutation, useUpdateUserMutation } from 'api/mutations/userMutation';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUser } from 'api/query/userQuery';
import Notifications from 'components/complex/Notifications';
import Paychecks from 'components/complex/Paychecks';
import PrintDocDialog from 'components/complex/PrintDocDialog';
import ProfileForm from 'components/complex/ProfileForm';
import { DeleteIcon, EmailIcon, NotificationIcon, PhoneIcon, PrintIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Dialog from 'components/shared/Dialog';
import Page from 'components/shared/Page';
import Select from 'components/shared/Select';
import { Tab, TabPanel, Tabs, TabsContainer, useTabs } from 'components/shared/Tabs';
import { EMPLOYMENT_TYPE } from 'constants/selectsOptions';
import { ROLES } from 'constants/userRoles';
import { STATUSES } from 'constants/userStatuses';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import useViewportWidth from 'hooks/useViewportWsdth';
import { IUser } from 'interfaces/users.interface';
import { SM } from 'theme/sizeBreakpoints';

import Daysoff from './Daysoff';
import Prepayments from './Prepayments';
import Residences from './Residences';
import SalarySettings from './SalarySettings';
import Scans from './Scans';
import { DeleteDialogContent, ProfileCard, ProfileDataWrapper, ProfileTabContent } from './styles';

const smBreakpoint = Number(SM.replace('px', ''));

const ProfileAdminPageRender = () => {
  const { t } = useTranslation();
  const { id: userId } = useParams();
  const { data: profileData, refetch } = useGetUser(userId as string);
  const { enqueueSnackbar } = useSnackbar();
  const updateUserMutation = useUpdateUserMutation();
  const methods = useForm<IUser>();
  const viewportWidth = useViewportWidth();
  const [activeTab] = useTabs();

  const translatedRoles = useTranslatedSelect(ROLES, 'userRole');
  const translatedEmploymentTypes = useTranslatedSelect(EMPLOYMENT_TYPE, 'employmentType', true, false);
  const translatedStatuses = useTranslatedSelect(STATUSES, 'userStatus');
  const { data: projects = [] } = useGetProjects();

  const [openPrintDialog, setOpenPrintDialog] = useState(false);

  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const deleteUserMutation = useDeleteUserMutation();
  const navigate = useNavigate();

  const updateUser = (values: Partial<IUser>) => {
    if (userId) {
      updateUserMutation.mutateAsync({ ...values, _id: userId, project: values.project || null })
        .then(() => {
          refetch();
          enqueueSnackbar(t('user.dataUpdated'), { variant: 'success' });
        });
    }
  };

  const onSubmit: SubmitHandler<IUser> = async (values) => {
    const updatedUserData = { ...profileData, ...values };
    if (!updatedUserData.password) {
      delete updatedUserData.password;
    }
    updateUser(updatedUserData);
  };

  const deleteUser = () => {
    deleteUserMutation.mutateAsync(profileData as IUser).then(() => {
      enqueueSnackbar(t('user.removedSuccess'), { variant: 'success' });
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

  const profileActions = (
    <div className="profile-actions">
      {[0, 1].includes(activeTab) && (
        <Button
          disabled={!methods.formState.isDirty || !isEmpty(methods.formState.errors)}
          onClick={methods.handleSubmit(onSubmit)}
        >
          {t('user.updateData')}
        </Button>
      )}
      {activeTab === 0 && (
        <Button variant="outlined">
          {t('user.password')}
        </Button>
      )}
      <Button variant="outlined" color="error" onClick={() => void setIsOpenDeleteDialog(true)} className="delete-button">
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
                  <div className="card-profile-settings">
                    <Select
                      options={translatedRoles}
                      defaultValue={profileData.role || ''}
                      label={t('user.role')}
                      {...methods.register('role')}
                    />
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
                    {!!projects.length && (
                      <Select
                        options={projects}
                        defaultValue={projects?.length ? profileData.project || '' : ''}
                        label={t('user.project')}
                        valuePath="_id"
                        labelPath="name"
                        {...methods.register('project')}
                      />
                    )}
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
                    <Scans data={profileData} onUpdate={updateUser} />
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
            </>
          )}
        </ProfileDataWrapper>
      </FormProvider>
      {openPrintDialog && profileData !== undefined && (
        <PrintDocDialog ids={[profileData._id]} open={openPrintDialog} onClose={() => void setOpenPrintDialog(false)} />
      )}
      <Dialog title={t('user.delete')} open={isOpenDeleteDialog} onClose={() => void setIsOpenDeleteDialog(false)}>
        <DeleteDialogContent>
          <p className="warning-text">
            {t('user.approveRemoving')} <strong>({profileData?.name} {profileData?.surname})</strong>
          </p>
          <div className="actions"><Button color="error" onClick={deleteUser}>{t('user.approve')}</Button></div>
        </DeleteDialogContent>
      </Dialog>
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
