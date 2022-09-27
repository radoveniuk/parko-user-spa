import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash-es';
import { useSnackbar } from 'notistack';

import { useCreateNotificationMutation } from 'api/mutations/notificationMutation';
import Editor from 'components/complex/Editor';
import Button from 'components/shared/Button';
import Chip from 'components/shared/Chip';
import Input from 'components/shared/Input';
import Page, { PageTitle } from 'components/shared/Page';
import Search from 'components/shared/Search';
import { useAuthData } from 'contexts/AuthContext';
import { INotification } from 'interfaces/notification.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import { NotificationForm } from './styles';

const CreateNotificationPage = () => {
  const { t } = useTranslation();
  const { handleSubmit, control, register, formState: { errors } } = useForm<INotification>();
  const { id } = useAuthData();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const createNotificationMutation = useCreateNotificationMutation();

  const [users, setUsers] = useState<IUser[]>([]);

  const addUser = (user: IUser) => {
    setUsers((prev) => {
      if (prev.every((item) => item._id !== user._id)) {
        return [...prev, user];
      }
      return prev;
    });
  };

  const removeUser = (id: string) => {
    setUsers((prev) => prev.filter((item) => item._id !== id));
  };

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

  return (
    <Page>
      <PageTitle>{t('notification.new')}</PageTitle>
      <NotificationForm>
        <div className="controls">
          <Search<IUser>
            url="/users"
            onSelect={(user) => void addUser(user)}
            searchItemComponent={(user) => `${user.name} ${user.surname} ${user.project ? `(${(user.project as IProject).name})` : ''}`}
            placeholder={t('notification.users')}
          />
          {!!users.length && (
            <div className="selected-users">
              {users.map((item) => (
                <Chip
                  key={item._id}
                  label={`${item.name} ${item.surname}`}
                  onDelete={() => void removeUser(item._id)}
                />
              ))}
            </div>
          )}
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
