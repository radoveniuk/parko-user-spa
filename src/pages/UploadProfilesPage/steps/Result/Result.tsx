import React from 'react';
import { useTranslation } from 'react-i18next';

import { DefaultPassWrapper } from 'pages/UploadProfilesPage/styles';
import IconButton from 'components/shared/IconButton';
import { CopyIcon } from 'components/icons';
import { DEFAULT_PASS } from 'pages/UploadProfilesPage/constants';

const Result = () => {
  const { t } = useTranslation();

  return (
    <>
      {t('userUpload.successText')}
      <DefaultPassWrapper>
        {DEFAULT_PASS}
        <IconButton onClick={() => void navigator.clipboard.writeText(DEFAULT_PASS)}><CopyIcon /></IconButton>
      </DefaultPassWrapper>
    </>
  );
};

export default Result;
