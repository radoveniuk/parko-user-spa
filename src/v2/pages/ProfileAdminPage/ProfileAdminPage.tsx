import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'v2/uikit';
import BreadCrumbs from 'v2/uikit/BreadCrumbs';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import Loader, { FullPageLoaderWrapper } from 'v2/uikit/Loader';
import { TabPanel, TabsContainer, useTabs } from 'v2/uikit/Tabs';

import { useCreateEmployment } from 'api/mutations/employmentMutation';
import { useDeleteUserMutation } from 'api/mutations/userMutation';
import { useGetDaysoff } from 'api/query/dayoffQuery';
import { useGetEmployments } from 'api/query/employmentQuery';
import { useGetPaycheckList } from 'api/query/paycheckQuery';
import { useGetPrepayments } from 'api/query/prepaymentQuery';
import { useGetResidences } from 'api/query/residenceQuery';
import { useGetUser } from 'api/query/userQuery';
import { DeleteIcon, PlusIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { themeConfig } from 'theme';

import Employments from './components/Employments';
import BankDataFormCard from './components/FormCards/BankDataFormCard';
import BusinessActivitiesFormCard from './components/FormCards/BusinessActivitiesFormCard';
import BusinessInfoFormCard from './components/FormCards/BusinessInfoFormCard';
import DaysOffFormCard from './components/FormCards/DaysOffFormCard';
import EmploymentInfoFormCard from './components/FormCards/EmploymentInfoFormCard';
import FinancesFormCard from './components/FormCards/FinancesFormCard';
import PersonalDocsFormCard from './components/FormCards/PersonalDocsFormCard';
import PrepaymentsFormCard from './components/FormCards/PrepaymentsFormCard';
import ResidencesFormCard from './components/FormCards/ResidencesFormCard';
import ScansFormCard from './components/FormCards/ScansFormCard';
import ProfileCard from './components/ProfileCard';
import UpdateHistory from './components/UpdateHistory';
import { ContentWrapper, ProfileAdminPageWrapper } from './styles';

const TABS = ['profile', 'user.info', 'user.cooperation', 'user.history'];

const ProfileAdminPageRender = () => {
  const { role } = useAuthData();
  const { id: userId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab] = useTabs();

  const { data: profileData } = useGetUser(userId as string);
  const deleteUser = useDeleteUserMutation();
  const { data: residences = [] } = useGetResidences({ user: userId });
  const { data: prepayments = [] } = useGetPrepayments({ user: userId });
  const { data: invoices = [] } = useGetPaycheckList({ user: userId });
  const { data: daysoff = [] } = useGetDaysoff({ user: userId });
  const { data: employments = [], refetch: refetchEmplyments } = useGetEmployments({ user: userId });
  const createEmployment = useCreateEmployment();

  const createEmptyEmployment = async () => {
    await createEmployment.mutateAsync({
      user: userId,
      client: null,
      project: null,
      positionId: '',
      hireDate: '',
      fireDate: '',
      fireReason: '',
      comment: '',
      isNonTaxablePart: false,
      isChildTaxBonus: false,
      changes: {},
    });
    refetchEmplyments();
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  if (!profileData) return <FullPageLoaderWrapper><Loader /></FullPageLoaderWrapper>;

  return (
    <ProfileAdminPageWrapper>
      <BreadCrumbs
        actions={(
          <>
            {tab === 2 && (
              <Button onClick={createEmptyEmployment}>
                <PlusIcon />{t('user.addEmployment')}
              </Button>
            )}
            {role === 'admin' && (
              <Button color="error" onClick={() => void setOpenDeleteDialog(true)}>
                <DeleteIcon size={16} color={themeConfig.palette.error.main} />
                {t('delete')}
              </Button>
            )}
          </>
        )}
      >
        <Link to="/profiles">{t('navbar.clients')}</Link>
        <Link to={`/profile/${userId}`}>{profileData.name} {profileData.surname}</Link>
        <div>{t(TABS[tab])}</div>
      </BreadCrumbs>
      <div className="content">
        <ProfileCard data={profileData} workHistory={[]} />
        <ContentWrapper>
          <TabPanel className="cards" index={0}>
            <div className="col">
              <ScansFormCard data={profileData} onUpdate={() => {}} />
              <FinancesFormCard data={invoices.map((data) => ({ type: 'invoice', data }))} />
              <PrepaymentsFormCard data={prepayments} />
            </div>
            <div className="col">
              <DaysOffFormCard data={daysoff} />
              <ResidencesFormCard data={residences} />
            </div>
          </TabPanel>
          <TabPanel className="cards" index={1}>
            <div className="col">
              <PersonalDocsFormCard data={profileData.docs || []} />
              <BankDataFormCard data={profileData} />
            </div>
            <div className="col">
              <EmploymentInfoFormCard data={profileData} />
              <BusinessInfoFormCard data={profileData} />
              <BusinessActivitiesFormCard data={profileData.businessActivities || []} />
            </div>
          </TabPanel>
          <TabPanel className="cards" index={2}>
            <Employments data={employments} />
          </TabPanel>
          <TabPanel index={3}>
            <UpdateHistory data={profileData.history || []} />
          </TabPanel>
        </ContentWrapper>
      </div>
      <DialogConfirm
        open={openDeleteDialog}
        onClose={() => void setOpenDeleteDialog(false)}
        onSubmit={async () => {
          await deleteUser.mutateAsync(userId as string);
          navigate('/profiles');
        }}
      />
    </ProfileAdminPageWrapper>
  );
};

const ProfileAdminPage = () => (
  <TabsContainer>
    <ProfileAdminPageRender />
  </TabsContainer>
);

export default ProfileAdminPage;
