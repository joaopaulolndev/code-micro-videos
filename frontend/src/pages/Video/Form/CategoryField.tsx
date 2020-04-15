import * as React from 'react';
import {
  FormControl,
  FormControlProps,
  FormHelperText,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import AsyncAutocomplete from '../../../components/AsyncAutocomplete';
import GridSelected from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelected/GridSelectedItem';
import useHttpHandled from '../../../hooks/useHttpHandled';
import categoryHttp from '../../../util/http/category-http';
import useCollectionManager from '../../../hooks/useCollectionManager';
import { getGenresFromCategory } from '../../../util/model-filters';

const useStyles = makeStyles((theme: Theme) => ({
  genresSubtitle: {
    color: grey['800'],
    fontSize: '0.8rem',
  },
}));

interface CategoryFieldProps {
  categories: any[];
  setCategories: (categories) => void;
  genres: any[];
  error: any;
  disabled?: boolean;
  FormControlProps?: FormControlProps;
}

const CategoryField: React.FC<CategoryFieldProps> = (props) => {
  const classes = useStyles();
  const { categories, setCategories, genres, error, disabled } = props;
  const autoCompleteHttp = useHttpHandled();
  const { addItem, removeItem } = useCollectionManager(categories, setCategories);

  function fetchOptions(searchText) {
    return autoCompleteHttp(
      categoryHttp.list({
        queryParams: {
          search: searchText,
          genres: genres.map((genre) => genre.id).join(','),
          all: '',
        },
      }),
    ).then((response) => response.data.data);
  }

  return (
    <>
      <AsyncAutocomplete
        fetchOptions={fetchOptions}
        AutocompleteProps={{
          clearOnEscape: true,
          getOptionLabel: (option) => option.name,
          getOptionSelected: (option, value) => option.id === value.id,
          onChange: (event, value) => addItem(value),
          disabled: disabled === true || !genres.length,
        }}
        TextFieldProps={{ label: 'Categorias', error: error !== undefined }}
      />
      <FormControl
        fullWidth
        margin="none"
        error={error !== undefined}
        disabled={disabled === true}
        {...props.FormControlProps}
      >
        {!!categories.length && (
          <GridSelected>
            {categories.map((category) => {
              const genresFromCategory = getGenresFromCategory(genres, category)
                .map((genre) => genre.name)
                .join(', ');

              return (
                <GridSelectedItem
                  key={String(category.id)}
                  onDelete={() => removeItem(category)}
                  xs={12}
                >
                  <Typography noWrap>{category.name}</Typography>
                  <Typography noWrap className={classes.genresSubtitle}>
                    Gêneros: {genresFromCategory}
                  </Typography>
                </GridSelectedItem>
              );
            })}
          </GridSelected>
        )}
        {error && <FormHelperText>{error.message}</FormHelperText>}
      </FormControl>
    </>
  );
};

export default CategoryField;
