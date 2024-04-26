import React, { memo, PropsWithChildren, ReactNode } from 'react';
import { Stack } from 'v2/uikit';

import { ListTableHeaderWrapper } from './styles';

type Props = {
  title: ReactNode;
  classNames?: {
    title?: string;
    actions?: string;
  }
}

const ListTableHeader = ({ title, classNames, children }: PropsWithChildren<Props>) => (
  <ListTableHeaderWrapper>
    <Stack direction="row" gap="9px" alignContent="center">
      <span className={!classNames?.title ? 'bold' : classNames.title}>{title}</span>
    </Stack>
    <Stack direction="row" gap="15px">
      {children}
    </Stack>
  </ListTableHeaderWrapper>
);

export default memo(ListTableHeader);
