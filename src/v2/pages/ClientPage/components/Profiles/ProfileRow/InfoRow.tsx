import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import StatusLabel from 'v2/uikit/StatusLabel';

import { BooleanIcon } from 'components/icons';
import Checkbox from 'components/shared/Checkbox';
import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';
import { isMongoId } from 'helpers/regex';
import { IUser } from 'interfaces/users.interface';

import { useProfileRowContext } from './context';
import { LinkWrapper } from './styles';

const InfoRow = () => {
  const { t } = useTranslation();
  const { data, selected, onChangeSelect, cols } = useProfileRowContext();

  return (
    <ListTableRow error={data.isDeleted}>
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
            <ListTableCell key={colName}>
              <StatusLabel className={`${data.status} column-content`}>{data.status && t(`selects.userStatus.${data.status}`)}</StatusLabel>
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
      </ListTableCell>
    </ListTableRow>
  );
};

export default InfoRow;
