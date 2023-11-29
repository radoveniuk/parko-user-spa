import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { VisaInfo } from '../types';

import { DocForm } from './styles';

type Props = {
  data: VisaInfo;
};

const Visa = ({ data }: Props) => {
  const { t } = useTranslation();
  return (
    <DocForm></DocForm>
  );
};

export default memo(Visa);
