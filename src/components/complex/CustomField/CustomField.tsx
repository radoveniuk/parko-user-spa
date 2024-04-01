import React from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from 'v2/uikit/Autocomplete';
import DatePicker from 'v2/uikit/DatePicker';
import Input from 'v2/uikit/Input';
import PhoneInput from 'v2/uikit/PhoneInput';
import Select from 'v2/uikit/Select';

import BooleanSelect from 'components/shared/BooleanSelect';
import { ICustomFormField } from 'interfaces/form.interface';

import WorkExpirienceForm from './WorkExpirienceForm';

type CustomFieldProps = {
  value: any;
  onChange(v: any): void;
  metadata: ICustomFormField;
  theme?: 'gray' | 'white';
  disabled?: boolean;
  error?: boolean;
  label?: string;
  variant?: 'standard' | 'outlined';
};

const CustomField = ({ value, onChange, metadata, theme, variant, ...rest }: CustomFieldProps) => {
  const { i18n } = useTranslation();
  const { type } = metadata;

  const textChange = (e: any) => void onChange(e.target.value);

  if (type === 'textarea') {
    return (
      <Input value={value} onChange={textChange} label={metadata.names[i18n.language]} theme={theme} multiline className="fullwidth" {...rest} />
    );
  }
  if (type === 'number') {
    return (
      <Input value={value} onChange={textChange} label={metadata.names[i18n.language]} type="number" theme={theme} variant={variant} {...rest} />
    );
  }

  if (type === 'phone') {
    return (
      <PhoneInput value={value as string || ''} onChange={onChange} label={metadata.names[i18n.language]} theme={theme} variant={variant} {...rest} />
    );
  }

  if (type === 'boolean') {
    return (
      <BooleanSelect
        defaultValue={typeof value === 'boolean' ? value : undefined}
        onChange={onChange}
        label={metadata.names[i18n.language]}
        theme={theme}
        {...rest}
      />
    );
  }

  if (type === 'date') {
    return (
      <DatePicker
        defaultValue={value as string || ''}
        onChange={onChange}
        label={metadata.names[i18n.language]}
        inputProps={{ theme, variant }}
        {...rest}
      />
    );
  }

  if (type === 'select') {
    return (
      <Select
        value={value as string || ''}
        options={metadata.options || []}
        onChange={onChange}
        label={metadata.names[i18n.language]}
        theme={theme}
        {...rest}
      />
    );
  }

  if (type === 'multiselect') {
    return (
      <Autocomplete
        multiple
        value={Array.isArray(value) ? value : []}
        options={metadata.options.map(item => ({ value: item, label: item })) || []}
        onChange={onChange}
        label={metadata.names[i18n.language]}
        theme={theme}
        labelKey="label"
        valueKey="value"
        limitTags={1}
        {...rest}
      />
    );
  }

  if (type === 'expirience') {
    return (
      <WorkExpirienceForm defaultValues={value} error={!!rest.error} disabled={rest.disabled} onChange={onChange} />
    );
  }

  return <Input value={value} onChange={textChange} label={metadata.names[i18n.language]} theme={theme} {...rest} />;
};

export default CustomField;
