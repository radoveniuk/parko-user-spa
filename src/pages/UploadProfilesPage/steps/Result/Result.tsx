import React from 'react';
import { useTranslation } from 'react-i18next';

import { CopyIcon } from 'components/icons';
import IconButton from 'components/shared/IconButton';
import { DEFAULT_PASS } from 'pages/UploadProfilesPage/constants';
import { DefaultPassWrapper } from 'pages/UploadProfilesPage/styles';

const Result = () => {
  const { t } = useTranslation();

  return (
    <div style={{ marginTop: '2rem' }}>
      <div>{t('userUpload.successText')}</div>
      <DefaultPassWrapper>
        {DEFAULT_PASS}
        <IconButton onClick={() => void navigator.clipboard.writeText(DEFAULT_PASS)}><CopyIcon /></IconButton>
      </DefaultPassWrapper>
    </div>
  );
};

export default Result;
