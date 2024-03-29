import DialogContentMaterial from '@mui/material/DialogContent';
import DialogTitleMaterial from '@mui/material/DialogTitle';
import styled from 'styled-components';

import { themeConfig } from 'theme';

export const DialogTitle = styled(DialogTitleMaterial)<{ background?: string }>`
  display: flex;
  justify-content: space-between;
  margin: 10px;
  align-items: center;
  padding: 6px 20px !important;
  font-size: 16px !important;
  background: ${(props) => props.background || themeConfig.palette.primary.main};
  color: #fff;
  font-weight: 600 !important;
`;

export const DialogContent = styled(DialogContentMaterial)`
  padding: 16px 20px !important;
`;
