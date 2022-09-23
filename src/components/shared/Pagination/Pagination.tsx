import React from 'react';
import { PaginationProps } from '@mui/material';

import { PaginationMaterial } from './styles';

const Pagination = (props: PaginationProps) => <PaginationMaterial shape="rounded" color="primary" {...props} />;

export default Pagination;
