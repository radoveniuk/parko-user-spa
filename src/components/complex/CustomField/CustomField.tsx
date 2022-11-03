import React from 'react';
import { useTranslation } from 'react-i18next';

import BooleanSelect from 'components/shared/BooleanSelect';
import DatePicker from 'components/shared/DatePicker';
import Input from 'components/shared/Input';
import PhoneInput from 'components/shared/PhoneInput';
import { ICustomFormField } from 'interfaces/form.interface';

type CustomFieldProps = {
  value: unknown;
  onChange(v: unknown): void;
  metadata: ICustomFormField;
};

const CustomField = ({ value, onChange, metadata }: CustomFieldProps) => {
  const { i18n } = useTranslation();
  const { type } = metadata;

  const textChange = (e: any) => void onChange(e.target.value);

  if (type === 'string') return <Input value={value} onChange={textChange} label={metadata.names[i18n.language]} />;

  if (type === 'number') return <Input value={value} onChange={textChange} label={metadata.names[i18n.language]} type="number" />;

  if (type === 'phone') return <PhoneInput value={value as string || ''} onChange={onChange} label={metadata.names[i18n.language]} />;

  if (type === 'boolean') {
    return (
      <BooleanSelect
        defaultValue={typeof value === 'boolean' ? value : undefined}
        onChange={onChange}
        label={metadata.names[i18n.language]}
      />
    );
  }

  if (type === 'date') return <DatePicker value={value as string || ''} onChange={onChange} label={metadata.names[i18n.language]} />;

  return null;
};

export default CustomField;
