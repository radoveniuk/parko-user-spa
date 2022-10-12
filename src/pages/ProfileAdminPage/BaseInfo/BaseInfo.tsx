import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetProjects } from 'api/query/projectQuery';
import { CopyIcon } from 'components/icons';
import Button from 'components/shared/Button';
import IconButton from 'components/shared/IconButton';
import Select from 'components/shared/Select';
import { EMPLOYMENT_TYPE } from 'constants/selectsOptions';
import { ROLES } from 'constants/userRoles';
import { STATUSES } from 'constants/userStatuses';
import createId from 'helpers/createId';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IUser, UserRole } from 'interfaces/users.interface';

import { USER_FIELDS } from './fields';
import { BaseInfoWrapper } from './styles';

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

  const [resetedPass, setResetedPass] = useState<string | null>(null);

  const resetPass = () => {
    const pass = createId(15);
    setResetedPass(pass);
    onUpdate({ password: pass, email: data.email });
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
          <Button onClick={resetPass} variant="outlined" color="error">{t('user.resetPassword')}</Button>
        </div>
        {resetedPass !== null && (
          <div className="reseted-pass">
            {resetedPass}
            <IconButton onClick={() => void navigator.clipboard.writeText(resetedPass)}><CopyIcon /></IconButton>
          </div>
        )}
      </div>
    </BaseInfoWrapper>
  );
};

export default BaseInfo;
