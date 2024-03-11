import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Checkbox from 'v2/uikit/Checkbox';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { EditIcon } from 'components/icons';
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
      <ListTableCell title={`${data.name} ${data.surname}`}>
        <LinkWrapper>
          <Link to={`/profile/${data._id}`} className="table-link">
            <span className="column-content">{data.name} {data.surname}</span>
          </Link>
        </LinkWrapper>
      </ListTableCell>
      {cols.map((colName) => {
        const userField = colName.replace('user.', '');

        const createTableCell = (content: string | ReactNode, title?: string) => (
          <ListTableCell key={colName} title={title || content as string}>
            <span className="column-content">{content}</span>
          </ListTableCell>
        );

        if (userField.includes('Date') || userField === 'permitExpire') {
          return createTableCell(getDateFromIso(data[userField as keyof IUser]));
        }
        if (userField === 'client') {
          const project = data.project as IProject | undefined;
          const client = project?.client as IClient | undefined;
          return createTableCell(client?.name);
        }
        if (userField === 'project') {
          const project = data.project as IProject | undefined;
          return createTableCell(project?.name);
        }
        if (userField === 'status') {
          return createTableCell(data.status ? <StatusLabel className={data.status}>{t(`selects.userStatus.${data.status}`)}</StatusLabel> : '',
            t(`selects.userStatus.${data.status}`));
        }
        if (userField === 'salary') {
          return createTableCell(data.salary ? `${Number(data.salary).toFixed(2).toString().replace('.', ',')} €` : '');
        }
        if (typeof data[userField as keyof IUser] === 'boolean' || userField === 'sex') {
          return createTableCell(t(data[userField as keyof IUser]));
        }
        if (userField === 'role') {
          return createTableCell(data[userField] ? t(`selects.userRole.${data[userField]}`) : '');
        }
        if (userField === 'familyStatus') {
          return createTableCell(data[userField] ? t(`selects.familyStatus.${data[userField]}`) : '');
        }
        if (userField === 'businessStatus') {
          return createTableCell(data[userField] ? t(`selects.corporateBodyStatus.${data[userField]}`) : '');
        }
        if (userField === 'recruiter') {
          return createTableCell(typeof data.recruiter === 'object' && !!data.recruiter ? `${data.recruiter?.name} ${data.recruiter?.surname}` : '');
        }
        if (/\b(?:idcard.|visa.|permit.|pass.)\b/i.test(userField)) {
          const docType = userField.split('.')[0];
          const docValueKey = userField.split('.')[1];
          const doc = data.docs?.find(doc => doc.type === docType);
          const value = doc?.[docValueKey];

          if (typeof value === 'boolean') {
            return createTableCell(t(value.toString()));
          }

          if (docValueKey === 'goal') {
            return createTableCell(value ? t(`selects.permitType.${value}`) : '');
          }

          return createTableCell(!docValueKey.includes('date') ? value || '' : getDateFromIso(value) || '');
        }
        if (userField === 'workTypes') {
          return createTableCell(data[userField].map(item => t(`selects.userWorkType.${item}`)).toString() || '');
        }
        if (isMongoId(colName)) {
          // eslint-disable-next-line max-len
          return createTableCell(typeof data.customFields?.[colName] === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.customFields?.[colName] as string || '')
            ? getDateFromIso(data.customFields?.[colName] as string)
            : data.customFields?.[colName] as string || '',
          );
        }

        return createTableCell(data[userField as keyof IUser]?.toString() || '');
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
