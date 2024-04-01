import React, { CSSProperties, memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ScreaningDialog from 'v2/components/ScreaningDialog';
import useOrderParticipationActions from 'v2/pages/OrderPage/hooks/useOrderParticipationActions';
import { Avatar, Button } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { EditIcon, UserIcon } from 'components/icons';
import { ORDER_STAGE_COLORS } from 'constants/colors';
import { getDateFromIso } from 'helpers/datetime';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';

import FormDialog from '../ParticipationRow/FormDialog';

import { MobileProfileCard } from './styles';

type Props = {
  style?: CSSProperties;
  participation: IOrderParticipation<true>;
};

const MobileParticipationCard = ({ style, participation }: Props) => {
  const { t } = useTranslation();
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
    <MobileProfileCard style={style}>
      <div className="card">
        <div className="left">
          <Avatar size={70} sx={{ bgcolor: ORDER_STAGE_COLORS[participationActualStage?.color]?.[0] }}>
            <UserIcon size={45} color={ORDER_STAGE_COLORS[participationActualStage?.color]?.[1]} />
          </Avatar>
          <div className="actions">
            <Link to={`/profile/${participation._id}`}>
              <Button variant="outlined">{t('profile')}</Button>
            </Link>
          </div>
        </div>
        <div className="right">
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
          <div className="name">
            <b>{participation.user.fullname}</b>
          </div>
          <span className="screaning" role="button" onClick={() => void setOpenScreaning(true)}>
            {t('order.screaning')}: {screaningStat}
          </span>
          <span className="date">
            {getDateFromIso(participation.createdAt, 'dd.MM.yyyy')}
          </span>
          <IconButton className="edit" onClick={() => void setOpenEdit(true)}><EditIcon /></IconButton>
        </div>
      </div>
      {!!openScreaning && (
        <ScreaningDialog participation={participation} open={openScreaning} onClose={() => void setOpenScreaning(false)} onSubmit={screaningSubmit} />
      )}
      {!!openEdit && (
        <FormDialog participation={participation} open={openEdit} onClose={() => void setOpenEdit(false)} onSubmit={editSubmit} />
      )}
    </MobileProfileCard>
  );
};

export default memo(MobileParticipationCard);
