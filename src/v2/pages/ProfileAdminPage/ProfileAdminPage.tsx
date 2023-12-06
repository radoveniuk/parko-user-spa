import React from 'react';
import { useParams } from 'react-router-dom';
import Loader, { FullPageLoaderWrapper } from 'v2/uikit/Loader';
import { TabPanel, TabsContainer } from 'v2/uikit/Tabs';

import { useGetDaysoff } from 'api/query/dayoffQuery';
import { useGetPaycheckList } from 'api/query/paycheckQuery';
import { useGetPrepayments } from 'api/query/prepaymentQuery';
import { useGetResidences } from 'api/query/residenceQuery';
import { useGetUser } from 'api/query/userQuery';

import BankDataFormCard from './components/FormCards/BankDataFormCard';
import BusinessInfoFormCard from './components/FormCards/BusinessInfoFormCard';
import DaysOffFormCard from './components/FormCards/DaysOffFormCard';
import EmploymentInfoFormCard from './components/FormCards/EmploymentInfoFormCard';
import FinancesFormCard from './components/FormCards/FinancesFormCard';
import PersonalDocsFormCard from './components/FormCards/PersonalDocsFormCard';
import PrepaymentsFormCard from './components/FormCards/PrepaymentsFormCard';
import ResidencesFormCard from './components/FormCards/ResidencesFormCard';
import ProfileCard from './components/ProfileCard';
import UpdateHistory from './components/UpdateHistory';
import { ContentWrapper, ProfileAdminPageWrapper } from './styles';

const ProfileAdminPage = () => {
  const { id: userId } = useParams();
  const { data: profileData } = useGetUser(userId as string);
  const { data: residences = [] } = useGetResidences({ user: userId });
  const { data: prepayments = [] } = useGetPrepayments({ user: userId });
  const { data: invoices = [] } = useGetPaycheckList({ user: userId });
  const { data: daysoff = [] } = useGetDaysoff({ user: userId });

  if (!profileData) return <FullPageLoaderWrapper><Loader /></FullPageLoaderWrapper>;

  return (
    <TabsContainer>
      <ProfileAdminPageWrapper>
        <ProfileCard user={profileData} workHistory={[]} />
        <ContentWrapper>
          <TabPanel className="cards" index={0}>
            <div className="col">
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
            </div>
          </TabPanel>
          <TabPanel index={3}>
            <UpdateHistory data={profileData.history || []} />
          </TabPanel>
        </ContentWrapper>
      </ProfileAdminPageWrapper>
    </TabsContainer>
  );
};

export default ProfileAdminPage;
