import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { FileIcon } from 'components/icons';

import Button from '../Button';
import ButtonGroup from '../ButtonGroup';
import DatePicker from '../DatePicker';
import Input from '../Input';
import Select from '../Select';

import { FormCard, FormCardBody, FormCardBodyRow, FormCardHeader } from './FormCard';

const meta: Meta<typeof FormCard> = {
  component: FormCard,
};

export default meta;

type Story = StoryObj<typeof FormCard>;

export const Example: Story = {
  render: () => (
    <FormCard defaultConfig={{ disabled: true }} style={{ maxWidth: 500 }}>
      {({ formCardConfig, updateFormCardConfig }) => (
        <>
          <FormCardHeader icon={<FileIcon size={20} />} title="Info">
            {formCardConfig.disabled && <Button onClick={() => void updateFormCardConfig({ disabled: false })}>Edit</Button>}
            {!formCardConfig.disabled && <Button color="error" onClick={() => void updateFormCardConfig({ disabled: true })}>Update</Button>}
          </FormCardHeader>
          <FormCardBody>
            <FormCardBodyRow>
              <Input disabled={!!formCardConfig.disabled} theme="gray" label="Name" />
              <Input disabled={!!formCardConfig.disabled} theme="gray" label="Surname" />
              <DatePicker disabled={!!formCardConfig.disabled} inputProps={{ theme: 'gray' }} label="Birthdate" onChange={() => undefined} />
              <ButtonGroup
                disabled={!!formCardConfig.disabled}
                value="Autofil"
                options={[{ value: 'Autofil', label: 'Autofil' }, { value: 'Save', label: 'Save' }]}
              />
              <Select theme="gray" disabled={!!formCardConfig.disabled} label="Select" />
            </FormCardBodyRow>
          </FormCardBody>
        </>
      )}
    </FormCard>
  ),
};
