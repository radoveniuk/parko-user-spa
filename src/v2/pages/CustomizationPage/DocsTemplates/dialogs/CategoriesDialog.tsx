import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import Dialog, { DialogProps } from 'v2/uikit/Dialog';
import IconButton from 'v2/uikit/IconButton';

import { useGetDocsTemplateCategories } from 'api/query/docsTemplateCategoryQuery';
import { CategoryIcon, DeleteIcon, FileIcon } from 'components/icons';

import { CategoriesWrapper } from './styles';

export const CategoriesDialog = ({ ...rest }: DialogProps) => {
  const { t } = useTranslation();
  const [categoryName, setCategoryName] = useState('');

  const { data = [] } = useGetDocsTemplateCategories();

  return (
    <Dialog {...rest} title={t('docsTemplates.categories')} mobileFullscreen>
      <CategoriesWrapper>
        <div className="form">
          <Input theme="gray" value={categoryName} onChange={(e) => void setCategoryName(e.target.value)} label={t('name')} />
          <Button variant="outlined">{t('create')}</Button>
        </div>
        <div className="grid">
          <div className="category">
            <CategoryIcon size={20} />
            <div className="name">namenamenamenamenamenamename</div>
            <div className="date">26.02.2023</div>
            <IconButton><DeleteIcon size={14} /></IconButton>
          </div>
        </div>
      </CategoriesWrapper>
    </Dialog>
  );
};
