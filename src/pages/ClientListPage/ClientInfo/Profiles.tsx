import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useGetUserListByClient } from 'api/query/userQuery';
import Checkbox from 'components/shared/Checkbox';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { STATUSES_COLORS } from 'constants/userStatuses';
import { getDateFromIso } from 'helpers/datetime';
import usePageQueries from 'hooks/usePageQueries';
import { IUser } from 'interfaces/users.interface';

const COLS = ['', 'user.name', 'user.employmentType', 'user.position', 'user.cooperationStartDate', 'user.cooperationEndDate', 'user.status'];

export default function Profiles () {
  const { t } = useTranslation();
  const pageQueries = usePageQueries();
  const [selectedItems, setSelectedItems] = useState<IUser[]>([]);

  const { data: profiles = [] } = useGetUserListByClient(pageQueries.id);

  const prepareUserToExport = (user: IUser): IUser => ({
    ...user,
    cooperationStartDate: getDateFromIso(user.cooperationStartDate),
    cooperationEndDate: getDateFromIso(user.cooperationEndDate),
    status: t(`selects.userStatus.${user.status}`),
    employmentType: t(`selects.employmentType.${user.employmentType}`),
  });

  return (
    <ListTable columns={COLS} className="users-table">
      {profiles.map((user) => (
        <ListTableRow key={user._id}>
          <ListTableCell>
            <Checkbox
              checked={selectedItems.some((item) => item._id === user._id)}
              onChange={(e) => {
                const { checked } = e.target;
                setSelectedItems((prev) => {
                  if (checked) {
                    return [...prev, prepareUserToExport(user)];
                  }
                  return prev.filter((item) => item._id !== user._id);
                });
              }}
            />
          </ListTableCell>
          <ListTableCell>
            <Link to={`/profile/${user._id}`} className="table-link" >
              {user.name} {user.surname}
            </Link>
          </ListTableCell>
          <ListTableCell>{!!user.employmentType && t(`selects.employmentType.${user.employmentType}`)}</ListTableCell>
          <ListTableCell>{user.position}</ListTableCell>
          <ListTableCell>{getDateFromIso(user.cooperationStartDate)}</ListTableCell>
          <ListTableCell>{getDateFromIso(user.cooperationEndDate)}</ListTableCell>
          <ListTableCell color={STATUSES_COLORS[user.status]}>{t(`selects.userStatus.${user.status}`)}</ListTableCell>
        </ListTableRow>
      ))}
    </ListTable>
  );
};
