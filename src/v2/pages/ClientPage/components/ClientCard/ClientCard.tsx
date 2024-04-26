import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import ClientFormDialog from 'v2/components/ClientFormDialog';
import useCopyToClipboard from 'v2/hooks/useCopyToClipboard';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';
import { Tab, Tabs } from 'v2/uikit/Tabs';

import { useUpdateClientMutation } from 'api/mutations/clientMutation';
import { CopyIcon, EditIcon, EmailIcon, PhoneIcon, WebIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';
import { IUser } from 'interfaces/users.interface';

import { TABS } from '../../constants/tabs';

import { ProfileCardWrapper } from './styles';

type ClientCardCommonItemProps = {
  label: string;
  value: string;
};

const ClientCardCommonItem = ({ value, label }: ClientCardCommonItemProps) => {
  const copy = useCopyToClipboard();
  return (
    <div className="info-item copyable" onClick={() => void copy(value)}>
      <div className="name">{label}: </div>
      <span className="value">{value}<CopyIcon /></span>
    </div>
  );
};

export type ClientCardProps = {
  data: IClient;
  onChange?(values: Partial<IClient>): void;
};

const ClientCard = ({ data, onChange }: ClientCardProps) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

  const [isOpenForm, setIsOpenForm] = useState(false);

  const closeForm = () => void setIsOpenForm(false);

  const [client, setClient] = useState(data);
  const managers = client.managers as IUser[] | null;

  const updateClientMutation = useUpdateClientMutation();

  const queryClient = useQueryClient();

  const renderManagers = () => managers
    ?.map((item) => {
      if (typeof item === 'string') {
        const managerUsers = queryClient.getQueryData(['users', JSON.stringify({ permissions: 'users:update' })]) as IUser[];
        const manager = managerUsers.find((user) => user._id === item);
        return `${manager?.name} ${manager?.surname}`;
      }
      return `${item.name} ${item.surname}`;
    })
    .join(' / ');

  return (
    <>
      <ProfileCardWrapper>
        {permissions.includes('clients:update') && (
          <IconButton className="edit-profile-btn" onClick={() => void setIsOpenForm(true)}><EditIcon /></IconButton>
        )}
        <div className="contacts-info section">
          <div className="name">{client.shortName}</div>
          <div className="contacts">
            {!!client.email && <a href={`mailto:${client.email}`} className="contact-text-link"><EmailIcon /> {client.email}</a>}
            {!!client.phone && <a href={`tel:${client.phone}`} className="contact-text-link"><PhoneIcon /> {client.phone}</a>}
            {!!client.websiteUrl && <a href={client.websiteUrl} className="contact-text-link"><WebIcon /> {client.websiteUrl}</a>}
            {!!client.status && <StatusLabel className={client.status}>{t(`selects.clientStatus.${client.status}`)}</StatusLabel>}
          </div>
        </div>
        <div className="financial section">
          <ClientCardCommonItem label="IČO" value={client.ICO} />
          <ClientCardCommonItem label="DIČ" value={client.DIC} />
          <ClientCardCommonItem label="IČ DPH" value={client.ICDPH} />
        </div>
        <div className="common section">
          <div className="info-item"><div className="name">{t('client.company')}:</div> {client.name}</div>
          <div className="info-item"><div className="name">{t('client.sidlo')}:</div> {client.sidlo}</div>
          <div className="info-item"><div className="name">{t('client.contactPerson')}:</div> {client.contactPerson}</div>
          <div className="info-item"><div className="name">{t('client.contactPersonPosition')}:</div> {client.contactPersonPosition}</div>
          <div className="info-item"><div className="name">
            {t('client.cooperationStartDate')}:</div> {getDateFromIso(client.cooperationStartDate)}
          </div>
          <div className="info-item"><div className="name">{t('client.cooperationEndDate')}:</div> {getDateFromIso(client.cooperationEndDate)}</div>
          <div className="info-item"><div className="name">{t('client.managers')}:</div> {renderManagers()}</div>
          <div className="info-item"><div className="name">{t('client.shortName')}:</div> {client.shortName}</div>
          <div className="info-item"><div className="name">{t('client.comment')}:</div> {client.comment}</div>
        </div>
        <div className="system-info section">
          <div className="system-info-item">{t('user.lastUpdate')}: {getDateFromIso(client.updatedAt)}</div>
          <div className="system-info-item">{t('user.createdAt')}: {getDateFromIso(client.createdAt)}</div>
        </div>
        <div className="tabs-wrapper">
          <Tabs orientation="vertical">
            {TABS.map((item) => <Tab key={item} label={t(`client.${item}`)} />)}
          </Tabs>
        </div>
      </ProfileCardWrapper>
      <ClientFormDialog
        data={client}
        title={client.shortName}
        open={isOpenForm}
        onClose={closeForm}
        onSave={(values) => {
          closeForm();
          const allManagers = (queryClient.getQueryData(['users', JSON.stringify({ permissions: 'users:update' })]) || []) as IUser[];

          setClient((prev) => ({ ...prev, ...values, managers: allManagers?.filter((item) => (values.managers as string[])?.includes(item._id)) }));
          onChange?.(values);
          updateClientMutation.mutate({ ...client, ...values });
        }}
      />
    </>
  );
};

export default memo(ClientCard);
