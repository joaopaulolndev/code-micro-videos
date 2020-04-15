import * as React from 'react';
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
  MUIDataTableProps,
} from 'mui-datatables';
import { cloneDeep, merge, omit } from 'lodash';
import { MuiThemeProvider, Theme, useMediaQuery, useTheme } from '@material-ui/core';
import DebouncedTableSearch from './DebouncedTableSearch';

export interface TableColumn extends MUIDataTableColumn {
  width?: string;
}

const makeDefaultOptions = (debouncedSearchTime?): MUIDataTableOptions => ({
  print: false,
  download: false,
  textLabels: {
    body: {
      noMatch: 'Nenhum registro encontrado',
      toolTip: 'Classificar',
    },
    pagination: {
      next: 'Próxima página',
      previous: 'Página anterior',
      rowsPerPage: 'Por página',
      displayRows: 'de',
    },
    toolbar: {
      search: 'Buscar',
      downloadCsv: 'Download CSV',
      print: 'Imprimir',
      viewColumns: 'Ver Colunas',
      filterTable: 'Filtrar Tabela',
    },
    filter: {
      all: 'Todos',
      title: 'FILTROS',
      reset: 'LIMPAR',
    },
    viewColumns: {
      title: 'Ver Colunas',
      titleAria: 'Ver/Esconder Colunas da Tabela',
    },
    selectedRows: {
      text: 'registro(s) selecionado(s)',
      delete: 'Excluir',
      deleteAria: 'Excluir registros selecionados',
    },
  },
  customSearchRender: (searchText: string, handleSearch: any, hideSearch: any, options: any) => (
    <DebouncedTableSearch
      searchText={searchText}
      onSearch={handleSearch}
      onHide={hideSearch}
      options={options}
      debounceTime={debouncedSearchTime}
    />
  ),
});

export interface MuiDataTableRefComponent {
  changePage: (page: number) => void;
  changeRowsPerPage: (rowsPerPage: number) => void;
}

interface DefaultTableProps
  extends MUIDataTableProps,
    React.RefAttributes<MuiDataTableRefComponent> {
  columns: TableColumn[];
  loading?: boolean;
  debouncedSearchTime?: number;
}

const DefaultTable: React.RefForwardingComponent<MuiDataTableRefComponent, DefaultTableProps> = (
  props,
  ref,
) => {
  function extractMUIDataTableColumns(columns: TableColumn[]): MUIDataTableColumn[] {
    setColumnsWith(columns);
    return columns.map((column) => omit(column, 'width'));
  }

  function setColumnsWith(columns: TableColumn[]) {
    columns.forEach((column, key) => {
      if (column.width) {
        const overrides = theme.overrides as any;
        overrides.MUIDataTableHeadCell.fixedHeaderCommon[`&:nth-child(${key + 2})`] = {
          width: column.width,
        };
      }
    });
  }

  function applyLoading() {
    const { body } = (newProps.options as any).textLabels;
    body.noMatch = newProps.loading === true ? 'Carregando...' : body.noMatch;
  }

  function getOriginalMUIDataTableProps() {
    return { ...omit(newProps, 'loading'), ref };
  }

  function applyResponsive() {
    newProps.options.responsive = isSmOrDown ? 'scrollMaxHeight' : 'stacked';
  }

  const theme = cloneDeep<Theme>(useTheme());
  const isSmOrDown = useMediaQuery(theme.breakpoints.down('sm'));
  const defaultOptions = makeDefaultOptions(props.debouncedSearchTime);

  const newProps = merge({ options: cloneDeep(defaultOptions) }, props, {
    columns: extractMUIDataTableColumns(props.columns),
  });

  applyLoading();
  applyResponsive();

  const originalProps = getOriginalMUIDataTableProps();

  return (
    <MuiThemeProvider theme={theme}>
      <MUIDataTable {...originalProps} />
    </MuiThemeProvider>
  );
};

export default React.forwardRef(DefaultTable);
