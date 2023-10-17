import React, { useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash-es';
import { useSnackbar } from 'notistack';

import { useCreateNotificationMutation } from 'api/mutations/notificationMutation';
import { useGetUserListForFilter } from 'api/query/userQuery';
import Editor from 'components/complex/Editor';
import Autocomplete from 'components/shared/Autocomplete';
import Button from 'components/shared/Button';
import Input from 'components/shared/Input';
import Page, { PageTitle } from 'components/shared/Page';
import { useAuthData } from 'contexts/AuthContext';
import { INotification } from 'interfaces/notification.interface';
import { IUser } from 'interfaces/users.interface';

import { NotificationForm } from './styles';

const CreateNotificationPage = () => {
  const { t } = useTranslation();
  const { handleSubmit, control, register, formState: { errors } } = useForm<INotification>();
  const { id } = useAuthData();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const { data: userList = [], isFetching: userListFetching } = useGetUserListForFilter();

  const createNotificationMutation = useCreateNotificationMutation();

  const [users, setUsers] = useState<IUser[]>([]);

  const submitHandler: SubmitHandler<INotification> = async (data) => {
    const notifications: Partial<INotification>[] = users.map((user) => ({
      from: id,
      to: user._id,
      title: data.title,
      message: data.message,
      viewed: false,
      linkedDoc: '',
      entityType: 'mail',
    }));

    await Promise.all(notifications.map((_) => createNotificationMutation.mutateAsync(_)));
    enqueueSnackbar(t('notification.success'), { variant: 'success' });
    setTimeout(() => {
      navigate('/notifications');
    }, 1000);
  };

  const defaultProfile = useMemo(() => {
    const defaultProfileId = (location.state as any)?.defaultProfileId;
    return userList.find((item) => item._id === defaultProfileId);
  }, [location.state, userList]);

  // if (!userList.length) return null;

  return (
    <Page>
      <PageTitle>{t('notification.new')}</PageTitle>
      <NotificationForm>
        <div className="controls">
          <div className="notification-users">
            <Autocomplete
              defaultValue={defaultProfile ? [defaultProfile] : []}
              multiple
              options={userList}
              loading={userListFetching}
              label={t('notification.users')}
              getOptionLabel={(option) => `${option.name} ${option.surname} ${option.project ? `(${option.project.name})` : ''}`}
              style={{ minWidth: 350, maxWidth: 350 }}
              onChange={setUsers}
              disableCloseOnSelect
            />
          </div>
          <Input label={t('notification.title')} className="controls-input" {...register('title', { required: true })} />
          <Button
            className="controls-input"
            onClick={handleSubmit(submitHandler)}
            disabled={!isEmpty(errors) || !users.length}
          >
            {t('notification.send')}
          </Button>
        </div>
      </NotificationForm>
      <Controller
        control={control}
        name="message"
        defaultValue=""
        rules={{
          validate: (value) => {
            const parser = new DOMParser();
            const floatingElement = parser.parseFromString(value, 'text/html');
            return !!floatingElement.body.textContent?.trim();
          },
        }}
        render={({ field }) => (
          <Editor
            onChange={field.onChange}
          />
        )}
      />
    </Page>
  );
};

export default CreateNotificationPage;
