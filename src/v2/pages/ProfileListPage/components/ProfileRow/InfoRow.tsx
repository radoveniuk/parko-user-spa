import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { getCurrencyString } from 'v2/helpers/currency';
import Checkbox from 'v2/uikit/Checkbox';
import Dialog from 'v2/uikit/Dialog';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { EditIcon, EyeIcon } from 'components/icons';
import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { isMongoId } from 'helpers/regex';
import { IClient } from 'interfaces/client.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import { useProfileRowContext } from './context';
import { LinkWrapper } from './styles';

const InfoRow = () => {
  const { permissions } = useAuthData();
  const { t } = useTranslation();
  const { data, selected, onChangeSelect, cols, startEdit, style } = useProfileRowContext();
  const [showBusinessActivities, setShowBusinessActivities] = useState(false);
  const queryClient = useQueryClient();

  return (
    <ListTableRow error={data.isDeleted} style={style}>
      <ListTableCell>
        <Checkbox checked={selected} onChange={(e) => void onChangeSelect(e.target.checked)} aria-label={`select profile ${data.nickname}`} />
      </ListTableCell>
      <ListTableCell title={`${data.fullname}`}>
        <LinkWrapper>
          <Link to={`/profile/${data._id}`} className="table-link">
            <span className="column-content">{data.fullname}</span>
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
        if (['createdAt', 'updatedAt'].includes(userField)) {
          return createTableCell(getDateFromIso(data[userField as keyof IUser], 'dd.MM.yyyy HH:mm'));
        }
        if (userField === 'client') {
          const project = data.project as IProject | undefined;
          const client = project?.client as IClient | undefined;
          return createTableCell(client?.shortName);
        }
        if (userField === 'clientCompany') {
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
          return createTableCell(data.salary ? getCurrencyString(data.salary) : '');
        }
        if (typeof data[userField as keyof IUser] === 'boolean' || userField === 'sex') {
          return createTableCell(t(data[userField as keyof IUser]));
        }
        if (userField === 'role') {
          return createTableCell(data.roles ? data.roles?.map((r) => r.name).join(',') : '');
        }
        if (userField === 'familyStatus') {
          return createTableCell(data[userField] ? t(`selects.familyStatus.${data[userField]}`) : '');
        }
        if (userField === 'businessStatus') {
          return createTableCell(data[userField] ? t(`selects.corporateBodyStatus.${data[userField]}`) : '');
        }
        if (['recruiter', 'employmentRecruiter'].includes(userField)) {
          return createTableCell(
            !!data[userField as keyof IUser] && typeof data[userField as keyof IUser] === 'object'
              ? `${(data[userField as keyof IUser] as IUser)?.fullname}`
              : '',
          );
        }
        if (['createdBy', 'updatedBy'].includes(userField)) {
          const allCreators = queryClient.getQueryData(['users-filter', JSON.stringify({})]) as IUser[] || [];
          const creator = allCreators.find(item => item._id === data[userField as keyof IUser]);
          return createTableCell(
            creator
              ? `${creator.fullname}`
              : '',
          );
        }
        if (/\b(?:idcard.|visa.|permit.|longtermstay.|pass.)\b/i.test(userField)) {
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
          return createTableCell(data?.[userField]?.map(item => t(`selects.userWorkType.${item}`))?.toString() || '');
        }
        if (userField === 'businessActivities') {
          const descriptions = data[userField]?.filter(item => !item.dateTo).map(item => item.description);
          if (!descriptions?.length) return createTableCell('');
          return createTableCell(
            <IconButton onClick={() => void setShowBusinessActivities(true)}><EyeIcon /></IconButton>,
            descriptions?.join('\n'),
          );
        }
        if (isMongoId(colName)) {
          const value = data.customFields?.[colName];
          if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.substring(0, 10))) {
            return createTableCell(getDateFromIso(value));
          }
          if (typeof value === 'boolean') {
            return createTableCell(t(value.toString()));
          }
          return createTableCell(value || '');
        }

        return createTableCell(data[userField as keyof IUser]?.toString() || '');
      })}
      <ListTableCell>
        {permissions.includes('users:update') && (
          <IconButton
            className="fast-edit-profile"
            onClick={startEdit}
            aria-label="fast edit profile"
          >
            <EditIcon />
          </IconButton>
        )}
      </ListTableCell>
      {!!showBusinessActivities && (
        <Dialog
          title={`${data.fullname}: ${t('user.businessActivities')}`}
          open={showBusinessActivities}
          onClose={() => void setShowBusinessActivities(false)}
        >
          <ol style={{ padding: '0 0 0 20px', margin: 0 }}>
            {data.businessActivities?.filter(item => !item.dateTo).map(item => item.description).map((item, index) => <li key={index}>{item}</li>)}
          </ol>
        </Dialog>
      )}
    </ListTableRow>
  );
};

export default InfoRow;
