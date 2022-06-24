import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { isEmpty } from 'lodash-es';

import { INotification } from 'interfaces/notification.interface';
import Page, { PageTitle } from 'components/shared/Page';
import Editor from 'components/complex/Editor';
import Input from 'components/shared/Input';
import Button from 'components/shared/Button';
import { IUser } from 'interfaces/users.interface';
import { useGetUserList } from 'api/query/userQuery';
import Autocomplete from 'components/shared/Autocomplete';
import { useAuthData } from 'contexts/AuthContext';
import { useCreateNotificationMutation } from 'api/mutations/notificationMutation';

import { NotificationForm } from './styles';

const CreateNotificationPage = () => {
  const { t } = useTranslation();
  const { handleSubmit, control, register, formState: { errors } } = useForm<INotification>();
  const { id } = useAuthData();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { data: userList = [], isFetching: userListFetching } = useGetUserList();

  const createNotificationMutation = useCreateNotificationMutation();

  const [users, setUsers] = useState<IUser[]>([]);

  const submitHandler: SubmitHandler<INotification> = async (data) => {
    const notifications: INotification[] = users.map((user) => ({
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

  return (
    <Page>
      <PageTitle>{t('notification.new')}</PageTitle>
      <NotificationForm>
        <div className="controls">
          <div className="notification-users">
            <Autocomplete
              multiple
              options={userList}
              loading={userListFetching}
              label={t('notification.users')}
              labelKey="email"
              style={{ minWidth: 350, maxWidth: 350 }}
              onChange={setUsers}
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
