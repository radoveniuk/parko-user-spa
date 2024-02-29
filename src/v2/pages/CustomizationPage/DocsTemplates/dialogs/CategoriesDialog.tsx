import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import { Button, Input } from 'v2/uikit';
import Dialog, { DialogProps } from 'v2/uikit/Dialog';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';

import { useCreateDocsTemplateCategory, useDeleteDocsTemplateCategory } from 'api/mutations/docsTemplateCategoryMutation';
import { useGetDocsTemplateCategories } from 'api/query/docsTemplateCategoryQuery';
import { CategoryIcon, DeleteIcon } from 'components/icons';
import { getDateFromIso } from 'helpers/datetime';

import { CategoriesWrapper } from './styles';

export const CategoriesDialog = (props: DialogProps) => {
  const { t } = useTranslation();
  const [categoryName, setCategoryName] = useState('');

  const { data = [] } = useGetDocsTemplateCategories();
  const createCategoryMutation = useCreateDocsTemplateCategory();
  const deleteCategoryMutation = useDeleteDocsTemplateCategory();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const queryKey = ['docsTemplatesCategories', JSON.stringify({})];

  const createCategory = async () => {
    if (data.some(categoryItem => categoryItem.name === categoryName)) {
      enqueueSnackbar(t('docsTemplates.categoryNameError'), { variant: 'warning' });
      return;
    }
    const response = await createCategoryMutation.mutateAsync({ name: categoryName });
    setCategoryName('');
    queryClient.setQueryData(queryKey, [...data, response]);
  };

  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const deleteCategory = () => {
    if (!categoryToDelete) return;
    deleteCategoryMutation.mutate(categoryToDelete);
    queryClient.setQueryData(queryKey, data.filter(item => item._id !== categoryToDelete));
    setCategoryToDelete(null);
  };

  return (
    <>
      <Dialog {...props} title={t('docsTemplates.categories')} mobileFullscreen>
        <CategoriesWrapper>
          <div className="form">
            <Input
              theme="gray"
              value={categoryName}
              onChange={(e) => void setCategoryName(e.target.value)}
              label={t('docsTemplates.newCategory')}
              placeholder={t('docsTemplates.categoryName')}
            />
            <Button disabled={!categoryName} variant="outlined" onClick={createCategory}>{t('docsTemplates.create')}</Button>
          </div>
          <div className="categories">
            {data.map((category) => (
              <div className="category" key={category._id}>
                <CategoryIcon size={20} />
                <div className="name">{category.name}</div>
                <div className="date">{getDateFromIso(category.createdAt)}</div>
                <IconButton onClick={() => void setCategoryToDelete(category._id as string)}><DeleteIcon size={14} /></IconButton>
              </div>
            ))}
          </div>
        </CategoriesWrapper>
      </Dialog>
      {!!categoryToDelete && (
        <DialogConfirm
          onSubmit={deleteCategory}
          onClose={() => void setCategoryToDelete(null)}
          open={!!categoryToDelete}
        />
      )}
    </>
  );
};
