import React from 'react';
import MaterialList from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { ListItemButton } from '@mui/material';

const List = () => {
  return (
    <MaterialList sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <ListItem alignItems="flex-start">
        <ListItemButton>
          <ListItemText
            primary="Brunch this weekend?"
            secondary={
              <>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  Ali Connors
                </Typography>
                {" — I'll be in your neighborhood doing errands this…"}
              </>
            }
          />
        </ListItemButton>
      </ListItem>
      <ListItem alignItems="flex-start">
        <ListItemButton>
          <ListItemText
            primary="Summer BBQ"
            secondary={
              <>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  to Scott, Alex, Jennifer
                </Typography>
                {" — Wish I could come, but I'm out of town this…"}
              </>
            }
          />
        </ListItemButton>
      </ListItem>
    </MaterialList>
  );
};

export default List;
