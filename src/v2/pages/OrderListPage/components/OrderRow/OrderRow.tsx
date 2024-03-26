import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import StatusLabel from 'v2/uikit/StatusLabel';

import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';
import { IOrder } from 'interfaces/order.interface';

import { LinkWrapper } from './styles';

type ClientRowProps = {
  cols: string[];
  data: IOrder<true>;
}

const OrderRow = (props: ClientRowProps) => {
  const { t } = useTranslation();
  const { data } = props;

  const project = data.project;
  const client = data?.client;

  // TODO
  const statsCellContent = useMemo(() => {
    const employed = 0;
    const left = data.goal || 0 - employed;
    return `${data.goal || 0} / ${employed} / ${left}`;
  }, [data.goal]);

  // TODO
  const candidateStatsCellContent = useMemo(() => {
    const candidates = 0;
    const rejected = 0;
    return `${candidates} / ${rejected}`;
  }, []);

  return (
    <ListTableRow>
      <ListTableCell>
        <LinkWrapper>
          <Link to={`/order/${data._id}`} className="table-link">
            {data.name}
          </Link>
        </LinkWrapper>
      </ListTableCell>
      <ListTableCell>
        <LinkWrapper>
          <Link to={`/client/${client._id}`} className="table-link">
            {client.name}
          </Link>
        </LinkWrapper>
      </ListTableCell>
      <ListTableCell>
        {project?.name}
      </ListTableCell>
      <ListTableCell>
        {t(`selects.orderCooperationType.${data?.cooperationType}`)}
      </ListTableCell>
      <ListTableCell>
        <StatusLabel className={data.status}>{t(`selects.clientStatus.${data.status}`)}</StatusLabel>
      </ListTableCell>
      <ListTableCell>
        {statsCellContent}
      </ListTableCell>
      <ListTableCell>
        {candidateStatsCellContent}
      </ListTableCell>
      <ListTableCell>
        {getDateFromIso(data.dateFrom)}
      </ListTableCell>
      <ListTableCell>
        {getDateFromIso(data.dateTo)}
      </ListTableCell>
      <ListTableCell>
        {getDateFromIso(data.createdAt, 'dd.MM.yyyy hh:mm:ss')}
      </ListTableCell>
      <ListTableCell>
        <Link to={`/profile/${data.createdBy._id}`} className="table-link">
          {data.createdBy.fullname}
        </Link>
      </ListTableCell>
    </ListTableRow>
  );
};
export default OrderRow;
