import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Checkbox from 'v2/uikit/Checkbox';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { BooleanIcon, EditIcon } from 'components/icons';
import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';
import { isMongoId } from 'helpers/regex';
import { IClient } from 'interfaces/client.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import { useProfileRowContext } from './context';
import { LinkWrapper } from './styles';

const InfoRow = () => {
  const { t } = useTranslation();
  const { data, selected, onChangeSelect, cols, startEdit, style } = useProfileRowContext();

  return (
    <ListTableRow error={data.isDeleted} style={style}>
      <ListTableCell>
        <Checkbox checked={selected} onChange={(e) => void onChangeSelect(e.target.checked)} aria-label={`select profile ${data.nickname}`} />
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
          return (
            <ListTableCell key={colName}>
              <span className="column-content">{getDateFromIso(data[userField])}</span>
            </ListTableCell>
          );
        }
        if (userField === 'project') {
          const project = data.project as IProject | undefined;
          const client = project?.client as IClient | undefined;
          return (
            <ListTableCell key={colName}>
              <span className="column-content">{client?.name ? `${client.name} > ` : ''}{project?.name}</span>
            </ListTableCell>
          );
        }
        if (userField === 'status') {
          return (
            <ListTableCell key={colName}>
              <StatusLabel className={`${data.status} column-content`}>{data.status && t(`selects.userStatus.${data.status}`)}</StatusLabel>
            </ListTableCell>
          );
        }
        if (userField === 'salary') {
          return (
            <ListTableCell key={colName}>
              <span className={'column-content'}>{data.salary ? `${Number(data.salary).toFixed(2).toString().replace('.', ',')} €` : ''}</span>
            </ListTableCell>
          );
        }
        if (typeof data[userField] === 'boolean') {
          return (
            <ListTableCell key={colName}>
              <span className="column-content"><BooleanIcon value={data[userField] as boolean} /></span>
            </ListTableCell>
          );
        }
        if (userField === 'sex') {
          return <ListTableCell key={colName}>
            <span className="column-content">{t(data[userField])}</span>
          </ListTableCell>;
        }
        if (userField === 'role') {
          return (
            <ListTableCell key={colName}>
              <span className="column-content">{data[userField] && t(`selects.userRole.${data[userField]}`)}</span>
            </ListTableCell>
          );
        }
        if (userField === 'familyStatus') {
          return (
            <ListTableCell key={colName}>
              <span className="column-content">{data[userField] && t(`selects.familyStatus.${data[userField]}`)}</span>
            </ListTableCell>
          );
        }
        if (userField === 'businessStatus') {
          return (
            <ListTableCell key={colName}>
              <span className="column-content">{data[userField] && t(`selects.corporateBodyStatus.${data[userField]}`)}</span>
            </ListTableCell>
          );
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
        if (/\b(?:idcard.|visa.|permit.|pass.)\b/i.test(userField)) {
          const docType = userField.split('.')[0];
          const docValueKey = userField.split('.')[1];
          const doc = data.docs?.find(doc => doc.type === docType);
          const value = doc?.[docValueKey];

          if (typeof value === 'boolean') {
            return (
              <ListTableCell key={colName}>
                <span className="column-content"><BooleanIcon value={value as boolean} /></span>
              </ListTableCell>
            );
          }

          if (docValueKey === 'goal') {
            return (
              <ListTableCell key={colName}>
                <span className="column-content">{value && t(`selects.permitType.${value}`)}</span>
              </ListTableCell>
            );
          }

          return (
            <ListTableCell key={colName}>
              <span className="column-content">
                {!docValueKey.includes('date') ? value : getDateFromIso(value)}
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

        return (
          <ListTableCell key={colName}>
            <span className="column-content">{data[userField]?.toString()}</span>
          </ListTableCell>
        );
      })}
      <ListTableCell>
        <IconButton
          className="fast-edit-profile"
          onClick={startEdit}
          aria-label="fast edit profile"
        >
          <EditIcon />
        </IconButton>
      </ListTableCell>
    </ListTableRow>
  );
};

export default InfoRow;
