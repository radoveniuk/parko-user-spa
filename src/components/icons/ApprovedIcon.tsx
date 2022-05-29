import React from 'react';
import { IoClose, IoCheckmark } from 'react-icons/io5';
import { AiOutlineQuestion } from 'react-icons/ai';
import { IconBaseProps } from 'react-icons';

import { themeConfig } from 'theme';

type Props = IconBaseProps & {
  approved: boolean | null
}

const ApprovedIcon = ({ approved, ...rest }: Props) => {
  if (approved) {
    return <IoCheckmark color={themeConfig.palette.success.main} {...rest} />;
  }
  if (approved === false) {
    return <IoClose color={themeConfig.palette.error.main} {...rest} />;
  }
  return <AiOutlineQuestion {...rest} />;
};

export default ApprovedIcon;
