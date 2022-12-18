import React, { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ListItemButton } from '@mui/material';
import MaterialList, { ListProps } from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import _, { isEqual } from 'lodash-es';

import { AnyObject, MongoEntity } from 'interfaces/base.types';

import { StyledListItem } from './styles';

type Props<T> = ListProps & {
  data: T[];
  fields: {
    primary: string | string[] | ((row: T) => string | React.ReactNode);
    secondary?: string | string[] | ((row: T) => string | React.ReactNode);
    text?: string;
  };
  onSelect?(value: any): void;
  highlite?: [string, any];
  defaultSelected?: unknown;
}

export default function List <T extends MongoEntity> ({ data, fields, onSelect, highlite, defaultSelected, ...rest }: Props<T>) {
  const [selected, setSelected] = useState(defaultSelected);

  const getText = (item: AnyObject, path: string | string[]) => {
    if (typeof path === 'string') {
      return _.get(item, path);
    }
    return path.map((pathItem) => _.get(item, pathItem)).join(' ');
  };

  useEffect(() => {
    if (!isEqual(selected, defaultSelected)) {
      setSelected(defaultSelected);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSelected]);

  return (
    <PerfectScrollbar style={{ width: '100%', maxWidth: 360 }}>
      <MaterialList sx={{ width: '100%', bgcolor: 'background.paper' }} {...rest}>
        {data.map((item) => (
          <StyledListItem
            key={item._id}
            alignItems="flex-start"
            className={highlite && _.get(item, highlite[0] || '') === highlite[1] ? 'highlited' : ''}
          >
            <ListItemButton onClick={() => { setSelected(item._id); onSelect?.(item); }} selected={selected === item._id}>
              <ListItemText
                primary={(Array.isArray(fields.primary) || typeof fields.primary === 'string')
                  ? getText(item, fields.primary)
                  : fields.primary(item)
                }
                secondary={fields.secondary && (
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {(Array.isArray(fields.secondary) || typeof fields.secondary === 'string')
                      ? getText(item, fields.secondary)
                      : fields.secondary(item)
                    }
                  </Typography>
                )}
              />
            </ListItemButton>
          </StyledListItem>
        ))}
      </MaterialList>
    </PerfectScrollbar>
  );
};
