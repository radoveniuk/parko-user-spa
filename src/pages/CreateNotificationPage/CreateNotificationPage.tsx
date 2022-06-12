/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { INotification } from 'interfaces/notification.interface';
import { useTranslation } from 'react-i18next';

import Page, { PageTitle } from 'components/shared/Page';
import Editor from 'components/complex/Editor';
import Input from 'components/shared/Input';
import Button from 'components/shared/Button';
import IconButton from 'components/shared/IconButton';
import { PlusIcon } from 'components/icons';
import Chip from 'components/shared/Chip';
import { IUser } from 'interfaces/users.interface';

import { NotificationForm } from './styles';

const CreateNotificationPage = () => {
  const { t } = useTranslation();
  const { handleSubmit, watch, control, register, formState: { errors } } = useForm<INotification>();

  const [users, setUsers] = useState<IUser[]>([]);
  const [openUsersDialog, setOpenUsersDialog] = useState(false);

  return (
    <Page>
      <PageTitle>{t('notification.new')}</PageTitle>
      <NotificationForm>
        <div className="controls">
          <div className="notification-users">
            {!users.length && <>{t('notification.addUser')}</>}
            {!!users.length && users.map((_) => <Chip key={_._id} label={`${_.name} ${_.surname}`} onDelete={() => {}} />)}
            <IconButton onClick={() => void setOpenUsersDialog(true)}><PlusIcon size={30}/></IconButton>
          </div>
          <Input label={t('notification.title')} className="controls-input" {...register('title', { required: true })} />
          <Button className="controls-input">{t('notification.send')}</Button>
        </div>
      </NotificationForm>
      <Controller
        control={control}
        name="message"
        defaultValue=""
        rules={{ required: true }}
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
