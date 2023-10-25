import React from 'react';
import { IconBaseProps } from 'react-icons';
import { AiOutlineQuestion } from 'react-icons/ai';
import { IoCheckmark, IoClose } from 'react-icons/io5';

import { themeConfig } from 'theme';

type Props = IconBaseProps & {
  value: boolean | null
}

export const BooleanIcon = ({ value, ...rest }: Props) => {
  if (value) {
    return <IoCheckmark color={themeConfig.palette.success.main} {...rest} />;
  }
  if (value === false) {
    return <IoClose color={themeConfig.palette.error.main} {...rest} />;
  }
  return <AiOutlineQuestion {...rest} />;
};
