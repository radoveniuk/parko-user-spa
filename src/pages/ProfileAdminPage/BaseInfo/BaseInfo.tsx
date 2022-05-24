import React from 'react';
import { BaseInfoWrapper } from './styles';
import { IUser } from 'interfaces/users.interface';
import { STATUSES } from 'constants/userStatuses';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import Select from 'components/shared/Select';
import { useTranslation } from 'react-i18next';

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
        <Select
          options={translatedStatuses}
          value={data.status}
          label={t('user.status')}
          onChange={({ target }) => void onUpdate({ status: target.value as string })}
        />
      </div>
    </BaseInfoWrapper>
  );
};

export default BaseInfo;
