import React, { useMemo, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import _ from 'lodash-es';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';
import Button from 'v2/uikit/Button';

import { useCreateUserMutation, useUpdateUserMutation } from 'api/mutations/userMutation';
import { useGetUser } from 'api/query/userQuery';
import ProfileForm from 'components/complex/ProfileForm';
import ProfileScans from 'components/complex/ProfileScans';
import { PasswordIcon } from 'components/icons';
import { Tab, TabPanel, Tabs, TabsContainer } from 'components/shared/Tabs';
import { DEFAULT_PASS } from 'constants/user';
import { useAuthData } from 'contexts/AuthContext';
import { IUser } from 'interfaces/users.interface';

import ResetPasswordDialog from './ResetPasswordDialog';
import { ProfilePageActions, TabContentWrapper } from './styles';

const ProfilePage = () => {
  const location = useLocation();
  const isEditor = useMemo(() => location.pathname.includes('create'), [location]);
  const { id } = useAuthData();
  const { data, refetch } = useGetUser(id, { enabled: !isEditor });
  const { t } = useTranslation();
  const methods = useForm<IUser>();
  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const navigate = useNavigate();
  const [openResetPass, setOpenResetPass] = useState(false);

  const onSubmit: SubmitHandler<IUser> = async (values) => {
    if (isEditor) {
      createUserMutation.mutateAsync({ ...values, role: 'user', password: DEFAULT_PASS })
        .then(() => {
          navigate(-1);
        });
    } else {
      const updatedUserData = { ...data, ...values };
      if (!updatedUserData.password) {
        delete updatedUserData.password;
      }
      updateUserMutation.mutateAsync({ ...updatedUserData })
        .then(() => {
          refetch();
          navigate(-1);
        });
    }
  };

  useDocumentTitle(t('profile'));

  return (
    <>
      <TabsContainer>
        <Tabs>
          <Tab label={t('user.baseFields')} />
          {!isEditor && <Tab label={t('user.scancopies')} />}
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
                {!isEditor && (
                  <Button
                    onClick={() => {
                      setOpenResetPass(true);
                    }}
                    color="error"
                    variant="outlined"
                  >
                    <PasswordIcon />
                    {t('user.resetPassword')}
                  </Button>
                )}
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
      {!!data && openResetPass && (
        <ResetPasswordDialog open={openResetPass} onClose={() => void setOpenResetPass(false)} nickname={data.nickname} />
      )}
    </>
  );
};

export default ProfilePage;
