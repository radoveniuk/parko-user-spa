import React, { CSSProperties, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { useFilters } from 'v2/components/Filters';
import { Avatar } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { useDeleteResidence } from 'api/mutations/residenceMutation';
import { DeleteIcon, EditIcon, ResidenceIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';
import { IProject } from 'interfaces/project.interface';
import { IResidence } from 'interfaces/residence.interface';
import { IUser } from 'interfaces/users.interface';
import { themeConfig } from 'theme';

import { ResidenceTableRow } from '../types';

import { MobileCardWrapper } from './styles';

type Props = {
  style?: CSSProperties;
  data: ResidenceTableRow;
};

const MobileResidenceCard = ({ style, data }: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { filtersState } = useFilters();

  const user = data.metadata.user as IUser;
  const project = user.project as IProject;
  const client = project?.client as IClient;

  const deleteResidence = useDeleteResidence();
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const { permissions } = useAuthData();

  return (
    <MobileCardWrapper style={style}>
      <div className="card">
        <div className="date">{getDateFromIso(data.metadata.createdAt)}</div>
        <Link to={`/profile/${user._id}`} className="user">
          <Avatar size={40} color={themeConfig.palette.primary.light} username={data.user} />
          <div className="info">
            <div>{data.user}</div>
            <div className="side-info">
              <StatusLabel className={user.status}>{t(`selects.userStatus.${user.status}`)}</StatusLabel>
              {!!project && <div className="project">{client ? `${client.shortName} > ` : ''}{project?.name}</div>}
            </div>
          </div>
        </Link>
        <div className="prepayment">
          <div className="row">
            <ResidenceIcon size={20} />
            {data.checkInDate} - {data.checkOutDate}
          </div>
        </div>
        <div className="actions">
          {permissions.includes('residences:update') && (
            <IconButton onClick={() => {}}><EditIcon /></IconButton>
          )}
          {permissions.includes('residences:delete') && (
            <IconButton onClick={() => void setIdToDelete(data._id)}><DeleteIcon /></IconButton>
          )}
        </div>
      </div>
      {!!idToDelete && (
        <DialogConfirm
          onClose={() => void setIdToDelete(null)}
          open={!!idToDelete}
          onSubmit={() => {
            deleteResidence.mutateAsync(idToDelete as string).then(() => {
              const prevAccommodations = queryClient.getQueryData(['residences', JSON.stringify(filtersState)]) as IResidence[];
              queryClient.setQueryData(['residences', JSON.stringify(filtersState)], prevAccommodations.filter((item) => item._id !== idToDelete));
              setIdToDelete(null);
              deleteResidence.mutate(idToDelete as string);
            });
          }}
        />
      )}
    </MobileCardWrapper>
  );
};

export default memo(MobileResidenceCard);
