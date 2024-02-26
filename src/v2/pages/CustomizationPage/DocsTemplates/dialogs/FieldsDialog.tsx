import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog, { DialogProps } from 'v2/uikit/Dialog';
import IconButton from 'v2/uikit/IconButton';

// import { useGetCustomFormFields } from 'api/query/customFormsQuery';
import { CopyIcon } from 'components/icons';
import { EXPORT_USER_FIELDS } from 'constants/userCsv';

import { FieldCodesGrid } from './styles';

export const FieldsDialog = ({ ...rest }: DialogProps) => {
  const { t } = useTranslation();
  // const { data: customFields = [] } = useGetCustomFormFields({ entity: 'user' });
  return (
    <Dialog {...rest} mobileFullscreen>
      <FieldCodesGrid>
        {EXPORT_USER_FIELDS.map((field) => (
          <div className="code" key={field}>
            <div className="name">
              {t(`user.${field}`)}
              <IconButton
                onClick={() => void navigator.clipboard.writeText(`{${field}}`)}
              >
                <CopyIcon size={14} />
              </IconButton>
            </div>
            <div className="value">
              &#123;{field}&#125;
            </div>
          </div>
        ))}
      </FieldCodesGrid>
      {/* <ListTable columns={['docsTemplates.fieldName', 'docsTemplates.fieldCode']}> */}

      {/* {customFields.map((customField) => (
          <ListTableRow key={customField._id}>
            <ListTableCell>{customField.names[i18n.language]}</ListTableCell>
            <ListTableCell>
              <IconButton
                onClick={() => void navigator.clipboard.writeText(`{_${customField.names.en}}`)}
              >
                <CopyIcon />
              </IconButton>
              &#123;_{customField.names.en}&#125;
            </ListTableCell>
          </ListTableRow>
        ))} */}
      {/* </ListTable> */}
    </Dialog>
  );
};
