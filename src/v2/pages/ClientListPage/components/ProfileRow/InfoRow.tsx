import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { STATUSES_COLORS } from 'constants/statuses';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';

import { useProfileRowContext } from './context';
import { LinkWrapper } from './styles';

const InfoRow = () => {
  const { t } = useTranslation();
  const { data, cols } = useProfileRowContext();

  return (
    <ListTableRow>
      <ListTableCell>
        <LinkWrapper>
          <Link to={`/client/${data._id}`} className="table-link">
            <span className="column-content">{data.name}</span>
          </Link>
        </LinkWrapper>
      </ListTableCell>
      {cols.map((colName) => {
        const userField = colName.replace('client.', '') as keyof IClient;
        if (userField.includes('Date')) {
          return <ListTableCell key={colName}>
            <span className="column-content">{getDateFromIso(data[userField])}</span>
          </ListTableCell>;
        }
        if (userField === 'status') {
          return (
            <ListTableCell key={colName} color={STATUSES_COLORS[data.status]}>
              <span className="column-content">{data.status && t(`selects.userStatus.${data.status}`)}</span>
            </ListTableCell>
          );
        }
        // if (typeof data[userField] === 'boolean') {
        //   return <ListTableCell key={colName}>
        //     <span className="column-content"><BooleanIcon value={data[userField] as boolean} /></span>
        //   </ListTableCell>;
        // }
        // if (userField === 'sex') {
        //   return <ListTableCell key={colName}>
        //     <span className="column-content">{t(data[userField])}</span>
        //   </ListTableCell>;
        // }
        // if (userField === 'role') {
        //   return <ListTableCell key={colName}>
        //     <span className="column-content">{t(`selects.userRole.${data[userField]}`)}</span>
        //   </ListTableCell>;
        // }
        // if (userField === 'recruiter') {
        //   return (
        //     <ListTableCell key={colName}>
        //       <span className="column-content">
        //         {typeof data.recruiter === 'object' &&
        //           !!data.recruiter &&
        //           `${data.recruiter?.name} ${data.recruiter?.surname}`}
        //       </span>
        //     </ListTableCell>
        //   );
        // }
        // if (isMongoId(colName)) {
        //   return (
        //     <ListTableCell key={colName}>
        //       <span className="column-content">
        //         {typeof data.customFields?.[colName] === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.customFields?.[colName] as string || '')
        //           ? getDateFromIso(data.customFields?.[colName] as string)
        //           : data.customFields?.[colName] as string || ''
        //         }
        //       </span>
        //     </ListTableCell>
        //   );
        // }

        return <ListTableCell key={colName}>
          <span className="column-content">{data[userField]?.toString()}</span>
        </ListTableCell>;
      })}
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
