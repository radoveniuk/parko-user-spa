import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { pick } from 'lodash-es';
import { DateTime } from 'luxon';
import { usePapaParse } from 'react-papaparse';

import Dialog, { DialogProps } from 'components/shared/Dialog';
import { ClearFiLtersButton, FiltersBar, FilterSelect, FiltersProvider, FilterText, useFilters } from 'components/shared/Filters';
import { useGetProjects } from 'api/query/projectQuery';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { STATUSES, STATUSES_COLORS } from 'constants/userStatuses';
import useDebounce from 'hooks/useDebounce';
import { useGetUserList } from 'api/query/userQuery';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { IUser } from 'interfaces/users.interface';
import Button from 'components/shared/Button';
import Checkbox from 'components/shared/Checkbox';
import { IMPORTABLE_USER_FIELDS } from 'constants/userCsv';

import { ModalContentWrapper } from './styles';

type Props = DialogProps;

const ExportModalRender = ({ onClose, ...rest }: Props) => {
  const { t } = useTranslation();
  const { data: projects = [] } = useGetProjects();

  const translatedStatuses = useTranslatedSelect(STATUSES, 'userStatus');

  const { filtersState } = useFilters();
  const debouncedFiltersState = useDebounce(filtersState);
  const { data: users = [], refetch } = useGetUserList(debouncedFiltersState);

  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const { jsonToCSV } = usePapaParse();

  const selectProfile = (profile: IUser, checked: boolean) => {
    setSelectedProfiles((prev) => {
      if (checked) {
        return [...prev, profile._id];
      }
      return prev.filter((item) => item !== profile._id);
    });
  };

  const exportData = () => {
    const dataToExport = users
      .filter((item) => selectedProfiles.includes(item._id))
      .map((item) => {
        const pickedItem = pick(item, IMPORTABLE_USER_FIELDS) as Record<keyof IUser, string | boolean>;
        const exportItem: Record<string, string | boolean> = {};
        IMPORTABLE_USER_FIELDS.forEach((key) => {
          exportItem[t(`user.${key}`)] = pickedItem[key] || '';
        });
        return exportItem;
      });

    const csvContent = `data:text/csv;charset=utf-8,${jsonToCSV(dataToExport)}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Parko_Users_Export_${DateTime.now().toFormat('dd.MM.yyyy')}.csv`);
    document.body.appendChild(link);
    link.click();
    onClose();
  };

  useEffect(() => {
    refetch();
  }, [debouncedFiltersState, refetch]);

  return (
    <Dialog {...rest} onClose={onClose} title={t('user.export')} maxWidth={false}>
      <ModalContentWrapper>
        <FiltersBar>
          <FilterText filterKey="search" label={t('search')} />
          <FilterSelect filterKey="project" label={t('user.project')} options={projects} valuePath="_id" labelPath="name" />
          <FilterSelect filterKey="status" label={t('user.status')} options={translatedStatuses} />
          <ClearFiLtersButton />
        </FiltersBar>
        <ListTable columns={['user.name', 'user.email', 'user.status', 'user.project']} className="profiles-grid">
          {users?.map((user) => (
            <ListTableRow key={user._id}>
              <ListTableCell>
                <Checkbox
                  checked={selectedProfiles.includes(user._id)}
                  title={`${user.name} ${user.surname}`}
                  onChange={(e) => void selectProfile(user, e.target.checked)}
                />
              </ListTableCell>
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
          <Button disabled={!selectedProfiles.length} onClick={exportData}>{t('project.approve')}</Button>
        </div>
      </ModalContentWrapper>
    </Dialog>
  );
};

export default function ExportModal (props: Props) {
  return (
    <FiltersProvider disablePageQueries>
      <ExportModalRender {...props} />
    </FiltersProvider>
  );
};
