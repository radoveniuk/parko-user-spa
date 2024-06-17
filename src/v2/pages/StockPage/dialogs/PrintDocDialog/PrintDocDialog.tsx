import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { useSnackbar } from 'notistack';
import Button from 'v2/uikit/Button';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogProps } from 'v2/uikit/Dialog';
import IconButton from 'v2/uikit/IconButton';

import { useDownloadPrintedTemplate } from 'api/mutations/docsTemplateMutation';
import { useGetDocsTemplateCategories } from 'api/query/docsTemplateCategoryQuery';
import { useGetDocsTemplates } from 'api/query/docsTemplateQuery';
import { ArrowBackIcon, CategoryIcon, FileIcon, NonCategoryIcon } from 'components/icons';
import { getDateFromIso } from 'helpers/datetime';
import useListState from 'hooks/useListState';
import { IDocsTemplate } from 'interfaces/docsTemplate.interface';
import { IDocsTemplateCategory } from 'interfaces/docsTemplateCategory.interface';
import { IFile } from 'interfaces/file.interface';
import { IPropertyMovement } from 'interfaces/propertyMovement.interface';

import { DialogContentWrapper, PrintDocDialogActions } from './styles';

type Props = DialogProps & {
  movements: IPropertyMovement<true>[];
}

const PrintDocDialog = ({ movements, onClose, ...rest }: Props) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { data: docsTemplates = [] } = useGetDocsTemplates();
  const downloadDoc = useDownloadPrintedTemplate();
  const [selectedTemplates, { toggle }] = useListState<IDocsTemplate>();
  const { data: docCategories = [] } = useGetDocsTemplateCategories();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Signature date
  const [signatureDate, setSignatureDate] = useState(DateTime.now().toISODate());

  const downloadHandler = () => {
    if (!movements.length || !selectedTemplates.length) {
      enqueueSnackbar(t('docsTemplates.selectEmploymentsError'), { variant: 'warning' });
    }
    onClose();
    const getFileData = (movement: IPropertyMovement<true>) => ({
      movement_project: movement.project?.name,
      movement_client: movement.client?.shortName,
      movement_property: movement.property.internalName,
      movement_userFullname: movement.userFullname,
      movement_userCooperationStartDate: movement.userCooperationStartDate,
      movement_userCooperationEndDate: movement.userCooperationEndDate,
      movement_damageCompencationPrice: movement.damageCompencationPrice,
      movement_recorder: movement.recorder.fullname,
      movement_userCooperationType: movement.userWorkTypes.toString(),
      movement_contractor: movement.contractor,
      movement_count: movement.count,
      movement_date: getDateFromIso(movement.date),
      movement_type: t(`selects.propertyMovementType.${movement.type}`),
    });
    if (movements.length === 1 && selectedTemplates.length === 1) {
      const name = `${movements[0].property.internalName}_${movements[0].userFullname}_${getDateFromIso(movements[0].date)}`;
      downloadDoc(
        {
          fileData: getFileData(movements[0]),
          fileId: (selectedTemplates[0].file as IFile)._id,
          signatureDate: getDateFromIso(signatureDate),
        },
        `${selectedTemplates[0].name}_${name}.docx`,
      );
    } else {
      downloadDoc({
        fileData: movements.map(getFileData),
        fileId: selectedTemplates.map((item) => (item.file as IFile)._id as string),
      });
    }
  };

  return (
    <Dialog onClose={onClose} title={t('docsTemplates.print')} maxWidth={false} mobileFullscreen {...rest}>
      <DialogContentWrapper>
        <div className="userSettings">
          {movements.map((item) => (
            <div className="userCard" key={item._id}>
              {t(`selects.propertyMovementType.${item.type}`)}, {item.property.internalName} ({item.count}) &gt; {item.userFullname}
              <br/>
              {getDateFromIso(item.date)}
            </div>
          ))}
        </div>
        {!selectedCategory && (
          <div className="docSettings categories">
            {docCategories.map((category) => (
              <div
                title={category.name}
                className="card"
                key={category._id}
                role="button"
                onClick={() => void setSelectedCategory(category._id as string)}
              >
                <CategoryIcon size={24} />
                <div className="text">{category.name}</div>
              </div>
            ))}
            <div
              title={t('docsTemplates.docsWithoutCategory')}
              className="card"
              role="button"
              onClick={() => void setSelectedCategory('other')}
            >
              <NonCategoryIcon size={24} />
              <div className="text">{t('docsTemplates.docsWithoutCategory')}</div>
            </div>
          </div>
        )}
        {!!selectedCategory && selectedCategory !== 'other' && (
          <div>
            <div className="docSettings categories">
              <IconButton onClick={() => void setSelectedCategory(null)}><ArrowBackIcon /></IconButton>
              <div
                className="card active"
                role="button"
              >
                <CategoryIcon size={24} />
                <div className="text">{docCategories.find((category) => category._id === selectedCategory)?.name}</div>
              </div>
            </div>
            <div className="docSettings">
              {docsTemplates
                .filter((template) => (template?.category as IDocsTemplateCategory)?._id === selectedCategory)
                .map((template) => (
                  <div
                    title={template.name}
                    className={`card ${selectedTemplates.some(selectedTemplate => selectedTemplate._id === template._id) ? 'active' : ''}`}
                    key={template._id}
                    role="button"
                    onClick={() => void toggle(template)}
                  >
                    <FileIcon size={24} />
                    <div className="text">{template.name}</div>
                  </div>
                ))}
            </div>
          </div>
        )}
        {selectedCategory === 'other' && (
          <div>
            <div className="docSettings categories">
              <IconButton onClick={() => void setSelectedCategory(null)}><ArrowBackIcon /></IconButton>
              <div
                className="card active"
                role="button"
              >
                <NonCategoryIcon size={24} />
                <div className="text">{t('docsTemplates.docsWithoutCategory')}</div>
              </div>
            </div>
            <div className="docSettings">
              {docsTemplates
                .filter((template) => !template?.category)
                .map((template) => (
                  <div
                    title={template.name}
                    className={`card ${selectedTemplates.some(selectedTemplate => selectedTemplate._id === template._id) ? 'active' : ''}`}
                    key={template._id}
                    role="button"
                    onClick={() => void toggle(template)}
                  >
                    <FileIcon size={24} />
                    <div className="text">{template.name}</div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </DialogContentWrapper>
      <PrintDocDialogActions>
        <DatePicker
          className="signDatepicker"
          defaultValue={signatureDate}
          inputProps={{ theme: 'gray' }}
          label={t('docsTemplates.signDate')}
          onChange={(v: string) => {
            setSignatureDate(v);
          }}
          views={['day']}
        />
        <Button
          disabled={!selectedTemplates.length}
          variant="contained"
          onClick={downloadHandler}
        >
          {t('docsTemplates.print')} ({selectedTemplates.length})
        </Button>
      </PrintDocDialogActions>
    </Dialog>
  );
};

export default PrintDocDialog;
