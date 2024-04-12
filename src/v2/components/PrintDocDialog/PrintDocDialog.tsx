import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import set from 'lodash-es/set';
import { DateTime } from 'luxon';
import { useSnackbar } from 'notistack';
import { Input } from 'v2/uikit';
import Button from 'v2/uikit/Button';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogProps } from 'v2/uikit/Dialog';
import IconButton from 'v2/uikit/IconButton';
import Select from 'v2/uikit/Select';

import { useDownloadPrintedTemplate } from 'api/mutations/docsTemplateMutation';
import { useGetDocsTemplateCategories } from 'api/query/docsTemplateCategoryQuery';
import { useGetDocsTemplates } from 'api/query/docsTemplateQuery';
import { useGetEmployments } from 'api/query/employmentQuery';
import { ArrowBackIcon, CategoryIcon, FileIcon, NonCategoryIcon } from 'components/icons';
import { getDateFromIso } from 'helpers/datetime';
import useListState from 'hooks/useListState';
import { IClient } from 'interfaces/client.interface';
import { IDocsTemplate } from 'interfaces/docsTemplate.interface';
import { IDocsTemplateCategory } from 'interfaces/docsTemplateCategory.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import { DialogContentWrapper, PrintDocDialogActions } from './styles';

type Props = DialogProps & {
  users: Pick<IUser, '_id' | 'name' | 'surname' | 'fullname'>[];
}

const PrintDocDialog = ({ users, onClose, ...rest }: Props) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { data: docsTemplates = [] } = useGetDocsTemplates();
  const downloadDoc = useDownloadPrintedTemplate();
  const [selectedTemplates, { toggle }] = useListState<IDocsTemplate>();
  const { data: employments = [] } = useGetEmployments({ user: users.map(item => item._id).toString() });
  const { data: docCategories = [] } = useGetDocsTemplateCategories();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [userEmploymentMap, setUserEmploymentMap] = useState<Record<string, string>>({});

  // Signature date
  const [signatureDate, setSignatureDate] = useState(DateTime.now().toISODate());

  useEffect(() => {
    if (employments.length) {
      const map: Record<string, string> = {};
      users.forEach((user) => {
        const userEmployments = employments.filter((employment) => employment.user._id === user._id);
        set(map, user._id, userEmployments.length > 1 ? null : userEmployments?.[0]?._id || null);
      });
      setUserEmploymentMap(map);
    }
  }, [employments, users]);

  const downloadHandler = () => {
    if (!users.length || !selectedTemplates.length) {
      enqueueSnackbar(t('docsTemplates.selectEmploymentsError'), { variant: 'warning' });
    }
    onClose();
    if (users.length === 1 && selectedTemplates.length === 1) {
      const name = users[0].fullname ? users[0].fullname?.replace(' ', '_') : `${users[0].name}_${users[0].surname}`;
      downloadDoc(
        {
          userId: users.map((user) => user._id),
          templateId: selectedTemplates.map((item) => item._id as string),
          employmentId: Object.values(userEmploymentMap),
          signatureDate: getDateFromIso(signatureDate),
        },
        `${selectedTemplates[0].name}_${name}.docx`,
      );
    } else {
      downloadDoc({
        userId: users.map((user) => user._id),
        templateId: selectedTemplates.map((item) => item._id as string),
        employmentId: Object.values(userEmploymentMap),
        signatureDate: getDateFromIso(signatureDate),
      });
    }
  };

  return (
    <Dialog onClose={onClose} title={t('docsTemplates.print')} maxWidth={false} mobileFullscreen {...rest}>
      <DialogContentWrapper>
        <div className="userSettings">
          {users.map((item) => (
            <div className="userCard" key={item._id}>
              <Input
                label={t('profile')}
                value={!item.fullname ? `${item.name} ${item.surname}` : item.fullname}
                disabled
              />
              <Select
                label={t('user.cooperation')}
                options={employments.filter(employment => employment.user._id === item._id && employment.project && employment.positionId)}
                valuePath="_id"
                value={userEmploymentMap?.[item?._id]}
                onChange={(e) => {
                  setUserEmploymentMap((prev) => ({
                    ...prev,
                    [item._id]: e.target.value as string,
                  }));
                }}
                labelPath={(employment) => {
                  const project = employment.project as IProject;
                  const client = project?.client as IClient;
                  const position = project?.positions?.find(position => position.matterId === employment.positionId);
                  // eslint-disable-next-line max-len
                  return `${client?.name} > ${project?.name} > ${position?.name} ${getDateFromIso(employment.hireDate) || ''} - ${getDateFromIso(employment.fireDate || '')}`;
                }}
              />
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
