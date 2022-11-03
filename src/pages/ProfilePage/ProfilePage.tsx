import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash-es';
import { useSnackbar } from 'notistack';

import { useCreateUserMutation, useUpdateUserMutation } from 'api/mutations/userMutation';
import { useGetUser } from 'api/query/userQuery';
import ProfileForm from 'components/complex/ProfileForm';
import Button from 'components/shared/Button';
import Page, { PageTitle } from 'components/shared/Page';
import { useAuthData } from 'contexts/AuthContext';
import { IUser2 } from 'interfaces/users.interface';

import { ProfilePageActions } from './styles';

const isEditor = window.location.pathname.includes('create');

const ProfilePage = () => {
  const { id } = useAuthData();
  const { data, refetch } = useGetUser(id, { enabled: !isEditor });
  const { t } = useTranslation();
  const methods = useForm<IUser2>();
  const { enqueueSnackbar } = useSnackbar();
  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IUser2> = async (values) => {
    const updatedUserData = { ...data, ...values };
    if (!updatedUserData.password) {
      delete updatedUserData.password;
    }

    if (isEditor) {
      createUserMutation.mutateAsync({ ...updatedUserData, role: 'user' })
        .then(() => {
          enqueueSnackbar(t('user.dataUpdated'), { variant: 'success' });
          navigate(-1);
        });
    } else {
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
      {(isEditor || !!data) && (
        <FormProvider {...methods}>
          <ProfileForm defaultValues={!isEditor ? data as unknown as IUser2 : undefined} />
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
    </Page>
  );
};

export default ProfilePage;
