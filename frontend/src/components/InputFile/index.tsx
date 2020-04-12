import React, { MutableRefObject, useImperativeHandle, useRef, useState } from 'react';
import { InputAdornment, TextField, TextFieldProps } from '@material-ui/core';

interface InputFileProps {
  ButtonFile: React.ReactNode;
  InputFileProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  TextFieldProps?: TextFieldProps;
}

export interface InputFileComponent {
  openWindow: () => void;
}

const InputFile: React.RefForwardingComponent<InputFileComponent, InputFileProps> = (
  props,
  ref,
) => {
  const fileRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [filename, setFilename] = useState('');

  const textFieldProps: TextFieldProps = {
    fullWidth: true,
    variant: 'outlined',
    ...props.TextFieldProps,
    InputProps: {
      ...props.TextFieldProps?.InputProps,
      readOnly: true,
      endAdornment: <InputAdornment position="end">{props.ButtonFile}</InputAdornment>,
    },
    value: filename,
  };

  const inputFileProps = {
    ...props.InputFileProps,
    hidden: true,
    ref: fileRef,
    onChange(event) {
      const { files } = event.target;

      if (files && files.length) {
        setFilename(
          Array.from(files)
            .map((file: any) => file.name)
            .join(', '),
        );
      }

      if (props.InputFileProps && props.InputFileProps.onChange) {
        props.InputFileProps.onChange(event);
      }
    },
  };

  useImperativeHandle(ref, () => ({
    openWindow: () => fileRef.current.click(),
  }));

  return (
    <>
      <input type="file" {...inputFileProps} />
      <TextField {...textFieldProps} />
    </>
  );
};

export default React.forwardRef(InputFile);
