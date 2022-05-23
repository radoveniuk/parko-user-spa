import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Page, { PageTitle } from 'components/shared/Page';
import { useGetUserList } from 'api/query/userQuery';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';

const columns = [
  'user.name',
  'user.surname',
  'user.email',
  'user.project',
  'user.status',
];

const ProfileListPage = () => {
  const { t } = useTranslation();
  const { data } = useGetUserList({});
  return (
    <Page title={t('profileList.title')}>
      <PageTitle>{t('profileList.title')}</PageTitle>
      <ListTable columns={columns} >
        {data?.map((user) => (
          <Link key={user._id} to={`/profile/${user._id}`} style={{ display: 'contents', color: '#000' }}>
            <ListTableRow>
              <ListTableCell>{user.name}</ListTableCell>
              <ListTableCell>{user.surname}</ListTableCell>
              <ListTableCell>{user.email}</ListTableCell>
              <ListTableCell>{user.project}</ListTableCell>
              <ListTableCell>{user.status}</ListTableCell>
            </ListTableRow>
          </Link>
        ))}
      </ListTable>
    </Page>
  );
};

export default ProfileListPage;
