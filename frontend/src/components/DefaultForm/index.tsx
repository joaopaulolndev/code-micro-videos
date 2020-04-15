import * as React from 'react';
import { Grid, GridProps, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  gridItem: {
    padding: theme.spacing(1, 0),
  },
}));

interface DefaultFormProps
  extends React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
  GridContainerProps?: GridProps;
  GridItemProps?: GridProps;
}

const DefaultForm: React.FC<DefaultFormProps> = ({
  GridContainerProps,
  GridItemProps,
  children,
  ...rest
}: DefaultFormProps) => {
  const classes = useStyles();

  return (
    <form {...rest}>
      <Grid container {...GridContainerProps}>
        <Grid item className={classes.gridItem} {...GridItemProps}>
          {children}
        </Grid>
      </Grid>
    </form>
  );
};

export default DefaultForm;
