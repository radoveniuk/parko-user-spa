import React from 'react';
import { BaseInfoWrapper } from './styles';
import { IUser } from 'interfaces/users.interface';
import { STATUSES } from 'constants/userStatuses';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import Select from 'components/shared/Select';
import { useTranslation } from 'react-i18next';
import Button from 'components/shared/Button';
import { USER_FIELDS } from './fields';

type Props = {
  data: IUser;
  onUpdate(v: Partial<IUser>): void;
};

const BaseInfo = ({ data, onUpdate }: Props) => {
  const { t } = useTranslation();
  const translatedStatuses = useTranslatedSelect(STATUSES, 'userStatus');
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
            options={translatedStatuses}
            value={data.status}
            label={t('user.status')}
            onChange={({ target }) => void onUpdate({ status: target.value as string })}
          />
        </div>
        <div className="settings-item">
          <Select
            value={data.project}
            label={t('user.project')}
            onChange={({ target }) => void onUpdate({ project: target.value as string })}
          />
        </div>
        <div className="settings-item">
          <Button onClick={() => void onUpdate({ password: '1' })}>{t('user.resetPassword')}</Button>
        </div>
      </div>
    </BaseInfoWrapper>
  );
};

export default BaseInfo;