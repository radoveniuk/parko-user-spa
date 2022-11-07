import React, { useMemo } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import _ from 'lodash-es';
import { useSnackbar } from 'notistack';

import { useCreateUserMutation, useUpdateUserMutation } from 'api/mutations/userMutation';
import { useGetUser } from 'api/query/userQuery';
import ProfileForm from 'components/complex/ProfileForm';
import ProfileScans from 'components/complex/ProfileScans';
import Button from 'components/shared/Button';
import Page, { PageTitle } from 'components/shared/Page';
import { Tab, TabPanel, Tabs, TabsContainer } from 'components/shared/Tabs';
import { useAuthData } from 'contexts/AuthContext';
import { IUser } from 'interfaces/users.interface';
import { DEFAULT_PASS } from 'pages/UploadProfilesPage/constants';

import { ProfilePageActions, TabContentWrapper } from './styles';

const ProfilePage = () => {
  const location = useLocation();
  const isEditor = useMemo(() => location.pathname.includes('create'), [location]);
  const { id } = useAuthData();
  const { data, refetch } = useGetUser(id, { enabled: !isEditor });
  const { t } = useTranslation();
  const methods = useForm<IUser>();
  const { enqueueSnackbar } = useSnackbar();
  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IUser> = async (values) => {
    if (isEditor) {
      createUserMutation.mutateAsync({ ...values, role: 'user', password: DEFAULT_PASS })
        .then(() => {
          enqueueSnackbar(t('user.dataUpdated'), { variant: 'success' });
          navigate(-1);
        });
    } else {
      const updatedUserData = { ...data, ...values };
      if (!updatedUserData.password) {
        delete updatedUserData.password;
      }
      updateUserMutation.mutateAsync({ ...updatedUserData })
        .then(() => {
          enqueueSnackbar(t('user.dataUpdated'), { variant: 'success' });
          refetch();
          navigate(-1);
        });
    }
  };

  return (
    <Page title={t('profile')}>
      <PageTitle>{t('profile')}</PageTitle>
      <TabsContainer>
        <Tabs>
          <Tab label={t('user.baseFields')} />
          {!!data && <Tab label={t('user.scancopies')} />}
        </Tabs>
        <TabPanel index={0}>
          {(isEditor || !!data) && (
            <FormProvider {...methods}>
              <ProfileForm defaultValues={!isEditor ? data as unknown as IUser : undefined} />
              <ProfilePageActions>
                <Button
                  onClick={() => {
                    methods.handleSubmit(onSubmit)();
                  }}
                  disabled={!_.isEmpty(methods.formState.errors)}
                >
                  {t('user.updateData')}
                </Button>
              </ProfilePageActions>
            </FormProvider>
          )}
        </TabPanel>
        <TabPanel index={1}>
          <TabContentWrapper>
            <ProfileScans id={id} />
          </TabContentWrapper>
        </TabPanel>
      </TabsContainer>
    </Page>
  );
};

export default ProfilePage;
