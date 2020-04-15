import * as React from 'react';
import { IconButton, makeStyles, Theme, Tooltip } from '@material-ui/core';
import ClearAllIcon from '@material-ui/icons/ClearAll';

const useStyles = makeStyles((theme: Theme) => ({
  iconButton: (theme as any).overrides.MUIDataTableToolbar.icon,
}));

interface FilterResetButtonProps {
  handleClick: () => void;
}

const FilterResetButton: React.FC<FilterResetButtonProps> = ({
  handleClick,
}: FilterResetButtonProps) => {
  const classes = useStyles();

  return (
    <Tooltip title="Limpar busca">
      <IconButton className={classes.iconButton} onClick={handleClick}>
        <ClearAllIcon />
      </IconButton>
    </Tooltip>
  );
};

export default FilterResetButton;
