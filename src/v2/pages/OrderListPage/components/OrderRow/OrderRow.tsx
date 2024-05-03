import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import StatusLabel from 'v2/uikit/StatusLabel';

import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';
import { IOrder } from 'interfaces/order.interface';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';

import { LinkWrapper } from './styles';

type Props = {
  data: IOrder<true>;
  participations: IOrderParticipation<true>[];
}

const OrderRow = (props: Props) => {
  const { t } = useTranslation();
  const { data, participations } = props;

  const project = data.project;
  const client = data?.client;

  const statsCellContent = useMemo(() => {
    const employed = participations.filter((item) => item.stages[item.stages.length - 1]?.stage.staticName === 'hired').length;
    const left = data.goal - employed;
    return `${data.goal || 0} / ${employed} / ${left > 0 ? left : 0}`;
  }, [data.goal, participations]);

  const candidateStatsCellContent = useMemo(() => {
    const hired = participations.filter((item) => item.stages[item.stages.length - 1]?.stage.staticName === 'hired').length;
    const canceled = participations.filter((item) => item.stages[item.stages.length - 1]?.stage.staticName === 'canceled').length;
    const candidates = participations.length - hired - canceled;
    return `${candidates} / ${canceled}`;
  }, [participations]);

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
        {client.shortName}
      </ListTableCell>
      <ListTableCell>
        {project?.name}
      </ListTableCell>
      <ListTableCell>
        {t(`selects.orderCooperationType.${data?.cooperationType}`)}
      </ListTableCell>
      <ListTableCell>
        <StatusLabel className={data.status}>{t(`selects.orderStatus.${data.status}`)}</StatusLabel>
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
        {getDateFromIso(data.createdAt, 'dd.MM.yyyy HH:mm:ss')}
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
