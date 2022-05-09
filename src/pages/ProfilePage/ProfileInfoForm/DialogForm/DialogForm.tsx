import { CloseIcon, PlusIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Dialog from 'components/shared/Dialog';
import IconButton from 'components/shared/IconButton';
import Input from 'components/shared/Input';
import createId from 'helpers/createId';
import React, { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import { ActionsWrapper, LabelWrapper, RowWrapper } from './styles';

interface NumberFormatProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const DateFormat = forwardRef<NumberFormat<string>, NumberFormatProps>(
  function NumberFormatCustom (props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        format="##.##.####"
      />
    );
  },
);

type Props = {
  defaultValueJson?: string;
  label: string;
  onChange: (value: string) => void;
};

type Row = {
  id: string;
  name: string;
  surname: string;
  birthdate: string;
}

const createRow = (): Row => ({
  id: createId(),
  name: '',
  surname: '',
  birthdate: '',
});

const DialogForm = ({ defaultValueJson, onChange, label }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>(defaultValueJson ? JSON.parse(defaultValueJson)?.rows : []);

  const addRow = () => {
    setRows((prevRows) => [...prevRows, createRow()]);
  };

  const removeRow = (id: string) => {
    setRows((prevRows) => prevRows.filter(row => row.id !== id));
  };

  const updateRow = (id: string, fieldName: keyof Row, value: string) => {
    setRows((prevRows) => prevRows.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          [fieldName]: value,
        };
      }
      return row;
    }));
  };

  const saveChanges = () => {
    onChange(JSON.stringify({ rows }));
    setOpen(false);
  };

  return (
    <>
      <LabelWrapper>
        <p className="input-label">{label}</p>
        <Button onClick={() => void setOpen(true)}>{t('user.openForm')}</Button>
      </LabelWrapper>
      <Dialog open={open} onClose={() => void setOpen(false)} title={label}>
        {rows.map(({ id, name, surname, birthdate }) => (
          <RowWrapper key={id}>
            <Input
              variant="standard"
              value={name}
              label={t('user.name')}
              onChange={({ target }) => void updateRow(id, 'name', target.value)}
            />
            <Input
              variant="standard"
              value={surname}
              label={t('user.surname')}
              onChange={({ target }) => void updateRow(id, 'surname', target.value)}
            />
            <Input
              variant="standard"
              value={birthdate}
              label={t('user.birthDate')}
              placeholder="DD.MM.YYYY"
              onChange={({ target }) => void updateRow(id, 'birthdate', target.value)}
              InputProps={{
                inputComponent: DateFormat as any,
              }}
            />
            <IconButton className="remove-row-button" onClick={() => void removeRow(id)}>
              <CloseIcon size={24} />
            </IconButton>
          </RowWrapper>
        ))}
        <ActionsWrapper>
          <Button variant="outlined" onClick={addRow}><PlusIcon size={24} /></Button>
          <Button variant="outlined" color="success" onClick={saveChanges}>OK</Button>
        </ActionsWrapper>
      </Dialog>
    </>
  );
};

export default DialogForm;
