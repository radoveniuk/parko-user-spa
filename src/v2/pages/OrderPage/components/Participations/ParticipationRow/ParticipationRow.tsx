import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useOrderParticipationActions from 'v2/pages/OrderPage/hooks/useOrderParticipationActions';
import { Checkbox } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { EditIcon } from 'components/icons';
import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { ORDER_STAGE_COLORS } from 'constants/colors';
import { getDateFromIso } from 'helpers/datetime';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';
import { IUser } from 'interfaces/users.interface';

import ScreaningDialog from '../../../../../components/ScreaningDialog';
import RedirectDialog from '../RedirectDialog';

import FormDialog from './FormDialog';
import { LinkWrapper } from './styles';

export type ParticipationRowProps = {
  participation: IOrderParticipation<true>;
  selected: boolean;
  onChangeSelect(val: boolean): void;
}

const ParticipationRow = ({ participation, selected, onChangeSelect }: ParticipationRowProps) => {
  const participationActualStage = useMemo(() => participation.stages[participation.stages.length - 1]?.stage, [participation.stages]);

  const screaningStat = useMemo(() => {
    const requiredFieldsIds = participation.order.form?.requiredFields || [];
    let completedRequirderFieldsCount = 0;
    Object.keys(participation.screaning || {}).forEach((fieldId) => {
      if (requiredFieldsIds.includes(fieldId) && !!participation.screaning[fieldId]) {
        completedRequirderFieldsCount += 1;
      }
    });
    // eslint-disable-next-line max-len
    return `${completedRequirderFieldsCount} / ${requiredFieldsIds.length} (${((requiredFieldsIds.length ? completedRequirderFieldsCount / requiredFieldsIds.length : 1) * 100).toFixed().replace('.', ',')}%)`;
  }, [participation.order.form?.requiredFields, participation.screaning]);

  // save updates
  const [openScreaning, setOpenScreaning] = useState(false);
  const { update: updateParticipation } = useOrderParticipationActions();
  const screaningSubmit = (values: Record<string, any>) => {
    updateParticipation({ _id: participation._id, screaning: values });
  };

  // redirect msg
  const [openRedirectMsg, setOpenRedirectMsg] = useState(false);

  // edit
  const [openEdit, setOpenEdit] = useState(false);
  const editSubmit = (values: Partial<IOrderParticipation>) => {
    updateParticipation({ _id: participation._id, ...values });
    if (values.stages?.[values.stages?.length - 1].stage.staticName === 'hired') {
      setOpenRedirectMsg(true);
    }
  };

  return (
    <>
      <ListTableRow>
        <ListTableCell>
          <Checkbox checked={selected} onChange={(e) => void onChangeSelect(e.target.checked)} />
        </ListTableCell>
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
      {!!openRedirectMsg && (
        <RedirectDialog
          user={participation.user as Pick<IUser, 'fullname' | '_id'>}
          open={openRedirectMsg}
          onClose={() => void setOpenRedirectMsg(false)}
        />
      )}
    </>
  );
};
export default ParticipationRow;
