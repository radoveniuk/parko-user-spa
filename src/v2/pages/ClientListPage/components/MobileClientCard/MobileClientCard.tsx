import React, { CSSProperties, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Avatar, Button } from 'v2/uikit';
import StatusLabel from 'v2/uikit/StatusLabel';

import { BusinessIcon, ProjectIcon } from 'components/icons';
import { IClient } from 'interfaces/client.interface';
import { themeConfig } from 'theme';

import { MobileClientCardWrapper } from './styles';

type Props = {
  style?: CSSProperties;
  client: IClient;
  projectsCount: number;
};

const MobileClientCard = ({ style, client, projectsCount }: Props) => {
  const { t } = useTranslation();

  const [imageUrl, setImageUrl] = useState('');

  const testImage = (URL: string) => {
    fetch(URL).then((res) => {
      if (res.status !== 404) {
        setImageUrl(URL);
      }
    });
  };

  useEffect(() => {
    testImage(`/favicon-api?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${client.websiteUrl}&size=64`);
  });

  return (
    <MobileClientCardWrapper style={style}>
      <div className="card">
        <div className="left">
          <Avatar
            size={70}
            sx={{ bgcolor: themeConfig.palette.primary.light }}
          >
            {imageUrl ? <img style={{ height: 40, borderRadius: 6 }} src={imageUrl} /> : <BusinessIcon size={40} />}
          </Avatar>
          <div className="actions">
            <Link to={`/client/${client._id}`}>
              <Button variant="outlined">{t('project.client')}</Button>
            </Link>
          </div>
        </div>
        <div className="right">
          {client.status && (
            <StatusLabel className={client.status}>
              {t(`selects.clientStatus.${client.status}`)}
            </StatusLabel>
          )}
          <div className="name">
            <b>{client.shortName}</b><br/>
            <div className="business-name">
              {client.name}
            </div>
          </div>
          <div className="project">
            <ProjectIcon size={20} /> {t('navbar.projects')}: {projectsCount}
          </div>
          <a href={`tel:${client.phone}`} className="phone">
            {client.phone}
          </a>
        </div>
      </div>
    </MobileClientCardWrapper>
  );
};

export default memo(MobileClientCard);
