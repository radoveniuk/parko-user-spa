import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { pick } from 'lodash-es';
import isEqual from 'lodash-es/isEqual';
import { DateTime } from 'luxon';
import ProfileFormDialog from 'v2/components/ProfileFormDialog';
import Chip from 'v2/uikit/Chip';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';
import { Tab, Tabs } from 'v2/uikit/Tabs';

import { AcceptIcon, EditIcon, PlusIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import SexSelectorMenu from './components/SexSelectorMenu';
import { AddTagMenuButton, ProfileCardWrapper, TagField, TagFieldWrapper } from './styles';

export interface IWorkHistoryLog {
  _id?: string,
  dateFrom: string;
  dateTo?: string;
  project: Pick<IProject, '_id' | 'name' | 'client'>
  position: string;
};

export type ProfileCardProps = {
  data: IUser;
  workHistory: IWorkHistoryLog[];
  onChange?(values: Partial<IUser>): void;
};

const ProfileCard = ({ data, workHistory, onChange }: ProfileCardProps) => {
  const { permissions } = useAuthData();
  const { t } = useTranslation();

  const [isOpenForm, setIsOpenForm] = useState(false);

  const closeForm = () => void setIsOpenForm(false);

  const [user, setUser] = useState(data);

  const recruiter = user.recruiter as IUser | null;

  const [showNewTagField, setShowNewTagField] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState('');

  const saveTag = () => {
    setShowNewTagField(false);
    setUser((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), newTagLabel],
    }));
    onChange?.({ tags: [...(data.tags || []), newTagLabel] });
    setNewTagLabel('');
  };

  useEffect(() => {
    if (!isEqual(data, user)) {
      setUser(data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const permissionUpdate = permissions.includes('users:update');

  return (
    <>
      <ProfileCardWrapper>
        {permissionUpdate && (
          <IconButton className="edit-profile-btn" disabled={data.isDeleted} onClick={() => void setIsOpenForm(true)}><EditIcon /></IconButton>
        )}
        <div className="tags">
          <Chip label={t(`selects.userRole.${user.role}`)} />
          {user.position && <Chip label={user.position} />}
          {user.cooperationType && <Chip label={user.cooperationType} />}
          {user.tags?.filter(tag => !!tag).map((tag) => (
            <Chip
              key={tag}
              label={t(tag)}
              onDelete={() => {
                setUser((prev) => ({
                  ...prev,
                  tags: prev.tags?.filter(tagToDelete => tagToDelete !== tag),
                }));
                onChange?.({ tags: data.tags?.filter(tagToDelete => tagToDelete !== tag) });
              }}
            />
          ))}
          {!showNewTagField && permissionUpdate && (
            <AddTagMenuButton onClick={() => void setShowNewTagField(true)}><PlusIcon size={20} /></AddTagMenuButton>
          )}
          {showNewTagField && (
            <TagFieldWrapper>
              <TagField onChange={(e) => void setNewTagLabel(e.target.value)} value={newTagLabel} />
              <AddTagMenuButton onClick={saveTag}><AcceptIcon size={20} /></AddTagMenuButton>
            </TagFieldWrapper>
          )}
        </div>
        <div className="contacts-info section">
          <div className="name-and-sex">
            <div className="name">{user.name} {user.surname}</div>
            <SexSelectorMenu
              value={user.sex}
              onChange={(sex) => { onChange?.({ sex }); setUser(prev => ({ ...prev, sex })); }}
              disabled={!permissionUpdate}
            />
          </div>
          <div className="contacts">
            <a href={`mailto:${user.email}`} className="contact-text-link">{user.email}</a>
            <a href={`tel:${user.phone}`} className="contact-text-link">{user.phone}</a>
            <StatusLabel className={user.status}>{t(`selects.userStatus.${user.status}`)}</StatusLabel>
          </div>
        </div>
        <div className="common section">
          <div className="common-item">{t('user.birthDate')}: {getDateFromIso(user.birthDate)}</div>
          <div className="common-item">{t('user.country')}: {user.country}</div>
          <div className="common-item">{t('user.adress')}: {user.adress}</div>
          <div className="common-item">{t('user.source')}: {user.source} / {recruiter?.name} {recruiter?.surname}</div>
          <div className="common-item">{t('user.notes')}: {user.notes}</div>
        </div>
        <div className="work-history section">
          <div className="subtitle">{t('user.workHistory')}</div>
          <div className="work-history-list">
            {workHistory
              .filter((workHistoryItem) => !!workHistoryItem.project?.client)
              .sort((workHistoryItemA, workHistoryItemB) =>
                DateTime.fromISO(workHistoryItemB.dateFrom).toMillis() - DateTime.fromISO(workHistoryItemA.dateFrom).toMillis())
              .map((workHistoryItem) => {
                const workHistoryItemProject = workHistoryItem.project as IProject;
                const workHistoryItemClient = workHistoryItemProject.client as IClient;
                return (
                  <div key={workHistoryItem._id} className="work-history-list-item">
                    {workHistoryItemClient.shortName}{' > '}
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
            <Tab label={t('user.cooperation')} disabled={!permissions.includes('employments:read')} />
            <Tab label={t('order.participations')} disabled={!permissions.includes('orders:read')} />
            <Tab label={t('user.history')} />
          </Tabs>
        </div>
      </ProfileCardWrapper>
      <ProfileFormDialog
        data={pick(
          { ...user, recruiter: recruiter?._id || null },
          ['name', 'surname', 'email', 'birthDate', 'country', 'sex', 'adress',
            'source', 'recruiter', 'phone', 'notes', 'workTypes', 'roles'],
        )}
        title={`${user.fullname}`}
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
