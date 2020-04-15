import * as React from 'react';
import { FormControl, FormControlProps, FormHelperText, Typography } from '@material-ui/core';
import AsyncAutocomplete from '../../../components/AsyncAutocomplete';
import GridSelected from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelected/GridSelectedItem';
import useHttpHandled from '../../../hooks/useHttpHandled';
import castMemberHttp from '../../../util/http/cast-member-http';
import useCollectionManager from '../../../hooks/useCollectionManager';

interface CastMemberFieldProps {
  castMembers: any[];
  setCastMembers: (castMembers) => void;
  error: any;
  disabled?: boolean;
  FormControlProps?: FormControlProps;
}

const CastMemberField: React.FC<CastMemberFieldProps> = (props) => {
  const { castMembers, setCastMembers, error, disabled } = props;
  const autoCompleteHttp = useHttpHandled();
  const { addItem, removeItem } = useCollectionManager(castMembers, setCastMembers);

  function fetchOptions(searchText) {
    return autoCompleteHttp(
      castMemberHttp.list({ queryParams: { search: searchText, all: '' } }),
    ).then((response) => response.data.data);
  }

  return (
    <>
      <AsyncAutocomplete
        fetchOptions={fetchOptions}
        AutocompleteProps={{
          clearOnEscape: true,
          freeSolo: true,
          getOptionLabel: (option) => option.name,
          getOptionSelected: (option, value) => option.id === value.id,
          onChange: (event, value) => addItem(value),
          disabled: disabled === true,
        }}
        TextFieldProps={{ label: 'Elenco', error: error !== undefined }}
      />
      <FormControl
        fullWidth
        margin="none"
        error={error !== undefined}
        disabled={disabled === true}
        {...props.FormControlProps}
      >
        {!!castMembers.length && (
          <GridSelected>
            {castMembers.map((castMember) => (
              <GridSelectedItem
                key={String(castMember.id)}
                onDelete={() => removeItem(castMember)}
                xs={6}
              >
                <Typography noWrap>{castMember.name}</Typography>
              </GridSelectedItem>
            ))}
          </GridSelected>
        )}
        {error && <FormHelperText>{error.message}</FormHelperText>}
      </FormControl>
    </>
  );
};

export default CastMemberField;
