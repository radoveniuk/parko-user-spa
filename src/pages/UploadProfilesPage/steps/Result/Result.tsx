import React from 'react';
import { useTranslation } from 'react-i18next';

import { DefaultPassWrapper } from 'pages/UploadProfilesPage/styles';
import IconButton from 'components/shared/IconButton';
import { CopyIcon } from 'components/icons';
import { DEFAULT_PASS } from 'pages/UploadProfilesPage/constants';

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