import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import ProfileFormDialog from 'v2/components/ProfileFormDialog';
import Chip from 'v2/uikit/Chip';
import IconButton from 'v2/uikit/IconButton';
import { Tab, Tabs } from 'v2/uikit/Tabs';

import { EditIcon, PlusIcon } from 'components/icons';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';
import { IWorkHistoryLog } from 'interfaces/history.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import SexSelectorMenu from './components/SexSelectorMenu';
import { AddTagMenuButton, ProfileCardWrapper } from './styles';

export type ProfileCardProps = {
  data: IUser;
  workHistory: IWorkHistoryLog[];
  onChange?(values: Partial<IUser>): void;
};

const ProfileCard = ({ data, workHistory, onChange }: ProfileCardProps) => {
  const { t } = useTranslation();

  const [isOpenForm, setIsOpenForm] = useState(false);

  const closeForm = () => void setIsOpenForm(false);

  const [user, setUser] = useState(data);
  const recruiter = user.recruiter as IUser | null;

  return (
    <>
      <ProfileCardWrapper>
        <IconButton className="edit-profile-btn" onClick={() => void setIsOpenForm(true)}><EditIcon /></IconButton>
        <div className="tags">
          <Chip label={t(`selects.userRole.${user.role}`)} />
          {user.position && <Chip label={user.position} />}
          {user.cooperationType && <Chip label={user.cooperationType} />}
          {user.tags?.map((tag) => (
            <Chip key={tag} label={t(tag)} />
          ))}
          <AddTagMenuButton disabled><PlusIcon size={20} /></AddTagMenuButton>
        </div>
        <div className="contacts-info section">
          <div className="name-and-sex">
            <div className="name">{user.name} {user.surname}</div>
            <SexSelectorMenu value={user.sex} />
          </div>
          <div className="contacts">
            <a href={`mailto:${user.email}`} className="contact-text-link">{user.email}</a>
            <a href={`tel:${user.phone}`} className="contact-text-link">{user.phone}</a>
          </div>
        </div>
        <div className="common section">
          <div className="common-item">{t('user.birthDate')}: {getDateFromIso(user.birthDate)}</div>
          <div className="common-item">{t('user.country')}: {user.country}</div>
          <div className="common-item">{t('user.adress')}: {user.adress} {user.city} {user.zip}</div>
          <div className="common-item">{t('user.source')}: {user.source} / {recruiter?.name} {recruiter?.surname}</div>
        </div>
        <div className="work-history section">
          <div className="subtitle">{t('user.workHistory')}</div>
          <div className="work-history-list">
            {workHistory
              .sort((workHistoryItemA, workHistoryItemB) =>
                DateTime.fromISO(workHistoryItemB.dateFrom).toMillis() - DateTime.fromISO(workHistoryItemA.dateFrom).toMillis())
              .map((workHistoryItem) => {
                const workHistoryItemProject = workHistoryItem.project as IProject;
                const workHistoryItemClient = workHistoryItemProject.client as IClient;
                return (
                  <div key={workHistoryItem.dateFrom} className="work-history-list-item">
                    {workHistoryItemClient.name}{' > '}
                    {workHistoryItemProject.name}{': '}
                    {getDateFromIso(workHistoryItem.dateFrom)}
                    {workHistoryItem.dateTo ? ` - ${getDateFromIso(workHistoryItem.dateTo)}` : ''}<br /><i>{workHistoryItem.position}</i>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className="system-info section">
          <div className="system-info-item">{t('user.lastUpdate')}: {getDateFromIso(user.updatedAt)}</div>
          <div className="system-info-item">{t('user.createdAt')}: {getDateFromIso(user.createdAt)}</div>
        </div>
        <div className="tabs-wrapper">
          <Tabs orientation="vertical">
            <Tab label={t('profile')} />
            <Tab label={t('user.info')} />
            <Tab label={t('user.cooperation')} />
            <Tab label={t('user.history')} />
          </Tabs>
        </div>
      </ProfileCardWrapper>
      <ProfileFormDialog
        data={{ ...user, recruiter: recruiter || null }}
        title={`${user.name} ${user.surname}`}
        open={isOpenForm}
        onClose={closeForm}
        onSave={(values) => {
          closeForm();
          setUser(prev => ({ ...prev, ...values }));
          onChange?.(values);
        }}
      />
    </>
  );
};

export default memo(ProfileCard);
