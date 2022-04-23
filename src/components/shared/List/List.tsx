import React, { useState } from 'react';
import MaterialList from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { ListItemButton } from '@mui/material';

type ListProps = {
  data: any[];
  fields: {
    primary: string;
    secondary: string;
    text?: string;
  };
  onSelect?(id: string): void
}

const List = ({ data, fields, onSelect }: ListProps) => {
  const [selected, setSelected] = useState(null);
  return (
    <MaterialList sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {data.map((item) => (
        <ListItem key={item.id} alignItems="flex-start">
          <ListItemButton onClick={() => { setSelected(item.id); onSelect?.(item.id); }} selected={selected === item.id}>
            <ListItemText
              primary={item[fields.primary]}
              secondary={
                <>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {item[fields.secondary]}
                  </Typography>
                </>
              }
            />
          </ListItemButton>
        </ListItem>
      ))}
    </MaterialList>
  );
};

export default List;
