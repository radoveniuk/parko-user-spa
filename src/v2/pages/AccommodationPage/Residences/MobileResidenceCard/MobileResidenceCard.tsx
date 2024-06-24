import React, { CSSProperties, memo, PropsWithChildren, useState } from 'react';
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
import { IResidence } from 'interfaces/residence.interface';
import { IUser } from 'interfaces/users.interface';
import { themeConfig } from 'theme';

import { useActiveResidence } from '../../contexts/ResidenceContext';
import useGetTableCellContent from '../hooks/useGetTableCellContent';

import { MobileCardWrapper } from './styles';

type Props = {
  style?: CSSProperties;
  data: IResidence;
};

const MobileResidenceCard = ({ style, data }: Props) => {
  const queryClient = useQueryClient();
  const { filtersState } = useFilters();

  const user = data.user as IUser;

  const [, setOpenResidence] = useActiveResidence();
  const deleteResidence = useDeleteResidence();
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const getCellContent = useGetTableCellContent();

  const { permissions } = useAuthData();

  const UserWrapper = (props: PropsWithChildren) => user ? <Link to={`/profile/${user?._id}`} className="user" {...props} /> : <>{props.children}</>;

  return (
    <MobileCardWrapper style={style}>
      <div className="card">
        <div className="date">{getDateFromIso(data.createdAt)}</div>
        <UserWrapper>
          <Avatar size={40} color={themeConfig.palette.primary.light} username={data.userFullname} />
          <div className="info">
            <div>{data.userFullname}</div>
            <div className="side-info">
              <StatusLabel className={data.userStatus}>{getCellContent(data, 'userStatus')}</StatusLabel>
              {!!data.project && <div className="project">{getCellContent(data, 'client')} &gt; {getCellContent(data, 'project')}</div>}
            </div>
          </div>
        </UserWrapper>
        <div className="prepayment">
          <div className="row">
            <ResidenceIcon size={20} />
            {getCellContent(data, 'checkIn')} - {getCellContent(data, 'checkOut')}
          </div>
        </div>
        <div className="actions">
          {permissions.includes('residences:update') && (
            <IconButton onClick={() => void setOpenResidence(data)}><EditIcon /></IconButton>
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
