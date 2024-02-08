import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'v2/uikit/Button';
import Chip from 'v2/uikit/Chip';

import { useUpdateUserMutation } from 'api/mutations/userMutation';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserList, useGetUserListForFilter } from 'api/query/userQuery';
import Dialog, { DialogProps } from 'components/shared/Dialog';
import { ClearFiLtersButton, FilterAutocomplete, FiltersBar, FiltersProvider, useFilters } from 'components/shared/Filters';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { STATUSES_COLORS, USER_STATUSES } from 'constants/statuses';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IUser } from 'interfaces/users.interface';

import { ModalContentWrapper } from './styles';

type Props = DialogProps & { project: string };

const OnboardModalRender = ({ onClose, project, ...rest }: Props) => {
  const { t } = useTranslation();
  const { data: projects = [] } = useGetProjects();

  const translatedStatuses = useTranslatedSelect(USER_STATUSES, 'userStatus');

  const { data: usersFilter = [] } = useGetUserListForFilter();
  const { debouncedFiltersState } = useFilters();
  const { data: users, refetch } = useGetUserList(debouncedFiltersState);
  const updateProfile = useUpdateUserMutation();

  const [selectedProfiles, setSelectedProfiles] = useState<IUser[]>([]);

  const selectProfile = (profile: IUser) => {
    setSelectedProfiles((prev) => {
      if (!prev.some((item) => item._id === profile._id)) {
        return [...prev, profile];
      }
      return prev;
    });
  };

  const unSelectProfile = (id: string) => {
    setSelectedProfiles((prev) => prev.filter((item) => item._id !== id));
  };

  const approveSelection = async () => {
    const requests = selectedProfiles.map((item) => updateProfile.mutateAsync({ ...item, project }));
    await Promise.all(requests).then(() => onClose());
  };

  useEffect(() => {
    refetch();
  }, [debouncedFiltersState, refetch]);

  return (
    <Dialog {...rest} onClose={onClose} title={t('project.addProfile')} maxWidth={false}>
      <ModalContentWrapper>
        <FiltersBar>
          <FilterAutocomplete
            multiple
            options={usersFilter}
            getOptionLabel={(user) => `${user.name} ${user.surname}`}
            filterKey="ids"
            label={t('search')}
          />
          <FilterAutocomplete
            multiple
            filterKey="projects"
            label={t('user.project')}
            options={projects}
            labelKey="name"
          />
          <FilterAutocomplete
            multiple
            filterKey="statuses"
            label={t('user.status')}
            options={translatedStatuses}
            labelKey="label"
          />
          <ClearFiLtersButton />
        </FiltersBar>
        <ListTable columns={['user.name', 'user.email', 'user.status', 'user.project']} className="profiles-grid">
          {users?.map((user) => (
            <ListTableRow key={user._id} onClick={() => void selectProfile(user)}>
              <ListTableCell>{`${user.name} ${user.surname}`}</ListTableCell>
              <ListTableCell>{user.email}</ListTableCell>
              <ListTableCell>{user.status && (
                <p
                  style={{ color: STATUSES_COLORS[user.status] }}>
                  {t(`selects.userStatus.${user.status}`)}
                </p>
              )}</ListTableCell>
              <ListTableCell>{typeof user.project === 'object' && user.project?.name}</ListTableCell>
            </ListTableRow>
          ))}
        </ListTable>
        <div className="modal-footer">
          <div className="selected-profiles">
            {selectedProfiles.map((item) => (
              <Chip
                key={item._id}
                label={`${item.name} ${item.surname}`}
                onDelete={() => void unSelectProfile(item._id)}
              />
            ))}
          </div>
          <Button disabled={!selectedProfiles.length} onClick={approveSelection}>{t('project.approve')}</Button>
        </div>
      </ModalContentWrapper>
    </Dialog>
  );
};

export default function OnboardModal (props: Props) {
  return (
    <FiltersProvider disablePageQueries>
      <OnboardModalRender {...props} />
    </FiltersProvider>
  );
};
