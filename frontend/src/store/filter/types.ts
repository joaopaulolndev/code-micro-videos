import { AnyAction } from 'redux';

export interface Pagination {
  page: number;
  total: number;
  per_page: number;
}

export interface Order {
  sort: string | null;
  dir: string | null;
}

export interface State {
  search: string | { value; [key: string]: any } | null;
  pagination: Pagination;
  order: Order;
  extraFilter?: { [key: string]: any };
}

export interface SetSearchAction extends AnyAction {
  payload: {
    search: string | { value; [key: string]: any };
  };
}

export interface SetPageAction extends AnyAction {
  payload: {
    page: number;
  };
}

export interface SetPerPageAction extends AnyAction {
  payload: {
    per_page: number;
  };
}

export interface SetOrderAction extends AnyAction {
  payload: {
    sort: string | null;
    dir: string | null;
  };
}

export interface UpdateExtraFilterAction extends AnyAction {
  payload: {
    value: { [key: string]: any };
  };
}

export interface SetResetAction extends AnyAction {
  payload: {
    state: State;
  };
}

export type ActionTypes = {
  SET_SEARCH: string;
  SET_PAGE: string;
  SET_PER_PAGE: string;
  SET_ORDER: string;
  SET_RESET: string;
  UPDATE_EXTRA_FILTER: string;
};

export type ActionCreators = {
  setSearch(payload: SetSearchAction['payload']): SetSearchAction;
  setPage(payload: SetPageAction['payload']): SetPageAction;
  setPerPage(payload: SetPerPageAction['payload']): SetPerPageAction;
  setOrder(payload: SetOrderAction['payload']): SetOrderAction;
  setReset(payload: SetResetAction['payload']): SetResetAction;
  updateExtraFilter(payload: UpdateExtraFilterAction['payload']): UpdateExtraFilterAction;
};

export type Actions =
  | SetSearchAction
  | SetPageAction
  | SetPerPageAction
  | SetOrderAction
  | SetResetAction
  | UpdateExtraFilterAction;
