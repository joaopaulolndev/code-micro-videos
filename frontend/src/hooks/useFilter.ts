import React, { Dispatch, Reducer, useEffect, useReducer, useState } from 'react';
import { MUIDataTableColumn } from 'mui-datatables';
import { useDebounce } from 'use-debounce';
import { useHistory } from 'react-router';
import { History } from 'history';
import { isEqual } from 'lodash';
import reducer, { Creators } from '../store/filter';
import { Actions as FilterActions, State as FilterState } from '../store/filter/types';
import * as Yup from '../util/vendor/yup';
import { MuiDataTableRefComponent } from '../components/DefaultTable';

interface FilterManagerOptions {
  columns: MUIDataTableColumn[];
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  debounceTime: number;
  history: History;
  tableRef: React.MutableRefObject<MuiDataTableRefComponent>;
  extraFilter?: ExtraFilter;
}

interface ExtraFilter {
  getStateFromUrl: (queryParams: URLSearchParams) => any;
  formatSearchParams: (debouncedState: FilterState) => any;
  createValidationSchema: () => any;
}

type UseFilterOptions = Omit<FilterManagerOptions, 'history'>;

export default function useFilter(options: UseFilterOptions) {
  const history = useHistory();
  const filterManager = new FilterManager({ ...options, history });
  const initialState = filterManager.getStateFromUrl();
  const [filterState, dispatch] = useReducer<Reducer<FilterState, FilterActions>>(
    reducer,
    initialState,
  );
  const [debounceFilterState] = useDebounce(filterState, options.debounceTime);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  filterManager.state = filterState;
  filterManager.debouncedState = debounceFilterState;
  filterManager.dispatch = dispatch;

  filterManager.applyOderInColumns();

  useEffect(() => {
    filterManager.replaceHistory();
  }, []); // eslint-disable-line

  return {
    columns: filterManager.columns,
    filterManager,
    filterState,
    debounceFilterState,
    dispatch,
    totalRecords,
    setTotalRecords,
  };
}

class FilterManager {
  state: FilterState = null as any;

  debouncedState: FilterState = null as any;

  dispatch: Dispatch<FilterActions> = null as any;

  columns: MUIDataTableColumn[];

  rowsPerPage: number;

  rowsPerPageOptions: number[];

  debounceTime: number;

  history: History;

  tableRef: React.MutableRefObject<MuiDataTableRefComponent>;

  extraFilter?: ExtraFilter;

  schema;

  constructor(options: FilterManagerOptions) {
    const {
      columns,
      rowsPerPage,
      rowsPerPageOptions,
      debounceTime,
      history,
      tableRef,
      extraFilter,
    } = options;
    this.columns = columns;
    this.rowsPerPage = rowsPerPage;
    this.rowsPerPageOptions = rowsPerPageOptions;
    this.debounceTime = debounceTime;
    this.history = history;
    this.tableRef = tableRef;
    this.extraFilter = extraFilter;
    this.createValidationSchema();
  }

  changeSearch(value) {
    this.dispatch(Creators.setSearch({ search: value }));
  }

  changePage(page) {
    this.dispatch(Creators.setPage({ page: page + 1 }));
  }

  changeRowsPerPage(perPage) {
    this.dispatch(Creators.setPerPage({ per_page: perPage }));
  }

  changeColumnSort(changedColumn: string, direction: string) {
    this.dispatch(
      Creators.setOrder({ sort: changedColumn, dir: direction.includes('desc') ? 'desc' : 'asc' }),
    );
    this.resetTablePagination();
  }

  changeExtraFilter(data) {
    this.dispatch(Creators.updateExtraFilter(data));
  }

  resetFilter() {
    const initialState = {
      ...this.schema.cast({}),
      search: { value: null, update: true },
    };

    this.dispatch(Creators.setReset({ state: initialState }));
    this.resetTablePagination();
  }

  applyOderInColumns() {
    this.columns = this.columns.map((column) => {
      if (column.name !== this.state.order.sort) return column;

      return {
        ...column,
        options: {
          ...column.options,
          sortDirection: this.state.order.dir as any,
        },
      };
    });
  }

  cleanSearchText(text) {
    let newText = text;
    if (text && text.value !== undefined) {
      newText = text.value;
    }
    return newText;
  }

  replaceHistory() {
    this.history.replace({
      pathname: this.history.location.pathname,
      search: `?${new URLSearchParams(this.formatSearchParams() as any)}`,
      state: this.debouncedState,
    });
  }

  pushHistory() {
    const newLocation = {
      pathname: this.history.location.pathname,
      search: `?${new URLSearchParams(this.formatSearchParams() as any)}`,
      state: { ...this.debouncedState, search: this.cleanSearchText(this.debouncedState.search) },
    };

    const oldState = this.history.location.state;
    const nextState = this.debouncedState;

    if (isEqual(oldState, nextState)) return;

    this.history.push(newLocation);
  }

  private formatSearchParams() {
    const search = this.cleanSearchText(this.debouncedState.search);

    return {
      ...(search && search !== '' && { search }),
      ...(this.debouncedState.pagination.page !== 1 && {
        page: this.debouncedState.pagination.page,
      }),
      ...(this.debouncedState.pagination.per_page !== 10 && {
        per_page: this.debouncedState.pagination.per_page,
      }),
      ...(this.debouncedState.order.sort && { ...this.debouncedState.order }),
      ...(this.extraFilter && this.extraFilter.formatSearchParams(this.debouncedState)),
    };
  }

  getStateFromUrl() {
    const queryParams = new URLSearchParams(this.history.location.search.substr(1));

    return this.schema.cast({
      search: queryParams.get('search'),
      pagination: {
        page: queryParams.get('page'),
        per_page: queryParams.get('per_page'),
      },
      order: {
        sort: queryParams.get('sort'),
        dir: queryParams.get('dir'),
      },
      ...(this.extraFilter && { extraFilter: this.extraFilter.getStateFromUrl(queryParams) }),
    });
  }

  private resetTablePagination() {
    this.tableRef.current.changeRowsPerPage(this.rowsPerPage);
    this.tableRef.current.changePage(0);
  }

  private createValidationSchema() {
    this.schema = Yup.object().shape({
      search: Yup.string()
        .transform((value) => (!value ? undefined : value))
        .default(''),
      pagination: Yup.object().shape({
        page: Yup.number()
          .transform((value) => (isNaN(value) || parseInt(value, 10) < 1 ? undefined : value))
          .default(1),
        per_page: Yup.number()
          .transform((value) =>
            isNaN(value) || !this.rowsPerPageOptions.includes(parseInt(value, 10))
              ? undefined
              : value,
          )
          .default(this.rowsPerPage),
      }),
      order: Yup.object().shape({
        sort: Yup.string()
          .nullable()
          .transform((value) => {
            const columnsName = this.columns
              .filter((column) => !column.options || column.options.sort !== false)
              .map((column) => column.name);
            return columnsName.includes(value) ? value : undefined;
          })
          .default(null),
        dir: Yup.string()
          .nullable()
          .transform((value) =>
            !value || !['asc', 'desc'].includes(value.toLowerCase()) ? undefined : value,
          )
          .default(null),
      }),
      ...(this.extraFilter && { extraFilter: this.extraFilter.createValidationSchema() }),
    });
  }
}
