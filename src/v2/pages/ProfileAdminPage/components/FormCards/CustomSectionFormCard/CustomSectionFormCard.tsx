import React, { memo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from 'v2/uikit';
import { FormCard, FormCardBody, FormCardBodyRow, FormCardHeader } from 'v2/uikit/FormCard';

import CustomField from 'components/complex/CustomField';
import { FormIcon } from 'components/icons';
import createId from 'helpers/createId';
import { ICustomFormFieldSectionBinding, ICustomFormSection } from 'interfaces/form.interface';

type UserCustomFieldsInfo = Record<string, any>;

type Props = {
  sectionData: ICustomFormSection;
  sectionFieldsData: ICustomFormFieldSectionBinding<true>[];
  data: UserCustomFieldsInfo;
  onUpdate?(value: UserCustomFieldsInfo): void;
};

const CustomSectionFormCard = ({ data, sectionData, sectionFieldsData, onUpdate }: Props) => {
  const { t, i18n } = useTranslation();
  const { handleSubmit, reset, control } = useForm<UserCustomFieldsInfo>({ defaultValues: data.customFields });

  const submitHandler = (values: UserCustomFieldsInfo) => {
    onUpdate?.(values);
  };

  const [cardKey, setCardKey] = useState(createId());

  return (
    <FormCard
      defaultConfig={{ disabled: true }}
      onOutsideClick={({ warn }) => { warn(); }}
      onReset={() => { setCardKey(createId()); reset(); }}
      key={cardKey}
    >
      {({ formCardConfig, updateFormCardConfig }) => (
        <>
          <FormCardHeader icon={<FormIcon size={24} />} title={sectionData.names[i18n.language]}>
            {formCardConfig.disabled && <Button onClick={() => void updateFormCardConfig({ disabled: false })}>{t('edit')}</Button>}
            {!formCardConfig.disabled && (
              <Button
                color="error"
                onClick={() => {
                  handleSubmit((values) => {
                    submitHandler(values);
                    updateFormCardConfig({ disabled: true });
                  })();
                }}
              >
                {t('save')}
              </Button>)}
          </FormCardHeader>
          <FormCardBody>
            <FormCardBodyRow>
              {sectionFieldsData
                .map((customFieldBinding) => (
                  <Controller
                    key={customFieldBinding._id}
                    name={customFieldBinding._id}
                    rules={{ required: customFieldBinding.isRequired }}
                    control={control}
                    defaultValue={data?.[customFieldBinding._id as string]}
                    render={({ field, fieldState }) => (
                      <CustomField
                        value={field.value}
                        onChange={field.onChange}
                        metadata={customFieldBinding.field}
                        theme="gray"
                        disabled={formCardConfig.disabled}
                        error={!!fieldState.error}
                      />
                    )}
                  />
                ))
              }
            </FormCardBodyRow>
          </FormCardBody>
        </>
      )}
    </FormCard>
  );
};

export default memo(CustomSectionFormCard);
