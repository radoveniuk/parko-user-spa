import React, { memo, PropsWithChildren } from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Button from 'v2/uikit/Button';

import { CloseIcon } from 'components/icons';
import IconButton from 'components/shared/IconButton';

import { Toolbar } from './styles';

const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

type Props = {
  open: boolean;
  onClose: () => void;
  width?: number;
  title?: string;
};

const DialogFullscreen = ({ width, children, title, ...props }: PropsWithChildren<Props>) => (
  <Dialog
    fullScreen
    style={{ width, marginLeft: 'auto' }}
    maxWidth="md"
    TransitionComponent={Transition}
    {...props}
  >
    <Toolbar>
      <IconButton
        edge="start"
        color="inherit"
        onClick={props.onClose}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>
      <div className="title">
        {title}
      </div>
      <Button color="inherit" className="save-btn" autoFocus onClick={props.onClose}>OK</Button>
    </Toolbar>
    {children}
  </Dialog>
);

export default memo(DialogFullscreen);
