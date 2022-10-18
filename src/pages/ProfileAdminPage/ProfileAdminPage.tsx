import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Divider } from '@mui/material';
import { useSnackbar } from 'notistack';

import { useDeleteUserMutation, useUpdateUserMutation } from 'api/mutations/userMutation';
import { useGetUser } from 'api/query/userQuery';
import Notifications from 'components/complex/Notifications';
import Paychecks from 'components/complex/Paychecks';
import PrintDocDialog from 'components/complex/PrintDocDialog';
import { DeleteIcon, EditIcon, PrintIcon, SelectMenuIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Dialog from 'components/shared/Dialog';
import Menu, { MenuItem } from 'components/shared/Menu';
import Page, { PageActions, PageTitle } from 'components/shared/Page';
import { Tab, TabPanel, Tabs, TabsContainer } from 'components/shared/Tabs';
import { IUser } from 'interfaces/users.interface';

import BaseInfo from './BaseInfo';
import Daysoff from './Daysoff';
import Prepayments from './Prepayments';
import Residences from './Residences';
import SalarySettings from './SalarySettings';
import Scans from './Scans';
import { DeleteDialogContent } from './styles';

const ProfileAdminPage = () => {
  const { t } = useTranslation();
  const { id: userId } = useParams();
  const { data: profileData, refetch } = useGetUser(userId || '');
  const { enqueueSnackbar } = useSnackbar();
  const updateUserMutation = useUpdateUserMutation();

  const pageTitle = useMemo(() => profileData ? `${profileData.name} ${profileData.surname}` : t('profile'), [profileData, t]);

  const updateUser = (values: Partial<IUser>) => {
    if (userId) {
      updateUserMutation.mutateAsync({ _id: userId, ...values })
        .then(() => {
          refetch();
          enqueueSnackbar(t('user.dataUpdated'), { variant: 'success' });
        });
    }
  };

  const [openPrintDialog, setOpenPrintDialog] = useState(false);

  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const deleteUserMutation = useDeleteUserMutation();
  const navigate = useNavigate();

  const deleteUser = () => {
    deleteUserMutation.mutateAsync(profileData as IUser).then(() => {
      enqueueSnackbar(t('user.removedSuccess'), { variant: 'success' });
      setTimeout(() => {
        navigate('/profiles');
      }, 1000);
    });
  };

  return (
    <Page title={t('user.admin')}>
      <PageTitle>{pageTitle}</PageTitle>
      <PageActions>
        <Link to={`/profile-editor/${userId}`}>
          <Button><EditIcon size={20}/>{t('user.edit')}</Button>
        </Link>
        <Menu title={<><SelectMenuIcon size={20}/>{t('fastActions')}</>}>
          <MenuItem onClick={() => void setOpenPrintDialog(true)}>
            <PrintIcon size={20} />{t('docsTemplates.print')}
          </MenuItem>
          <Divider />
          <MenuItem color="error" onClick={() => void setIsOpenDeleteDialog(true)}>
            <DeleteIcon />
            {t('project.delete')}
          </MenuItem>
        </Menu>
      </PageActions>
      {profileData && (
        <TabsContainer>
          <Tabs>
            <Tab label={t('user.baseFields')} />
            <Tab label={t('user.salary')} />
            <Tab label={t('user.scancopies')} />
            <Tab label={t('navbar.paychecks')} />
            <Tab label={t('navbar.prepayments')} />
            <Tab label={t('navbar.daysoff')} />
            <Tab label={t('navbar.notifications')} />
            <Tab label={t('accommodation.residences')} />
          </Tabs>
          <TabPanel index={0}>
            <BaseInfo data={profileData} onUpdate={updateUser} />
          </TabPanel>
          <TabPanel index={1}>
            <SalarySettings data={profileData} onUpdate={updateUser} />
          </TabPanel>
          <TabPanel index={2}>
            <Scans data={profileData} onUpdate={updateUser} />
          </TabPanel>
          <TabPanel index={3}>
            <Paychecks filter={{ user: profileData._id }} />
          </TabPanel>
          <TabPanel index={4}>
            <Prepayments />
          </TabPanel>
          <TabPanel index={5}>
            <Daysoff />
          </TabPanel>
          <TabPanel index={6}>
            <Notifications options={{ to: userId }} />
          </TabPanel>
          <TabPanel index={7}>
            <Residences />
          </TabPanel>
        </TabsContainer>
      )}
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

export default ProfileAdminPage;
