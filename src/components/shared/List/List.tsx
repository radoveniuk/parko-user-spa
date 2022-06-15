import React, { useState } from 'react';
import _ from 'lodash-es';

import MaterialList, { ListProps } from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { ListItemButton } from '@mui/material';
import { AnyObject } from 'interfaces/base.types';

type Props = ListProps & {
  data: any[];
  fields: {
    primary: string | string[];
    secondary?: string | string[];
    text?: string;
  };
  onSelect?(value: any): void
}

const List = ({ data, fields, onSelect, ...rest }: Props) => {
  const [selected, setSelected] = useState(null);

  const getText = (item: AnyObject, path: string | string[]) => {
    if (typeof path === 'string') {
      return _.get(item, path);
    }
    return path.map((pathItem) => _.get(item, pathItem)).join(' ');
  };

  return (
    <MaterialList sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} {...rest}>
      {data.map((item) => (
        <ListItem key={item._id} alignItems="flex-start">
          <ListItemButton onClick={() => { setSelected(item._id); onSelect?.(item); }} selected={selected === item._id}>
            <ListItemText
              primary={getText(item, fields.primary)}
              secondary={fields.secondary && (
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {getText(item, fields.secondary)}
                </Typography>
              )}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </MaterialList>
  );
};

export default List;
