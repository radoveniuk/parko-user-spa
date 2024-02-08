import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { DeleteIcon, EditIcon } from 'components/icons';
import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import { usePrepaymentRowContext } from './context';
import { LinkWrapper } from './styles';

const InfoRow = () => {
  const { t } = useTranslation();
  const { data } = usePrepaymentRowContext();

  const user = data.user as IUser;
  const project = user.project as IProject;
  const client = project.client as IClient;

  return (
    <ListTableRow>
      <ListTableCell>
        <LinkWrapper>
          <Link to={`/profile/${user._id}`} className="table-link">
            {user.name} {user.surname}
          </Link>
        </LinkWrapper>
      </ListTableCell>
      <ListTableCell>
        {client ? `${client.name} > ` : ''}{project.name}
      </ListTableCell>
      <ListTableCell>
        <StatusLabel className={user.status}>{t(`selects.userStatus.${user.status}`)}</StatusLabel>
      </ListTableCell>
      <ListTableCell>
        {getDateFromIso(data.createdAt)}
      </ListTableCell>
      <ListTableCell>
        {Number(data.sum).toFixed(2)} €
      </ListTableCell>
      <ListTableCell>
        {data.userComment}
      </ListTableCell>
      <ListTableCell>
        <StatusLabel className={data.status}>{t(`selects.prepaymentStatus.${data.status}`)}</StatusLabel>
      </ListTableCell>
      <ListTableCell>
        {getDateFromIso(data.paymentDate)}
      </ListTableCell>
      <ListTableCell>
        <IconButton><EditIcon /></IconButton>
      </ListTableCell>
      <ListTableCell>
        <IconButton><DeleteIcon /></IconButton>
      </ListTableCell>
    </ListTableRow>
  );
};

export default InfoRow;
