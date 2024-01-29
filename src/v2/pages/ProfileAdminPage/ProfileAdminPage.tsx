import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'v2/uikit';
import BreadCrumbs from 'v2/uikit/BreadCrumbs';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import Loader, { FullPageLoaderWrapper } from 'v2/uikit/Loader';
import { TabPanel, TabsContainer, useTabs } from 'v2/uikit/Tabs';

import { useCreateDayoffMutation, useDeleteDayoffMutation, useUpdateDayoffMutation } from 'api/mutations/dayoffMutation';
import { useCreateEmployment } from 'api/mutations/employmentMutation';
import { useCreatePaycheckMutation, useDeletePaycheckMutation, useUpdatePaycheckMutation } from 'api/mutations/paycheckMutation';
import { useCreatePayrollMutation, useDeletePayrollMutation, useUpdatePayrollMutation } from 'api/mutations/payrollMutation';
import { useCreatePrepaymentMutation, useDeletePrepaymentMutation, useUpdatePrepaymentMutation } from 'api/mutations/prepaymentMutation';
import { useCreateResidence, useDeleteResidence, useUpdateResidence } from 'api/mutations/residenceMutation';
import { useDeleteUserMutation, useUpdateUserMutation } from 'api/mutations/userMutation';
import { useGetAccommodations } from 'api/query/accommodationQuery';
import { useGetDaysoff } from 'api/query/dayoffQuery';
import { useGetEmployments } from 'api/query/employmentQuery';
import { useGetPaycheckList } from 'api/query/paycheckQuery';
import { useGetPayrollList } from 'api/query/payrollQuery';
import { useGetPrepayments } from 'api/query/prepaymentQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetResidences } from 'api/query/residenceQuery';
import { useGetUser } from 'api/query/userQuery';
import { DeleteIcon, PlusIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { IPaycheck } from 'interfaces/paycheck.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';
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
  const queryClient = useQueryClient();
  const userQueryKey = JSON.stringify({ user: userId });

  const { data: profileData } = useGetUser(userId as string);
  const { data: residences = [] } = useGetResidences({ user: userId });
  const { data: prepayments = [] } = useGetPrepayments({ user: userId });
  const { data: paychecks = [] } = useGetPaycheckList({ user: userId });
  const { data: payrolls = [] } = useGetPayrollList({ user: userId });
  const { data: daysoff = [] } = useGetDaysoff({ user: userId });
  const { data: employments = [], refetch: refetchEmplyments } = useGetEmployments({ user: userId });
  const { data: accommodations = [] } = useGetAccommodations();
  const { data: projects = [] } = useGetProjects();

  const updateUserMutation = useUpdateUserMutation();
  const deleteUserMutation = useDeleteUserMutation();
  const createEmployment = useCreateEmployment();
  const createPaycheck = useCreatePaycheckMutation();
  const createPayroll = useCreatePayrollMutation();
  const updatePaycheck = useUpdatePaycheckMutation();
  const updatePayroll = useUpdatePayrollMutation();
  const deletePaycheck = useDeletePaycheckMutation();
  const deletePayroll = useDeletePayrollMutation();
  const createPrepayment = useCreatePrepaymentMutation();
  const updatePrepayment = useUpdatePrepaymentMutation();
  const deletePrepayment = useDeletePrepaymentMutation();
  const createDayoff = useCreateDayoffMutation();
  const updateDayoff = useUpdateDayoffMutation();
  const deleteDayoff = useDeleteDayoffMutation();
  const createResidence = useCreateResidence();
  const updateResidence = useUpdateResidence();
  const deleteResidence = useDeleteResidence();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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

  const updateUser = (data: Partial<IUser>) => {
    const updatedData = { ...profileData, ...data };
    delete updatedData.password;
    updateUserMutation.mutate({ _id: userId as string, ...updatedData });
    queryClient.setQueryData(['user-data', userId], { ...updatedData });
  };

  const finances = useMemo(() => [
    ...paychecks.map((data) => ({ type: 'paycheck' as const, data })),
    ...payrolls.map((data) => ({ type: 'payroll' as const, data })),
  ], [paychecks, payrolls]);

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
        <Link to="/profiles">{t('profileList')}</Link>
        <Link to={`/profile/${userId}`}>{profileData.name} {profileData.surname}</Link>
        <div>{t(TABS[tab])}</div>
      </BreadCrumbs>
      <div className="content">
        <ProfileCard
          data={profileData}
          workHistory={employments.map((employmentItem) => {
            const project = projects.find(project => project._id === employmentItem.project) as IProject;
            const position = project?.positions?.find((positionItem) => positionItem.matterId === employmentItem.positionId)?.internalName as string;

            return {
              dateFrom: employmentItem.hireDate,
              project: project,
              position: position,
              dateTo: employmentItem.fireDate,
            };
          })}
          onChange={updateUser}
        />
        <ContentWrapper>
          <TabPanel className="cards" index={0}>
            <div className="col">
              <ScansFormCard
                data={profileData}
                onUpdate={updateUser}
              />
              <FinancesFormCard
                data={finances}
                onCreateFinance={({ type, data }) => {
                  const values = {
                    ...data,
                    user: userId,
                    project: (profileData.project as IProject)._id,
                  } as IPaycheck;
                  if (type === 'paycheck') {
                    createPaycheck.mutate(values);
                  }
                  if (type === 'payroll') {
                    createPayroll.mutate(values);
                  }
                }}
                onUpdateFinance={({ type, data }) => {
                  if (type === 'paycheck') {
                    updatePaycheck.mutate(data as IPaycheck);
                  }
                  if (type === 'payroll') {
                    updatePayroll.mutate(data as IPaycheck);
                  }
                }}
                onDeleteFinance={({ type, data }) => {
                  if (type === 'paycheck') {
                    deletePaycheck.mutate(data?._id as string);
                  }
                  if (type === 'payroll') {
                    deletePayroll.mutate(data?._id as string);
                  }
                }}
              />
              <PrepaymentsFormCard
                data={prepayments}
                onCreatePrepayment={(data) => {
                  const prepayment = { ...data, user: userId };
                  createPrepayment.mutateAsync(prepayment).then((res) => {
                    queryClient.setQueryData(['prepayments', userQueryKey], [res, ...prepayments]);
                  });
                }}
                onUpdatePrepayment={(data) => {
                  updatePrepayment.mutate({ ...data, _id: data._id as string });
                  queryClient.setQueryData(
                    ['prepayments', userQueryKey],
                    prepayments.map((item) => item._id === data._id ? data : item),
                  );
                }}
                onDeletePrepayment={deletePrepayment.mutate}
              />
            </div>
            <div className="col">
              <DaysOffFormCard data={daysoff}
                onCreateDayoff={(data) => {
                  const dayoff = { ...data, user: userId };
                  createDayoff.mutateAsync(dayoff).then((res) => {
                    queryClient.setQueryData(['daysoff', userQueryKey], [res, ...daysoff]);
                  });
                }}
                onUpdateDayoff={(data) => {
                  updateDayoff.mutate({ ...data, _id: data._id as string });
                  queryClient.setQueryData(
                    ['daysoff', userQueryKey],
                    daysoff.map((item) => item._id === data._id ? data : item),
                  );
                }}
                onDeleteDayoff={deleteDayoff.mutate}
              />
              <ResidencesFormCard
                data={residences}
                accommodations={accommodations}
                onCreateResidence={(residence, notificate = false) => {
                  const data = { ...residence, user: userId };
                  createResidence.mutateAsync({ data, notificate }).then((res) => {
                    queryClient.setQueryData(['residences', userQueryKey], [res, ...residences]);
                  });
                }}
                onUpdateResidence={(data, notificate = false) => {
                  updateResidence.mutate({ data, notificate });
                  queryClient.setQueryData(
                    ['residences', userQueryKey],
                    residences.map((item) => item._id === data._id ? data : item),
                  );
                }}
                onDeleteResidence={deleteResidence.mutate}
              />
            </div>
          </TabPanel>
          <TabPanel className="cards" index={1}>
            <div className="col">
              <PersonalDocsFormCard data={profileData.docs || []} onUpdateDocs={(docs) => { updateUser({ docs }); }} />
              <BankDataFormCard data={profileData} onUpdate={updateUser} />
            </div>
            <div className="col">
              <EmploymentInfoFormCard data={profileData} onUpdateEmploymentInfo={updateUser} />
              <BusinessInfoFormCard data={profileData} onChange={updateUser} />
              <BusinessActivitiesFormCard
                data={profileData.businessActivities || []}
                onUpdateActivities={(businessActivities) => { updateUser({ businessActivities }); }}
              />
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
          await deleteUserMutation.mutateAsync(userId as string);
          navigate('/profiles');
        }}
      />
    </ProfileAdminPageWrapper>
  );
};

const ProfileAdminPage = () => {
  const { id: userId } = useParams();
  return (
    <TabsContainer key={userId}>
      <ProfileAdminPageRender />
    </TabsContainer>
  );
};

export default ProfileAdminPage;
