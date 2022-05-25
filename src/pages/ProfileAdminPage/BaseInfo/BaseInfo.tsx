import React from 'react';
import { BaseInfoWrapper } from './styles';
import { IUser } from 'interfaces/users.interface';
import { STATUSES } from 'constants/userStatuses';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import Select from 'components/shared/Select';
import { useTranslation } from 'react-i18next';
import Button from 'components/shared/Button';

type Props = {
  data: IUser;
  onUpdate(v: Partial<IUser>): void;
};

const BaseInfo = ({ data, onUpdate }: Props) => {
  const { t } = useTranslation();
  const translatedStatuses = useTranslatedSelect(STATUSES);
  return (
    <BaseInfoWrapper>
      <div className="user-card">
        <strong>{data.email}</strong>
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
