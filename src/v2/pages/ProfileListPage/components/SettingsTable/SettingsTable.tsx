import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Button } from 'v2/uikit';

import { CloseIcon } from 'components/icons';
import Checkbox from 'components/shared/Checkbox';
import IconButton from 'components/shared/IconButton';
import { EXPORT_USER_FIELDS } from 'constants/userCsv';
import { ICustomFormField } from 'interfaces/form.interface';

import { ColsSettingsWrapper } from './styles';

const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const COLS_TO_SETTINGS = EXPORT_USER_FIELDS.filter((item) => !['name', 'surname'].includes(item)).map((col) => `user.${col}`);

const DEFAULT_COLS = [
  'user.email',
];

type Props = {
  customFields: ICustomFormField[],
  activeCols: string[],
  setActiveCols: React.Dispatch<React.SetStateAction<string[]>>,
  open: boolean,
  onClose: () => void
};

const SettingsTable = ({ customFields, activeCols, setActiveCols, open, onClose }: Props) => {
  const { t, i18n } = useTranslation();

  const customColumns = useMemo(() => customFields.map((customField) => customField.names[i18n.language]), [customFields, i18n.language]);

  return (
    <Dialog
      fullScreen
      style={{ width: 500, marginLeft: 'auto' }}
      maxWidth="md"
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <ColsSettingsWrapper>
        <div className="toolbar">
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <div className="title">
            {t('cols')}
          </div>
          <Button color="inherit" className="save-btn" autoFocus onClick={onClose}>OK</Button>
        </div>
        <div className="cols">
          <Checkbox
            title={t('selectAll')}
            checked={activeCols.length === COLS_TO_SETTINGS.length + customColumns.length}
            onChange={(e) =>
              void setActiveCols(() => {
                if (e.target.checked) {
                  return [
                    ...COLS_TO_SETTINGS,
                    ...customFields.map((customField: any) => customField._id),
                  ];
                } else {
                  return DEFAULT_COLS;
                }
              })
            }
          />
          <div/>
          {COLS_TO_SETTINGS.map(field => (
            <Checkbox
              key={field}
              title={t(field)}
              checked={activeCols.includes(field)}
              onChange={e => {
                setActiveCols((prev: any) => {
                  if (e.target.checked) {
                    return [...prev, field];
                  } else {
                    return prev.filter((item: any) => item !== field);
                  }
                });
              }
              }
            />
          ))}
          {customFields.map((field: any) => (
            <Checkbox
              key={field._id}
              title={field.names[i18n.language]}
              checked={activeCols.includes(field._id)}
              onChange={e =>
                void setActiveCols((prev: any) => {
                  if (e.target.checked) {
                    return [...prev, field._id];
                  } else {
                    return prev.filter((item: any) => item !== field._id);
                  }
                })
              }
            />
          ))}
        </div>
      </ColsSettingsWrapper>
    </Dialog>
  );
};

export default memo(SettingsTable);
