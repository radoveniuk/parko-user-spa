import React, { CSSProperties, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Avatar, Button, Checkbox } from 'v2/uikit';
import StatusLabel from 'v2/uikit/StatusLabel';

import { ProjectIcon, UserIcon, VerifiedIcon } from 'components/icons';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';
import { themeConfig } from 'theme';

import { MobileProfileCard } from './styles';

type Props = {
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  style?: CSSProperties;
  user: IUser;
};

const MobileUserCard = ({ style, user, selected, onSelect }: Props) => {
  const { t } = useTranslation();

  return (
    <MobileProfileCard style={style}>
      <div className={`card ${user.isDeleted ? 'deleted' : ''}`}>
        <Checkbox
          className="user-checkbox"
          checked={selected}
          onChange={(e) => {
            onSelect?.(!!e.target.checked as boolean);
          }}
        />
        <div className="left">
          <Avatar size={70} sx={{ bgcolor: themeConfig.palette.primary.light }}>
            <UserIcon size={45} />
          </Avatar>
          <div className="actions">
            <Link to={`/profile/${user._id}`}>
              <Button variant="outlined">{t('profile')}</Button>
            </Link>
          </div>
        </div>
        <div className="right">
          {user.status && (
            <StatusLabel className={user.status}>
              {t(`selects.userStatus.${user.status}`)}
            </StatusLabel>
          )}
          <div className="name">
            <b>{user.name} {user.surname}</b>
            {user.status === 'hired' && <VerifiedIcon color={themeConfig.palette.primary.main} size={20} />}
          </div>
          <div className="project">
            <ProjectIcon size={20} />{(user.project as IProject)?.name || t('No project')}
          </div>
          <a href={`tel:${user.phone}`} className="phone">
            {user.phone}
          </a>
        </div>
      </div>
    </MobileProfileCard>
  );
};

export default memo(MobileUserCard);
