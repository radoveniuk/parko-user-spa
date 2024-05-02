import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { PlusIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';

import FieldDialog from '../FieldDialog';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();

  const [openTemplate, setOpenTemplate] = useState(false);

  const { permissions } = useAuthData();

  return (
    <>
      <ListTableHeader title={`${t('customForms.fields')}: ${count}`}>
        {permissions.includes('customFields:create') && (
          <div className="link">
            <Button className="big-btn" onClick={() => void setOpenTemplate(true)}>{t('customForms.newField')}</Button>
            <IconButton className="small-btn primary" onClick={() => void setOpenTemplate(true)}><PlusIcon size={25} /></IconButton>
          </div>
        )}
      </ListTableHeader>
      {!!openTemplate && (
        <FieldDialog
          defaultData
          title={t('customForms.newField')}
          open={!!openTemplate}
          onClose={() => { setOpenTemplate(false); }}
        />
      )}
    </>
  );
};

export default memo(HeaderTable);
