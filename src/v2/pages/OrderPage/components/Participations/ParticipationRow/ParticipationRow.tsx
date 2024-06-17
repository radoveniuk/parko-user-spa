import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useOrderParticipationActions from 'v2/pages/OrderPage/hooks/useOrderParticipationActions';
import { Checkbox, Menu, MenuItem } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { DeleteIcon, EditIcon, ThreeDotsIcon } from 'components/icons';
import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { ORDER_STAGE_COLORS } from 'constants/colors';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';
import { IUser } from 'interfaces/users.interface';

import ScreaningDialog from '../../../../../components/ScreaningDialog';
import RedirectDialog from '../RedirectDialog';

import FormDialog from './FormDialog';

export type ParticipationRowProps = {
  participation: IOrderParticipation<true>;
  selected: boolean;
  onChangeSelect(val: boolean): void;
  onDelete(): void;
}

const ParticipationRow = ({ participation, selected, onChangeSelect, onDelete }: ParticipationRowProps) => {
  const { t } = useTranslation();
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

  // delete
  const [openDelete, setOpenDelete] = useState(false);

  // permissions
  const { permissions } = useAuthData();

  return (
    <>
      <ListTableRow>
        <ListTableCell>
          <Checkbox checked={selected} onChange={(e) => void onChangeSelect(e.target.checked)} />
        </ListTableCell>
        <ListTableCell>
          <Link to={`/profile/${participation.user._id}`} className="table-link" state={{ tab: 3 }}>
            <span className="column-content">{participation.user.fullname}</span>
          </Link>
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
          <Link to={`/profile/${participation.createdBy?._id}`} className="table-link">
            <span className="column-content">{participation.createdBy?.fullname}</span>
          </Link>
        </ListTableCell>
        <ListTableCell align="right">
          {permissions.includes('orders:update') && (
            <Menu menuComponent={<IconButton><ThreeDotsIcon /></IconButton>}>
              <MenuItem onClick={() => void setOpenEdit(true)}><EditIcon />{t('edit')}</MenuItem>
              <MenuItem onClick={() => void setOpenDelete(true)}><DeleteIcon />{t('delete')}</MenuItem>
            </Menu>
          )}
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
      {!!openDelete && (
        <DialogConfirm
          open={openDelete}
          onClose={() => void setOpenDelete(false)}
          onSubmit={() => void onDelete()}
        />
      )}
    </>
  );
};
export default ParticipationRow;
