import * as React from 'react';
import { FormControl, FormControlProps, FormHelperText, Typography } from '@material-ui/core';
import AsyncAutocomplete from '../../../components/AsyncAutocomplete';
import GridSelected from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelected/GridSelectedItem';
import useHttpHandled from '../../../hooks/useHttpHandled';
import genreHttp from '../../../util/http/genre-http';
import useCollectionManager from '../../../hooks/useCollectionManager';
import { getGenresFromCategory } from '../../../util/model-filters';

interface GenreFieldProps {
  genres: any[];
  setGenres: (genres) => void;
  categories: any[];
  setCategories: (categories) => void;
  error: any;
  disabled?: boolean;
  FormControlProps?: FormControlProps;
}

const GenreField: React.FC<GenreFieldProps> = (props) => {
  const { genres, setGenres, categories, setCategories, error, disabled } = props;
  const autoCompleteHttp = useHttpHandled();
  const { addItem, removeItem } = useCollectionManager(genres, setGenres);
  const { removeItem: removeCategory } = useCollectionManager(categories, setCategories);

  function fetchOptions(searchText) {
    return autoCompleteHttp(genreHttp.list({ queryParams: { search: searchText, all: '' } })).then(
      (response) => response.data.data,
    );
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
        TextFieldProps={{ label: 'Gêneros', error: error !== undefined }}
      />
      <FormControl
        fullWidth
        margin="none"
        error={error !== undefined}
        disabled={disabled === true}
        {...props.FormControlProps}
      >
        {!!genres.length && (
          <GridSelected>
            {genres.map((genre) => (
              <GridSelectedItem
                key={String(genre.id)}
                onDelete={() => {
                  const categoriesWithOneGenre = categories.filter((category) => {
                    const genresFromCategory = getGenresFromCategory(genres, category);
                    return genresFromCategory.length === 1 && genres[0].id === genre.id;
                  });
                  categoriesWithOneGenre.forEach((item) => removeCategory(item));
                  removeItem(genre);
                }}
                xs={12}
              >
                <Typography noWrap>{genre.name}</Typography>
              </GridSelectedItem>
            ))}
          </GridSelected>
        )}
        {error && <FormHelperText>{error.message}</FormHelperText>}
      </FormControl>
    </>
  );
};

export default GenreField;
