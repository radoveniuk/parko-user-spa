import React, { memo } from 'react';
import { Paper as PaperUi, PaperProps } from '@mui/material';

import { ContentWrapper, HeaderWrapper } from './styles';

type TPaper = PaperProps & {
    headerTitle?: string
}
const Paper = ({ headerTitle, ...props }: TPaper) => (
  <>
    <PaperUi {...props}>
      {headerTitle && (
        <HeaderWrapper>
          {headerTitle}
        </HeaderWrapper>
      )}
      <ContentWrapper>
        {props.children}
      </ContentWrapper>
    </PaperUi>
  </>
);

export default memo(Paper);
