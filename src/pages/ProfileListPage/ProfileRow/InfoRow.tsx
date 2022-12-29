import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { BooleanIcon, EditIcon } from 'components/icons';
import Checkbox from 'components/shared/Checkbox';
import IconButton from 'components/shared/IconButton';
import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { STATUSES_COLORS } from 'constants/statuses';
import { getDateFromIso } from 'helpers/datetime';
import { IUser } from 'interfaces/users.interface';

import { useProfileRowContext } from './context';

const InfoRow = () => {
  const { t } = useTranslation();
  const { data, selected, onChangeSelect, cols, startEdit } = useProfileRowContext();

  return (
    <ListTableRow>
      <ListTableCell>
        <Checkbox checked={selected} onChange={(e) => void onChangeSelect(e.target.checked)} />
      </ListTableCell>
      <ListTableCell>
        <Link to={`/profile/${data._id}`} className="table-link" >
          {data.name} {data.surname}
        </Link>
      </ListTableCell>
      {cols.map((colName) => {
        const userField = colName.replace('user.', '') as keyof IUser;
        if (userField.includes('Date') || userField === 'permitExpire') {
          return <ListTableCell key={colName}>{getDateFromIso(data[userField])}</ListTableCell>;
        }
        if (userField === 'project') {
          return <ListTableCell key={colName}>{typeof data.project === 'object' && data.project?.name}</ListTableCell>;
        }
        if (userField === 'status') {
          return (
            <ListTableCell key={colName} color={STATUSES_COLORS[data.status]}>
              {data.status && t(`selects.userStatus.${data.status}`)}
            </ListTableCell>
          );
        }
        if (typeof data[userField] === 'boolean') {
          return <ListTableCell key={colName}><BooleanIcon value={data[userField] as boolean} /></ListTableCell>;
        }
        if (userField === 'sex') {
          return <ListTableCell key={colName}>{t(data[userField])}</ListTableCell>;
        }
        if (userField === 'role') {
          return <ListTableCell key={colName}>{t(`selects.userRole.${data[userField]}`)}</ListTableCell>;
        }
        if (userField === 'recruiter') {
          return (
            <ListTableCell key={colName}>
              {typeof data.recruiter === 'object' && !!data.recruiter && `${data.recruiter?.name} ${data.recruiter?.surname}` }
            </ListTableCell>
          );
        }
        return <ListTableCell key={colName}>{data[userField]?.toString()}</ListTableCell>;
      })}
      <ListTableCell>
        <IconButton
          className="fast-edit-profile"
          onClick={startEdit}
        >
          <EditIcon />
        </IconButton>
      </ListTableCell>
    </ListTableRow>
  );
  // : (
  //   <ListTableRow>
  //     <ListTableCell>
  //       <Checkbox checked={selected} onChange={(e) => void onChangeSelect(e.target.checked)} />
  //     </ListTableCell>
  //     <ListTableCell>
  //       <Link to={`/profile/${data._id}`} className="table-link">
  //         {data.name} {data.surname}
  //       </Link>
  //     </ListTableCell>
  //     {cols.map((colName) => {
  //       const userField = colName.replace('user.', '') as keyof IUser;
  //       return <ListTableCell key={colName}>{data[userField]?.toString()}</ListTableCell>;
  //     })}
  //     <ListTableCell>
  //       <IconButton
  //         className="fast-edit-profile active"
  //         onClick={saveEdit}
  //       >
  //         <SaveIcon />
  //       </IconButton>
  //     </ListTableCell>
  //   </ListTableRow>
  // );
};

export default InfoRow;
