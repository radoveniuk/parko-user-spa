import React, { memo, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Checkbox from 'v2/uikit/Checkbox';
import Dialog from 'v2/uikit/Dialog';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { EyeIcon } from 'components/icons';
import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';
import { isMongoId } from 'helpers/regex';
import { IClient } from 'interfaces/client.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import { LinkWrapper } from './styles';

type ProfileRowProps = {
  cols: string[];
  data: IUser & { employmentStatus: string };
  selected: boolean;
  onChangeSelect(val: boolean): void;
}

const ProfileRow = ({ data, selected, onChangeSelect, cols }: ProfileRowProps) => {
  const { t } = useTranslation();
  const [showBusinessActivities, setShowBusinessActivities] = useState(false);

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
      <ListTableCell>
        <LinkWrapper>
          <StatusLabel className={data.employmentStatus}>
            {data.employmentStatus && t(`selects.userPositionEmploymentStatus.${data.employmentStatus}`)}
          </StatusLabel>
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
          return createTableCell(data.salary ? `${Number(data.salary).toFixed(2).toString().replace('.', ',')} €` : '');
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
        if (userField === 'recruiter') {
          return createTableCell(typeof data.recruiter === 'object' && !!data.recruiter ? `${data.recruiter?.name} ${data.recruiter?.surname}` : '');
        }
        if (userField === 'employmentRecruiter') {
          return createTableCell(
            typeof data.employmentRecruiter === 'object' && !!data.employmentRecruiter ? data.employmentRecruiter?.fullname : '',
          );
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
        if (userField === 'businessActivities') {
          const descriptions = data[userField]?.filter(item => !item.dateTo).map(item => item.description);
          if (!descriptions?.length) return createTableCell('');
          return createTableCell(
            <IconButton onClick={() => void setShowBusinessActivities(true)}><EyeIcon /></IconButton>,
            descriptions?.join('\n'),
          );
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
      <ListTableCell />
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

export default memo(ProfileRow);
