import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import genreHttp from '../../util/http/genre-http';
import categoryHttp from '../../util/http/category-http';
import videoHttp from '../../util/http/video-http';
import { formatDate } from '../../util/format';
import DefaultTable, { MuiDataTableRefComponent, TableColumn } from '../../components/DefaultTable';
import { BadgeNo, BadgeYes } from '../../components/Badge';
import { Category, Genre, ListResponse } from '../../util/models';
import FilterResetButton from '../../components/DefaultTable/FilterResetButton';
import useFilter from '../../hooks/useFilter';
import * as Yup from '../../util/vendor/yup';
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const DEBOUNCE_TIME = 300;
const DEBOUNCE_SEARCH_TIME = 300;
const ROWS_PER_PAGE = 10;
const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

const columnsDefinition: TableColumn[] = [
  {
    name: 'title',
    label: 'Título',
    options: {
      filter: false,
    },
  },
  {
    name: 'genres',
    label: 'Gêneros',
    options: {
      filter: true,
      filterType: 'multiselect',
      filterOptions: {
        names: [],
      },
      customBodyRender(value, tableMeta, updateValue) {
        return value.map((genre: Genre) => genre.name).join(', ');
      },
    },
  },
  {
    name: 'categories',
    label: 'Categorias',
    options: {
      filter: true,
      filterType: 'multiselect',
      filterOptions: {
        names: [],
      },
      customBodyRender(value, tableMeta, updateValue) {
        return value.map((category: Category) => category.name).join(', ');
      },
    },
  },
  {
    name: 'opened',
    label: 'Aberto?',
    width: '15%',
    options: {
      filter: true,
      filterType: 'dropdown',
      filterOptions: {
        names: ['Sim', 'Não'],
      },
      customBodyRender(value, tableMeta, updateValue) {
        return value ? <BadgeYes /> : <BadgeNo />;
      },
    },
  },
  {
    name: 'created_at',
    label: 'Criado em',
    width: '15%',
    options: {
      filter: false,
      customBodyRender(value, tableMeta, updateValue) {
        return formatDate(value, "dd/MM/yyyy 'às' H:mm");
      },
    },
  },
  {
    name: 'id',
    label: 'Ações',
    options: {
      sort: false,
      print: false,
      filter: false,
      searchable: false,
      setCellProps: (value) => ({
        style: {
          width: '10%',
          whiteSpace: 'nowrap',
        },
      }),
      customBodyRender(value, tableMeta, updateValue) {
        return (
          <>
            <Link to={`/videos/${value}/edit`}><EditIcon color={"secondary"} /></Link>
            <Link to={`/videos/${value}/delete`}><DeleteIcon color={"secondary"} /></Link>
          </>
        );
      },
    },
  },
];

type TableProps = {};

const Table: React.FC = (props: TableProps) => {
  const snackbar = useSnackbar();
  const subscribed = useRef(true);
  const [videos, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const tableRef = useRef() as MutableRefObject<MuiDataTableRefComponent>;
  const {
    columns,
    filterManager,
    filterState,
    debounceFilterState,
    totalRecords,
    setTotalRecords,
  } = useFilter({
    columns: columnsDefinition,
    rowsPerPage: ROWS_PER_PAGE,
    rowsPerPageOptions: ROWS_PER_PAGE_OPTIONS,
    debounceTime: DEBOUNCE_TIME,
    tableRef,
    extraFilter: {
      createValidationSchema: () => {
        return Yup.object().shape({
          genres: Yup.mixed()
            .nullable()
            .transform((value) => (!value || value === '' ? undefined : value.split(',')))
            .default(null),
          categories: Yup.mixed()
            .nullable()
            .transform((value) => (!value || value === '' ? undefined : value.split(',')))
            .default(null),
          opened: Yup.string()
            .nullable()
            .transform((value) => (!value || !['Sim', 'Não'].includes(value) ? undefined : value))
            .default(null),
        });
      },
      formatSearchParams: (debouncedState) => {
        return debouncedState.extraFilter
          ? {
              ...(debouncedState.extraFilter.genres && {
                genres: debouncedState.extraFilter.genres.join(','),
              }),
              ...(debouncedState.extraFilter.categories && {
                categories: debouncedState.extraFilter.categories.join(','),
              }),
              ...(debouncedState.extraFilter.opened !== null && {
                opened: debouncedState.extraFilter.opened,
              }),
            }
          : undefined;
      },
      getStateFromUrl: (queryParams) => ({
        genres: queryParams.get('genres'),
        categories: queryParams.get('categories'),
        opened: queryParams.get('opened'),
      }),
    },
  });

  // column genres
  const indexColumnGenres = columns.findIndex((column) => column.name === 'genres');
  const columnGenres = columns[indexColumnGenres];
  const genresFilterValue = filterState.extraFilter && filterState.extraFilter.genres;
  (columnGenres.options as any).filterList = genresFilterValue || [];

  const serverSideFilterList = columns.map((column) => []);
  if (genresFilterValue) {
    serverSideFilterList[indexColumnGenres] = genresFilterValue;
  }

  // column categories
  const indexColumnCategories = columns.findIndex((column) => column.name === 'categories');
  const columnCategories = columns[indexColumnCategories];
  const categoriesFilterValue = filterState.extraFilter && filterState.extraFilter.categories;
  (columnCategories.options as any).filterList = categoriesFilterValue || [];

  if (categoriesFilterValue) {
    serverSideFilterList[indexColumnCategories] = categoriesFilterValue;
  }

  // column opened
  const indexColumnOpened = columns.findIndex((column) => column.name === 'opened');
  const columnOpened = columns[indexColumnOpened];
  const openedFilterValue = filterState.extraFilter && (filterState.extraFilter.opened as never);
  (columnOpened.options as any).filterList = openedFilterValue ? [openedFilterValue] : [];

  if (openedFilterValue !== undefined && openedFilterValue !== null) {
    serverSideFilterList[indexColumnOpened] = [openedFilterValue];
  }

  useEffect(() => {
    let isSubscribed = true;

    (async () => {
      try {
        const [genreResponse, categoryResponse] = await Promise.all([
          genreHttp.list({ queryParams: { all: '' } }),
          categoryHttp.list({ queryParams: { all: '' } }),
        ]);

        if (isSubscribed) {
          (columnGenres.options as any).filterOptions.names = genreResponse.data.data.map(
            (genre) => genre.name,
          );
          (columnCategories.options as any).filterOptions.names = categoryResponse.data.data.map(
            (category) => category.name,
          );
        }
      } catch (error) {
        snackbar.enqueueSnackbar('Não foi possível carregar as informações.', { variant: 'error' });
      }
    })();

    return () => {
      isSubscribed = false;
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    subscribed.current = true;
    filterManager.pushHistory();
    getData();
    return () => {
      subscribed.current = false;
    };
    // eslint-disable-next-line
  }, [
    filterManager.cleanSearchText(debounceFilterState.search), // eslint-disable-line
    debounceFilterState.pagination.page,
    debounceFilterState.pagination.per_page,
    debounceFilterState.order,
    JSON.stringify(debounceFilterState.extraFilter), // eslint-disable-line
  ]);

  async function getData() {
    setLoading(true);

    try {
      const response = await videoHttp.list<ListResponse<Category>>({
        queryParams: {
          search: filterManager.cleanSearchText(filterState.search),
          page: filterState.pagination.page,
          per_page: filterState.pagination.per_page,
          sort: filterState.order.sort,
          dir: filterState.order.dir,
          ...(debounceFilterState.extraFilter &&
            debounceFilterState.extraFilter.genres && {
              genres: debounceFilterState.extraFilter.genres.join(','),
            }),
          ...(debounceFilterState.extraFilter &&
            debounceFilterState.extraFilter.categories && {
              categories: debounceFilterState.extraFilter.categories.join(','),
            }),
          ...(debounceFilterState.extraFilter &&
            debounceFilterState.extraFilter.opened !== null && {
              opened: debounceFilterState.extraFilter.opened === 'Sim',
            }),
        },
      });
      if (subscribed.current) {
        setCategories(response.data.data);
        setTotalRecords(response.data.meta.total);
      }
    } catch (error) {
      if (videoHttp.isCancelledRequest(error)) return;
      snackbar.enqueueSnackbar('Não foi possível carregar as informações.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <DefaultTable
      title=""
      columns={columns}
      data={videos}
      loading={loading}
      debouncedSearchTime={DEBOUNCE_SEARCH_TIME}
      ref={tableRef}
      options={{
        serverSide: true,
        serverSideFilterList,
        responsive: 'scrollMaxHeight',
        searchText: filterState.search as any,
        page: filterState.pagination.page - 1,
        rowsPerPage: filterState.pagination.per_page,
        rowsPerPageOptions: ROWS_PER_PAGE_OPTIONS,
        count: totalRecords,
        customToolbar: () => <FilterResetButton handleClick={() => filterManager.resetFilter()} />,
        onFilterChange: (changedColumn, filterList) => {
          if (changedColumn === 'opened') {
            filterManager.changeExtraFilter({
              [changedColumn]:
                filterList[indexColumnOpened][0] !== undefined
                  ? filterList[indexColumnOpened][0]
                  : null,
            });
          }

          if (changedColumn === 'genres' || changedColumn === 'categories') {
            const columnIndex = columns.findIndex((column) => column.name === changedColumn);
            filterManager.changeExtraFilter({
              [changedColumn]: filterList[columnIndex].length ? filterList[columnIndex] : null,
            });
          }
        },
        onSearchChange: (value) => filterManager.changeSearch(value),
        onChangePage: (page) => filterManager.changePage(page),
        onChangeRowsPerPage: (perPage) => filterManager.changeRowsPerPage(perPage),
        onColumnSortChange: (changedColumn, direction) =>
          filterManager.changeColumnSort(changedColumn, direction),
      }}
    />
  );
};

export default Table;
