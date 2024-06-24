import React, { CSSProperties, memo, useCallback } from 'react';
import useBoolean from 'v2/hooks/useBoolean';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';

import { DeleteIcon, EditIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { IProjectAccommodation } from 'interfaces/projectAccommodation.interface';

import ProjectAccommodationDialog from '../../dialogs/ProjectAccommodationDialog';
import useProjectAccommodationActions from '../hooks/useProjectAccommodationActions';

import { MobileCardWrapper } from './styles';

type Props = {
  style?: CSSProperties;
  data: IProjectAccommodation<true>;
};

const MobileProjectAccommodationCard = ({ style, data }: Props) => {
  const [isOpenEdit, openEdit, closeEdit] = useBoolean(false);
  const [isOpenDelete, openDelete, closeDelete] = useBoolean(false);
  const { remove } = useProjectAccommodationActions();

  const submitDeleteHandler = useCallback(() => {
    remove(data._id);
  }, [data._id, remove]);

  const { permissions } = useAuthData();

  return (
    <MobileCardWrapper style={style}>
      <div className="card">
        <div className="date">{getDateFromIso(data.createdAt)}</div>
        <div className="info">
          <div>{data.accommodation.name} {data.accommodation.adress}</div>
          <div className="side-info">
            <div className="project">{data.client ? `${data.client.shortName} > ` : ''}{data.project.name}</div>
          </div>
        </div>
        <div className="actions">
          {permissions.includes('accommodations:update') && (
            <IconButton onClick={openEdit}><EditIcon /></IconButton>
          )}
          {permissions.includes('accommodations:delete') && (
            <IconButton onClick={openDelete}><DeleteIcon /></IconButton>
          )}
        </div>
      </div>
      {isOpenDelete && (
        <DialogConfirm
          onClose={closeDelete}
          open={isOpenDelete}
          onSubmit={submitDeleteHandler}
        />
      )}
      {isOpenEdit && (
        <ProjectAccommodationDialog
          open={isOpenEdit}
          onClose={closeEdit}
          data={data}
        />
      )}
    </MobileCardWrapper>
  );
};

export default memo(MobileProjectAccommodationCard);
