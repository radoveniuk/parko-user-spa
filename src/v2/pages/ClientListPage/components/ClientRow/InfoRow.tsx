import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { EditIcon } from 'components/icons';
import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';
import { IUser } from 'interfaces/users.interface';

import { useClientRowContext } from './context';
import { LinkWrapper } from './styles';

const InfoRow = () => {
  const { t } = useTranslation();
  const { data, cols, startEdit } = useClientRowContext();

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
        const createTableCell = (content: string | ReactNode, title?: string) => (
          <ListTableCell key={colName} title={title || content as string}>
            <span className="column-content">{content}</span>
          </ListTableCell>
        );
        const clientField = colName.replace('client.', '') as keyof IClient;
        if (clientField.includes('Date')) {
          return createTableCell(getDateFromIso(data[clientField]));
        }
        if (clientField === 'status') {
          return createTableCell(data.status ? <StatusLabel className={data.status}>{t(`selects.clientStatus.${data.status}`)}</StatusLabel> : '',
            t(`selects.userStatus.${data.status}`));
        }
        if (clientField === 'managers') {
          return createTableCell(data.managers?.map((item) => `${(item as IUser).name} ${(item as IUser).surname}`).join(', '));
        }
        return createTableCell(data[clientField]?.toString());
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
