import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Stack } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';

import { FileIcon } from 'components/icons';

import FieldDialog from '../FieldDialog';

import { HeaderWrapper } from './styles';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();

  const [openTemplate, setOpenTemplate] = useState(false);

  return (
    <>
      <HeaderWrapper>
        <Stack direction="row" gap="9px" alignContent="center">
          <span className="bold">{t('customForms.fields')}: {count}</span>
        </Stack>
        <Stack direction="row" gap="15px">
          <div className="link">
            <Button className="big-btn" onClick={() => void setOpenTemplate(true)}>{t('customForms.newField')}</Button>
            <IconButton className="small-btn primary" onClick={() => void setOpenTemplate(true)}><FileIcon size={25} /></IconButton>
          </div>
        </Stack>
      </HeaderWrapper>
      {!!openTemplate && (
        <FieldDialog
          defaultData
          title={t('docsTemplates.template')}
          open={!!openTemplate}
          onClose={() => { setOpenTemplate(false); }}
        />
      )}
    </>
  );
};

export default memo(HeaderTable);
