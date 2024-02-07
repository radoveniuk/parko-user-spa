import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import ClientFormDialog from 'v2/components/ClientFormDialog';
import IconButton from 'v2/uikit/IconButton';
import { Tab, Tabs } from 'v2/uikit/Tabs';

import { useUpdateClientMutation } from 'api/mutations/clientMutation';
import { EditIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';
import { IUser } from 'interfaces/users.interface';

import { ProfileCardWrapper } from './styles';

export type ClientCardProps = {
  data: IClient;
  onChange?(values: Partial<IClient>): void;
};

const ClientCard = ({ data, onChange }: ClientCardProps) => {
  const { t } = useTranslation();
  const { role } = useAuthData();

  const [isOpenForm, setIsOpenForm] = useState(false);

  const closeForm = () => void setIsOpenForm(false);

  const [client, setClient] = useState(data);
  const managers = client.managers as IUser[] | null;

  const updateClientMutation = useUpdateClientMutation();

  const queryClient = useQueryClient();

  const renderManagers = () => managers
    ?.map((item) => {
      if (typeof item === 'string') {
        const managerUsers = queryClient.getQueryData(['users', JSON.stringify({ roles: 'recruiter,admin' })]) as IUser[];
        const manager = managerUsers.find((user) => user._id === item);
        return `${manager?.name} ${manager?.surname}`;
      }
      return `${item.name} ${item.surname}`;
    })
    .join(' / ');

  return (
    <>
      <ProfileCardWrapper>
        {role === 'admin' && <IconButton className="edit-profile-btn" onClick={() => void setIsOpenForm(true)}><EditIcon /></IconButton>}
        <div className="contacts-info section">
          <div className="name">{client.name}</div>
          <div className="contacts">
            <a href={`mailto:${client.email}`} className="contact-text-link">{client.email}</a>
            <a href={`tel:${client.phone}`} className="contact-text-link">{client.phone}</a>
            <a href={client.websiteUrl} className="contact-text-link">{client.websiteUrl}</a>
          </div>
        </div>
        <div className="common section">
          {!!client.status && <div className="common-item">{t('client.status')}: {t(`selects.clientStatus.${client.status}`)}</div>}
          <div className="common-item">IČO: {client.ICO}</div>
          <div className="common-item">DIČ: {client.DIC}</div>
          <div className="common-item">IČ DPH: {client.ICDPH}</div>
          <div className="common-item">Sídlo: {client.sidlo}</div>
          <div className="common-item">{t('client.contactPerson')}: {client.contactPerson}</div>
          <div className="common-item">{t('client.contactPersonPosition')}: {client.contactPersonPosition}</div>
          <div className="common-item">{t('client.cooperationStartDate')}: {getDateFromIso(client.cooperationStartDate)}</div>
          <div className="common-item">{t('client.cooperationEndDate')}: {getDateFromIso(client.cooperationEndDate)}</div>
          <div className="common-item">{t('client.managers')}: {renderManagers()}</div>
        </div>
        <div className="system-info section">
          <div className="system-info-item">{t('user.lastUpdate')}: {getDateFromIso(client.updatedAt)}</div>
          <div className="system-info-item">{t('user.createdAt')}: {getDateFromIso(client.createdAt)}</div>
        </div>
        <div className="tabs-wrapper">
          <Tabs orientation="vertical">
            <Tab label={t('client.projects')} />
            <Tab label={t('client.profiles')} />
          </Tabs>
        </div>
      </ProfileCardWrapper>
      <ClientFormDialog
        data={client}
        title={client.name}
        open={isOpenForm}
        onClose={closeForm}
        onSave={(values) => {
          closeForm();
          const allManagers = (queryClient.getQueryData(['users', JSON.stringify({ roles: 'recruiter,admin' })]) || []) as IUser[];

          setClient((prev) => ({ ...prev, ...values, managers: allManagers?.filter((item) => (values.managers as string[])?.includes(item._id)) }));
          onChange?.(values);
          updateClientMutation.mutate({ ...client, ...values });
        }}
      />
    </>
  );
};

export default memo(ClientCard);
