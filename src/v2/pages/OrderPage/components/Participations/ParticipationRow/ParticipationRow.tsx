import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useOrderParticipationActions from 'v2/pages/OrderPage/hooks/useOrderParticipationActions';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { EditIcon } from 'components/icons';
import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { ORDER_STAGE_COLORS } from 'constants/colors';
import { getDateFromIso } from 'helpers/datetime';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';

import ScreaningDialog from '../../../../../components/ScreaningDialog';

import FormDialog from './FormDialog';
import { LinkWrapper } from './styles';

export type ParticipationRowProps = {
  participation: IOrderParticipation<true>;
}

const ParticipationRow = ({ participation }: ParticipationRowProps) => {
  const participationActualStage = useMemo(() => participation.stages[participation.stages.length - 1]?.stage, [participation.stages]);

  const screaningStat = useMemo(() => {
    const requiredFieldsIds = participation.order.form?.requiredFields || [];
    let completedRequirderFieldsCount = 0;
    Object.keys(participation.screaning || {}).forEach((fieldId) => {
      if (requiredFieldsIds.includes(fieldId)) {
        completedRequirderFieldsCount += 1;
      }
    });
    // eslint-disable-next-line max-len
    return `${completedRequirderFieldsCount} / ${requiredFieldsIds.length} (${(requiredFieldsIds.length ? completedRequirderFieldsCount / requiredFieldsIds.length : 1) * 100}%)`;
  }, [participation.order.form?.requiredFields, participation.screaning]);

  // save updates
  const [openScreaning, setOpenScreaning] = useState(false);
  const { update: updateParticipation } = useOrderParticipationActions();
  const screaningSubmit = (values: Record<string, any>) => {
    updateParticipation({ _id: participation._id, screaning: values });
  };

  const [openEdit, setOpenEdit] = useState(false);
  const editSubmit = (values: Partial<IOrderParticipation>) => {
    updateParticipation({ _id: participation._id, ...values });
  };

  return (
    <>
      <ListTableRow>
        <ListTableCell>
          <LinkWrapper>
            <Link to={`/profile/${participation.user._id}`} className="table-link" state={{ tab: 3 }}>
              <span className="column-content">{participation.user.fullname}</span>
            </Link>
          </LinkWrapper>
        </ListTableCell>
        <ListTableCell>
          {participationActualStage && (
            <StatusLabel
              style={{
                backgroundColor: ORDER_STAGE_COLORS[participationActualStage.color][0],
                color: ORDER_STAGE_COLORS[participationActualStage.color][1],
              }}
            >
              {participationActualStage.name}
            </StatusLabel>
          )}
        </ListTableCell>
        <ListTableCell>
          <span className="table-link" role="button" onClick={() => void setOpenScreaning(true)}>
            {screaningStat}
          </span>
        </ListTableCell>
        <ListTableCell>
          {getDateFromIso(participation.createdAt, 'dd.MM.yyyy HH:mm')}
        </ListTableCell>
        <ListTableCell>
          <Link to={`/profile/${participation.createdBy._id}`} className="table-link">
            <span className="column-content">{participation.createdBy.fullname}</span>
          </Link>
        </ListTableCell>
        <ListTableCell align="right">
          <IconButton onClick={() => void setOpenEdit(true)}><EditIcon /></IconButton>
        </ListTableCell>
      </ListTableRow>
      {!!openScreaning && (
        <ScreaningDialog participation={participation} open={openScreaning} onClose={() => void setOpenScreaning(false)} onSubmit={screaningSubmit} />
      )}
      {!!openEdit && (
        <FormDialog participation={participation} open={openEdit} onClose={() => void setOpenEdit(false)} onSubmit={editSubmit} />
      )}
    </>
  );
};
export default ParticipationRow;
