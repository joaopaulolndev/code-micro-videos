import * as React from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormControlProps,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import Rating from '../../../components/Rating';

const ratings: FormControlLabelProps[] = [
  {
    value: 'L',
    control: <Radio color="primary" />,
    label: <Rating rating="L" />,
    labelPlacement: 'top',
  },
  {
    value: '10',
    control: <Radio color="primary" />,
    label: <Rating rating="10" />,
    labelPlacement: 'top',
  },
  {
    value: '12',
    control: <Radio color="primary" />,
    label: <Rating rating="12" />,
    labelPlacement: 'top',
  },
  {
    value: '14',
    control: <Radio color="primary" />,
    label: <Rating rating="14" />,
    labelPlacement: 'top',
  },
  {
    value: '16',
    control: <Radio color="primary" />,
    label: <Rating rating="16" />,
    labelPlacement: 'top',
  },
  {
    value: '18',
    control: <Radio color="primary" />,
    label: <Rating rating="18" />,
    labelPlacement: 'top',
  },
];

interface RatingFieldProps {
  value: string;
  setValue: (value) => void;
  error: any;
  disabled?: boolean;
  FormControlProps?: FormControlProps;
}

const RatingField: React.FC<RatingFieldProps> = (props) => {
  const { value, setValue, error, disabled } = props;

  return (
    <>
      <FormControl
        error={error !== undefined}
        disabled={disabled === true}
        {...props.FormControlProps}
      >
        <FormLabel component="legend">Classificação</FormLabel>
        <Box paddingTop={1}>
          <RadioGroup
            aria-label="rating"
            name="rating"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            row
          >
            {ratings.map((item, key) => (
              <FormControlLabel
                key={String(key)}
                value={item.value}
                control={item.control}
                label={item.label}
                labelPlacement={item.labelPlacement}
              />
            ))}
          </RadioGroup>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </Box>
      </FormControl>
    </>
  );
};

export default RatingField;
