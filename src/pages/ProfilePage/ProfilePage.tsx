import React, { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';
import Button from 'v2/uikit/Button';

import { useGetUser } from 'api/query/userQuery';
import ProfileScans from 'components/complex/ProfileScans';
import { PasswordIcon } from 'components/icons';
import { TabPanel, TabsContainer } from 'components/shared/Tabs';
import { useAuthData } from 'contexts/AuthContext';
import { IUser } from 'interfaces/users.interface';

import ResetPasswordDialog from './ResetPasswordDialog';
import { ProfilePageActions, TabContentWrapper } from './styles';

const ProfilePage = () => {
  const location = useLocation();
  const isEditor = useMemo(() => location.pathname.includes('create'), [location]);
  const { id } = useAuthData();
  const { data } = useGetUser(id, { enabled: !isEditor });
  const { t } = useTranslation();
  const methods = useForm<IUser>();
  const [openResetPass, setOpenResetPass] = useState(false);

  useDocumentTitle(t('profile'));

  return (
    <>
      <TabsContainer>
        <TabPanel index={0}>
          {(isEditor || !!data) && (
            <FormProvider {...methods}>
              <ProfilePageActions>
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
