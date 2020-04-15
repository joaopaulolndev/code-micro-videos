import React, { MutableRefObject, useRef } from 'react';
import { Button, FormControl, FormControlProps } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import InputFile, { InputFileComponent } from '../../../components/InputFile';

interface UploadFieldProps {
  accept: string;
  label: string;
  setValue: (value) => void;
  error?: any;
  disabled?: boolean;
  FormControlProps?: FormControlProps;
}

const UploadField: React.FC<UploadFieldProps> = (props) => {
  const fileRef = useRef() as MutableRefObject<InputFileComponent>;
  const { accept, label, setValue, error, disabled } = props;

  return (
    <FormControl
      fullWidth
      margin="normal"
      error={error !== undefined}
      disabled={disabled === true}
      {...props.FormControlProps}
    >
      <InputFile
        ref={fileRef}
        TextFieldProps={{
          label,
          InputLabelProps: { shrink: true },
          style: { backgroundColor: '#fff' },
        }}
        InputFileProps={{
          accept,
          onChange(event) {
            const files = event.target.files as any;
            files.length && setValue(files[0]);
          },
        }}
        ButtonFile={
          <Button
            endIcon={<CloudUpload />}
            variant="contained"
            color="primary"
            onClick={() => fileRef.current.openWindow()}
          >
            Adicionar
          </Button>
        }
      />
    </FormControl>
  );
};

export default UploadField;
