import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import ButtonGroup from 'v2/uikit/ButtonGroup';
import { FormCard, FormCardBody, FormCardBodyRow, FormCardHeader } from 'v2/uikit/FormCard';
import IconButton from 'v2/uikit/IconButton';
import Loader from 'v2/uikit/Loader';
import LoaderCircular from 'v2/uikit/LoaderCircular';
import Select from 'v2/uikit/Select';

import api from 'api/common';
import { useGetCorporateBodies } from 'api/query/corporateBodyQuery';
import { SearchIcon, UserIcon } from 'components/icons';
import { CORPORATE_BODY_STATUS } from 'constants/selectsOptions';
import useOutsideClick from 'hooks/useOutsideClick';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { ICorporateBody } from 'interfaces/corporateBody.interface';
import { IUser } from 'interfaces/users.interface';

import { CorporateBodiesDropdown, CorporateBodiesSearchField, InputLoaderWrapper, LoaderWrapper } from './styles';

type Data = Pick<IUser, 'ICO' | 'businessName' | 'DIC' | 'adress' |
 'permitAdress' | 'businessStatus' | 'permitDepartment' | 'permitNumber' | 'name' | 'surname'>

type Props = {
  data?: Data;
  onChange?(values: Data): void;
};

const BusinessInfoFormCard = ({ data, onChange }: Props) => {
  const { t } = useTranslation();
  const corporateBodyStatusOption = useTranslatedSelect(CORPORATE_BODY_STATUS, 'corporateBodyStatus');

  const { register, reset, control, handleSubmit } = useForm<Data>({ defaultValues: data });

  const [searchConfig, setSearchConfig] = useState({
    phrase: !data?.businessName ? `${data?.name || ''} ${data?.surname || ''}`.trim() : data.businessName,
    needToFetch: true,
  });

  const {
    data: corporateBodiesResult = [],
    refetch: refetchCorporateBodies,
    isFetching: isFetchingCorporateBodies,
  } = useGetCorporateBodies(searchConfig.phrase, { enabled: false });

  const fetchResults = useCallback(() => {
    if (searchConfig.phrase.length >= 3 && searchConfig.needToFetch) {
      refetchCorporateBodies();
    }
  }, [searchConfig, refetchCorporateBodies]);

  const [openSearchMenu, setOpenSearchMenu] = useState(false);
  const searchFieldRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useOutsideClick(searchFieldRef, () => { setOpenSearchMenu(false); });

  useEffect(() => {
    if (corporateBodiesResult.length && !isFetchingCorporateBodies) {
      setOpenSearchMenu(true);
    }
  }, [corporateBodiesResult, isFetchingCorporateBodies]);

  const selectCorporateBody = async (portalId: string) => {
    setOpenSearchMenu(false);
    const result = await api.get(`/api/corporate-bodies/${portalId}`).then(res => res.data.data as Required<ICorporateBody>);
    reset({
      ICO: result.cin,
      businessName: result.companyName,
      // DIC: '',
      adress: result.address,
      permitAdress: result.businessAddress,
      businessStatus: result.status,
      permitDepartment: result.register,
      permitNumber: result.registerNumber,
    });
  };

  const submitHandler: SubmitHandler<Data> = (values) => {
    onChange?.(values);
  };

  return (
    <FormCard defaultConfig={{ disabled: true, loading: false }}>
      {({ formCardConfig, updateFormCardConfig }) => (
        <>
          {formCardConfig.loading && <LoaderWrapper><Loader /></LoaderWrapper>}
          <FormCardHeader icon={<UserIcon size={24} />} title={t('user.businessFields')}>
            {formCardConfig.disabled && (
              <Button onClick={() => void updateFormCardConfig({ disabled: false })}>{t('edit')}</Button>
            )}
            {!formCardConfig.disabled && (
              <Button
                color="error"
                onClick={() => {
                  handleSubmit(submitHandler)();
                  updateFormCardConfig({ disabled: true });
                }}
              >
                {t('save')}
              </Button>)}
          </FormCardHeader>
          <FormCardBody>
            <FormCardBodyRow>
              <CorporateBodiesSearchField ref={searchFieldRef}>
                <Input
                  ref={searchInputRef}
                  label="Obchodné meno / IČO"
                  theme="gray"
                  disabled={!formCardConfig.disabled || formCardConfig.loading}
                  value={searchConfig.phrase}
                  onChange={(e) => void setSearchConfig((prev) => ({ ...prev, phrase: e.target.value, needToFetch: true }))}
                  onClick={() => void setOpenSearchMenu(!!corporateBodiesResult.length && !isFetchingCorporateBodies)}
                  InputProps={{
                    endAdornment: isFetchingCorporateBodies
                      ? <InputLoaderWrapper><LoaderCircular size={20} /></InputLoaderWrapper>
                      : <IconButton onClick={fetchResults}><SearchIcon size={18} /></IconButton>,
                  }}
                />
                {openSearchMenu && (
                  <CorporateBodiesDropdown>
                    {corporateBodiesResult.map((corporateBodyItem) => (
                      <li
                        key={corporateBodyItem.cin}
                        role="button"
                        onClick={() => {
                          updateFormCardConfig({ loading: true });
                          setSearchConfig((prev) => ({ ...prev, phrase: corporateBodyItem.companyName, needToFetch: false }));
                          selectCorporateBody(corporateBodyItem.portalId).then(() => void updateFormCardConfig({ loading: false }));
                        }}
                      >
                        <div className="title">
                          <div>{corporateBodyItem.companyName}</div>
                          <div>IČO: {corporateBodyItem.cin}</div>
                        </div>
                        <div className="address">
                          {corporateBodyItem.businessAddress}
                        </div>
                      </li>
                    ))}
                  </CorporateBodiesDropdown>
                )}
              </CorporateBodiesSearchField>
              <ButtonGroup
                value="autofill"
                disabled={!formCardConfig.disabled || formCardConfig.loading}
                options={[{ value: 'autofill', label: 'Autofill' }, { value: 'save', label: 'Save' }]}
              />
              <Input
                label="Obchodné meno"
                theme="gray"
                disabled={formCardConfig.disabled || formCardConfig.loading}
                {...register('businessName')}
              />
              <Controller
                control={control}
                name="businessStatus"
                render={({ field }) => (
                  <Select
                    label={t('user.businessStatus')}
                    theme="gray"
                    disabled={formCardConfig.disabled || formCardConfig.loading}
                    options={corporateBodyStatusOption}
                    value={field.value}
                    onChange={(e) => void field.onChange(e.target.value)}
                  />
                )}
              />
              <Input
                label="IČO"
                theme="gray"
                disabled={formCardConfig.disabled || formCardConfig.loading}
                {...register('ICO')}
              />
              <Input
                label="DIČ"
                theme="gray"
                disabled={formCardConfig.disabled || formCardConfig.loading}
                {...register('DIC')}
              />
              <Input
                label={t('user.permitAdress')}
                theme="gray"
                disabled={formCardConfig.disabled || formCardConfig.loading}
                {...register('permitAdress')}
              />
              <Input
                label={t('user.adress')}
                theme="gray"
                disabled={formCardConfig.disabled || formCardConfig.loading}
                {...register('adress')}
              />
              <Input
                label={t('user.permitDepartment')}
                theme="gray"
                disabled={formCardConfig.disabled || formCardConfig.loading}
                {...register('permitDepartment')}
              />
              <Input
                label={t('user.permitNumber')}
                theme="gray"
                disabled={formCardConfig.disabled || formCardConfig.loading}
                {...register('permitNumber')}
              />
            </FormCardBodyRow>
          </FormCardBody>
        </>
      )}
    </FormCard>
  );
};

export default memo(BusinessInfoFormCard);
