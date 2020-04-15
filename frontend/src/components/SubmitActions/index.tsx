import * as React from 'react';
import { Box, Button, ButtonProps, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  submit: {
    marginLeft: theme.spacing(1),
  },
}));

type SubmitActionsProps = {
  disabledButtons?: boolean;
  handleSave: () => void;
};

const SubmitActions: React.FC<SubmitActionsProps> = ({
  disabledButtons,
  handleSave,
}: SubmitActionsProps) => {
  const classes = useStyles();

  const buttonProps: ButtonProps = {
    className: classes.submit,
    color: 'secondary',
    variant: 'contained',
    disabled: disabledButtons === undefined ? false : disabledButtons,
  };

  return (
    <Box dir="rtl">
      <Button {...buttonProps} onClick={handleSave}>
        Salvar
      </Button>
      <Button {...buttonProps} type="submit">
        Salvar e continuar editando
      </Button>
    </Box>
  );
};

export default SubmitActions;
