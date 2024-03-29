import React from 'react';

import { StyledChip } from './styles';

export type ChipProps = {
  onDelete?:() => void;
  label?: string;
  className?: string;
};

const Chip = (props: ChipProps) => <StyledChip {...props} />;

export default Chip;
