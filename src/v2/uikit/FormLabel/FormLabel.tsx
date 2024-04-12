import React, { memo, PropsWithChildren, ReactNode } from 'react';
import styled from 'styled-components';

import { InfoIcon } from 'components/icons';
import { themeConfig } from 'theme';

import Tooltip from '../Tooltip';

const LabelWrapper = styled.div`
  display: flex;
  color: #717171;
  font-size: 14px;
  margin-bottom: 3px;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  &.error {
    color: ${themeConfig.palette.error.main};
  }
  
  .tooltip {
    margin-left: auto;
  }
`;

type Props = PropsWithChildren<{
  className?: string;
  tooltip?: string | ReactNode;
}>;

const FormLabel = ({ tooltip, className, children }: Props) => (
  <LabelWrapper className={`label ${className}`}>
    {children}
    {!!tooltip && <div className="tooltip"><Tooltip title={tooltip}><InfoIcon /></Tooltip></div>}
  </LabelWrapper>
);

export default memo(FormLabel);
