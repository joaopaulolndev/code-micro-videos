import * as React from 'react';
import { Grid, GridProps, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

interface GridSelectedItemProps extends GridProps {
  onDelete: () => void;
}

const GridSelectedItem: React.FC<GridSelectedItemProps> = (props) => {
  const { onDelete, children, ...other } = props;

  return (
    <Grid item {...other}>
      <Grid container alignItems="center" spacing={3}>
        <Grid item xs={1}>
          <IconButton size="small" color="inherit" onClick={onDelete}>
            <Delete />
          </IconButton>
        </Grid>
        <Grid item xs={10} md={11}>
          {children}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GridSelectedItem;
