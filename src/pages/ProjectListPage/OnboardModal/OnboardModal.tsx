import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Dialog, { DialogProps } from 'components/shared/Dialog';
import { ClearFiLtersButton, FiltersBar, FilterSelect, FiltersProvider, FilterText, useFilters } from 'components/shared/Filters';
import { useGetProjects } from 'api/query/projectQuery';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { STATUSES, STATUSES_COLORS } from 'constants/userStatuses';
import useDebounce from 'hooks/useDebounce';
import { useGetUserList } from 'api/query/userQuery';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { IUser } from 'interfaces/users.interface';
import Chip from 'components/shared/Chip';
import Button from 'components/shared/Button';

import { ModalContentWrapper } from './styles';
import { useUpdateUserMutation } from 'api/mutations/userMutation';

type Props = DialogProps & { project: string };

const OnboardModalRender = ({ onClose, project, ...rest }: Props) => {
  const { t } = useTranslation();
  const { data: projects = [] } = useGetProjects();

  const translatedStatuses = useTranslatedSelect(STATUSES, 'userStatus');

  const { filtersState } = useFilters();
  const debouncedFiltersState = useDebounce(filtersState);
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
          <FilterText filterKey="search" label={t('search')} />
          <FilterSelect filterKey="project" label={t('user.project')} options={projects} valuePath="_id" labelPath="name" />
          <FilterSelect filterKey="status" label={t('user.status')} options={translatedStatuses} />
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
