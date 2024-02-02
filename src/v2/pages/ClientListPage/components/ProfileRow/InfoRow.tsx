import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import StatusLabel from 'v2/uikit/StatusLabel';

import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
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
        const clientField = colName.replace('client.', '') as keyof IClient;
        if (clientField.includes('Date')) {
          return (
            <ListTableCell key={colName}>
              <span className="column-content">{getDateFromIso(data[clientField])}</span>
            </ListTableCell>
          );
        }
        if (clientField === 'status') {
          return (
            <ListTableCell key={colName}>
              <StatusLabel className={`${data.status} column-content`}>{data.status && t(`selects.clientStatus.${data.status}`)}</StatusLabel>
            </ListTableCell>
          );
        }
        return (
          <ListTableCell key={colName}>
            <span className="column-content">{data[clientField]?.toString()}</span>
          </ListTableCell>
        );
      })}
    </ListTableRow>
  );
};

export default InfoRow;
