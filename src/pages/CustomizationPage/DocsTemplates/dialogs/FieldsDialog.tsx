import React from 'react';
import { useTranslation } from 'react-i18next';

import { useGetCustomFormFields } from 'api/query/customFormsQuery';
import { CopyIcon } from 'components/icons';
import Dialog, { DialogProps } from 'components/shared/Dialog';
import IconButton from 'components/shared/IconButton';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { IMPORTABLE_USER_FIELDS } from 'constants/userCsv';

export const FieldsDialog = ({ ...rest }: DialogProps) => {
  const { t, i18n } = useTranslation();
  const { data: customFields = [] } = useGetCustomFormFields({ entity: 'user' });
  return (
    <Dialog {...rest}>
      <ListTable columns={['docsTemplates.fieldName', 'docsTemplates.fieldCode']}>
        {IMPORTABLE_USER_FIELDS.map((field) => (
          <ListTableRow key={field}>
            <ListTableCell>{t(`user.${field}`)}</ListTableCell>
            <ListTableCell>
              <IconButton
                onClick={() => void navigator.clipboard.writeText(field)}
              >
                <CopyIcon />
              </IconButton>
              {field}
            </ListTableCell>
          </ListTableRow>
        ))}
        {customFields.map((customField) => (
          <ListTableRow key={customField._id}>
            <ListTableCell>{customField.names[i18n.language]}</ListTableCell>
            <ListTableCell>
              <IconButton
                onClick={() => void navigator.clipboard.writeText(`_${customField.names.en}`)}
              >
                <CopyIcon />
              </IconButton>
              _{customField.names.en}
            </ListTableCell>
          </ListTableRow>
        ))}
      </ListTable>
    </Dialog>
  );
};
