import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

import { IUser, UserRole } from 'interfaces/users.interface';
import { STATUSES } from 'constants/userStatuses';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import Select from 'components/shared/Select';
import Button from 'components/shared/Button';
import { useGetProjects } from 'api/query/projectQuery';
import { ROLES } from 'constants/userRoles';
import IconButton from 'components/shared/IconButton';
import { CopyIcon, DeleteIcon } from 'components/icons';
import createId from 'helpers/createId';
import { useDeleteUserMutation } from 'api/mutations/userMutation';
import Dialog from 'components/shared/Dialog';
import { EMPLOYMENT_TYPE } from 'constants/selectsOptions';

import { USER_FIELDS } from './fields';
import { BaseInfoWrapper, DialogContentWrapper } from './styles';

type Props = {
  data: IUser;
  onUpdate(v: Partial<IUser>): void;
};

const BaseInfo = ({ data, onUpdate }: Props) => {
  const { t } = useTranslation();
  const { data: projects = [] } = useGetProjects();
  const translatedStatuses = useTranslatedSelect(STATUSES, 'userStatus');
  const translatedRoles = useTranslatedSelect(ROLES, 'userRole');
  const translatedEmploymentTypes = useTranslatedSelect(EMPLOYMENT_TYPE, 'employmentType', true, false);

  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const deleteUserMutation = useDeleteUserMutation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [resetedPass, setResetedPass] = useState<string | null>(null);

  const resetPass = () => {
    const pass = createId(15);
    setResetedPass(pass);
    onUpdate({ password: pass, email: data.email });
  };

  const deleteUser = () => {
    deleteUserMutation.mutateAsync(data).then(() => {
      enqueueSnackbar(t('user.removedSuccess'), { variant: 'success' });
      setTimeout(() => {
        navigate('/profiles');
      }, 1000);
    });
  };

  return (
    <BaseInfoWrapper>
      <div className="user-card">
        <p className="user-card-title">{t('user.info')}</p>
        {USER_FIELDS.map((field) => {
          const fieldKey = typeof field === 'string' ? field : field.key;
          const value = typeof field === 'string' ? data[fieldKey] : field.get(data[fieldKey]);
          if (typeof value !== 'boolean' && !value) return null;
          return (
            <div className="user-card-field" key={fieldKey}>
              <p>{t(`user.${fieldKey}`)}</p>
              <strong>{t(value?.toString() || '')}</strong>
            </div>
          );
        })}
      </div>
      <div className="user-settings">
        <div className="settings-item">
          <Select
            options={translatedRoles}
            value={data.role}
            label={t('user.role')}
            onChange={({ target }) => void onUpdate({ role: target.value as UserRole })}
          />
        </div>
        <div className="settings-item">
          <Select
            options={translatedStatuses}
            value={data.status}
            label={t('user.status')}
            onChange={({ target }) => void onUpdate({ status: target.value as string })}
          />
        </div>
        <div className="settings-item">
          <Select
            value={projects?.length ? data.project || '' : ''}
            label={t('user.project')}
            options={projects}
            valuePath="_id"
            labelPath="name"
            onChange={({ target }) => void onUpdate({ project: target.value as string })}
          />
        </div>
        <div className="settings-item">
          <Select
            value={data.employmentType || ''}
            label={t('user.employmentType')}
            options={translatedEmploymentTypes}
            onChange={({ target }) => void onUpdate({ employmentType: target.value as string })}
          />
        </div>
        <div className="settings-item">
          <Button onClick={resetPass}>{t('user.resetPassword')}</Button>
        </div>
        {resetedPass !== null && (
          <div className="reseted-pass">
            {resetedPass}
            <IconButton onClick={() => void navigator.clipboard.writeText(resetedPass)}><CopyIcon /></IconButton>
          </div>
        )}
        <div className="settings-item">
          <Button
            color="error"
            onClick={() => void setIsOpenDeleteDialog(true)}
          >
            <DeleteIcon style={{ marginRight: 5 }} />
            {t('project.delete')}
          </Button>
        </div>
        <Dialog title={t('user.delete')} open={isOpenDeleteDialog} onClose={() => void setIsOpenDeleteDialog(false)}>
          <DialogContentWrapper>
            <p className="warning-text">
              {t('user.approveRemoving')} <strong>({data.name} {data.surname})</strong>
            </p>
            <div className="actions"><Button color="error" onClick={deleteUser}>{t('user.approve')}</Button></div>
          </DialogContentWrapper>
        </Dialog>
      </div>
    </BaseInfoWrapper>
  );
};

export default BaseInfo;
