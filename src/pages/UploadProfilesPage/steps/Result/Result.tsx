import React from 'react';

import { DefaultPassWrapper } from 'pages/UploadProfilesPage/styles';
import IconButton from 'components/shared/IconButton';
import { CopyIcon } from 'components/icons';
import { useTranslation } from 'react-i18next';

const Result = () => {
  const { t } = useTranslation();

  return (
    <>
      {t('userUpload.successText')}
      <DefaultPassWrapper>
        ParkoUser_2022
        <IconButton onClick={() => void navigator.clipboard.writeText('ParkoUser_2022')}><CopyIcon /></IconButton>
      </DefaultPassWrapper>
    </>
  );
};

export default Result;
