import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { PermitInfo } from '../types';

import { DocForm } from './styles';

type Props = {
  data: PermitInfo;
};

const Permit = ({ data }: Props) => {
  const { t } = useTranslation();
  return (
    <DocForm></DocForm>
  );
};

export default memo(Permit);
