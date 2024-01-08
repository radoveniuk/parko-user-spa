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
              <span className="column-content">{data.status && t(`selects.clientStatus.${data.status}`)}</span>
            </ListTableCell>
          );
        }
        return <ListTableCell key={colName}>
          <span className="column-content">{data[userField]?.toString()}</span>
        </ListTableCell>;
      })}
    </ListTableRow>
  );
};

export default InfoRow;
