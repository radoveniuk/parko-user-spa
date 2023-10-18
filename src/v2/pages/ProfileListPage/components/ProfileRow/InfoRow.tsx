import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { BooleanIcon, EditIcon } from 'components/icons';
import Checkbox from 'components/shared/Checkbox';
import IconButton from 'components/shared/IconButton';
import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { STATUSES_COLORS } from 'constants/statuses';
import { getDateFromIso } from 'helpers/datetime';
import { isMongoId } from 'helpers/regex';
import { IUser } from 'interfaces/users.interface';

import { useProfileRowContext } from './context';
import { LinkWrapper } from './styles';

const InfoRow = () => {
  const { t } = useTranslation();
  const { data, selected, onChangeSelect, cols, startEdit } = useProfileRowContext();

  return (
    <ListTableRow>
      <ListTableCell>
        <Checkbox checked={selected} onChange={(e) => void onChangeSelect(e.target.checked)} />
      </ListTableCell>
      <ListTableCell>
        <LinkWrapper>
          <Link to={`/profile/${data._id}`} className="table-link">
            <span className="column-content">{data.name} {data.surname}</span>
          </Link>
        </LinkWrapper>
      </ListTableCell>
      {cols.map((colName) => {
        const userField = colName.replace('user.', '') as keyof IUser;
        if (userField.includes('Date') || userField === 'permitExpire') {
          return <ListTableCell key={colName}>
            <span className="column-content">{getDateFromIso(data[userField])}</span>
          </ListTableCell>;
        }
        if (userField === 'project') {
          return <ListTableCell key={colName}>
            <span className="column-content">{typeof data.project === 'object' && data.project?.name}</span>
          </ListTableCell>;
        }
        if (userField === 'status') {
          return (
            <ListTableCell key={colName} color={STATUSES_COLORS[data.status]}>
              <span className="column-content">{data.status && t(`selects.userStatus.${data.status}`)}</span>
            </ListTableCell>
          );
        }
        if (typeof data[userField] === 'boolean') {
          return <ListTableCell key={colName}>
            <span className="column-content"><BooleanIcon value={data[userField] as boolean} /></span>
          </ListTableCell>;
        }
        if (userField === 'sex') {
          return <ListTableCell key={colName}>
            <span className="column-content">{t(data[userField])}</span>
          </ListTableCell>;
        }
        if (userField === 'role') {
          return <ListTableCell key={colName}>
            <span className="column-content">{t(`selects.userRole.${data[userField]}`)}</span>
          </ListTableCell>;
        }
        if (userField === 'recruiter') {
          return (
            <ListTableCell key={colName}>
              <span className="column-content">
                {typeof data.recruiter === 'object' &&
                  !!data.recruiter &&
                  `${data.recruiter?.name} ${data.recruiter?.surname}`}
              </span>
            </ListTableCell>
          );
        }
        if (isMongoId(colName)) {
          return (
            <ListTableCell key={colName}>
              <span className="column-content">
                {typeof data.customFields?.[colName] === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.customFields?.[colName] as string || '')
                  ? getDateFromIso(data.customFields?.[colName] as string)
                  : data.customFields?.[colName] as string || ''
                }
              </span>
            </ListTableCell>
          );
        }

        return <ListTableCell key={colName}>
          <span className="column-content">{data[userField]?.toString()}</span>
        </ListTableCell>;
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
