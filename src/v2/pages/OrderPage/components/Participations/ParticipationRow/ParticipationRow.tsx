import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { EditIcon } from 'components/icons';
import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { ORDER_STAGE_COLORS } from 'constants/colors';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';

import { LinkWrapper } from './styles';

export type ParticipationRowProps = {
  participation: IOrderParticipation<true>;
}

const ParticipationRow = ({ participation }: ParticipationRowProps) => {
  const participationActualStage = useMemo(() => participation.stages[participation.stages.length - 1]?.stage, [participation.stages]);
  const screaningStat = useMemo(() => {
    const requiredFieldsIds = participation.order.form.requiredFields;
    let completedRequirderFieldsCount = 0;
    Object.keys(participation.screaning || {}).forEach((fieldId) => {
      if (requiredFieldsIds.includes(fieldId)) {
        completedRequirderFieldsCount += 1;
      }
    });
    // eslint-disable-next-line max-len
    return `${completedRequirderFieldsCount} / ${requiredFieldsIds.length} (${(requiredFieldsIds.length ? completedRequirderFieldsCount / requiredFieldsIds.length : 1) * 100}%)`;
  }, [participation.order.form.requiredFields, participation.screaning]);
  return (
    <ListTableRow>
      <ListTableCell>
        <LinkWrapper>
          <Link to={`/profile/${participation.user._id}`} className="table-link">
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
      <ListTableCell >
        <span className="table-link">
          {screaningStat}
        </span>
      </ListTableCell>
      <ListTableCell align="right">
        <IconButton><EditIcon /></IconButton>
      </ListTableCell>
    </ListTableRow>
  );
};
export default ParticipationRow;
