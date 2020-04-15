import { ComponentNameToClassKey } from '@material-ui/core/styles/overrides';
import {
  Palette,
  PaletteColor,
  PaletteColorOptions,
  PaletteOptions,
} from '@material-ui/core/styles/createPalette';

declare module '@material-ui/core/styles/overrides' {
  interface ComponentNameToClassKey {
    MUIDataTable: any;
    MUIDataTableToolbar: any;
    MUIDataTableHeadCell: any;
    MUIDataTableSortLabel: any;
    MUIDataTableSelectCell: any;
    MUIDataTableBodyCell: any;
    MUIDataTableToolbarSelect: any;
    MUIDataTableBodyRow: any;
    MUIDataTablePagination: any;
    MUIDataTableFilterList: any;
  }
}

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    success?: PaletteColor;
  }

  interface PaletteOptions {
    success?: PaletteColorOptions;
  }
}
