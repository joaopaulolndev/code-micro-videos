import { createMuiTheme, SimplePaletteColorOptions } from '@material-ui/core';
import { PaletteOptions } from '@material-ui/core/styles/createPalette';
import { green, red } from '@material-ui/core/colors';

const palette: PaletteOptions = {
  primary: {
    main: '#79aec8',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#4db5ab',
    dark: '#055a52',
    contrastText: '#ffffff',
  },
  background: {
    default: '#fafafa',
  },
  success: {
    main: green['500'],
    contrastText: '#ffffff',
  },
  error: {
    main: red['500'],
    contrastText: '#ffffff',
  },
};

const theme = createMuiTheme({
  palette,
  overrides: {
    MUIDataTable: {
      paper: {
        boxShadow: 'none',
      },
    },
    MUIDataTableToolbar: {
      root: {
        minHeight: '58px',
        backgroundColor: palette.background?.default,
      },
      icon: {
        color: (palette!.primary as SimplePaletteColorOptions).main,
        '&:hover, &:active, &:focus': {
          color: (palette!.secondary as SimplePaletteColorOptions).dark,
        },
      },
      iconActive: {
        color: (palette!.secondary as SimplePaletteColorOptions).dark,
        '&:hover, &:active, &:focus': {
          color: (palette!.secondary as SimplePaletteColorOptions).dark,
        },
      },
    },
    MUIDataTableHeadCell: {
      fixedHeaderCommon: {
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: (palette!.primary as SimplePaletteColorOptions).main,
        color: '#ffffff',
        '&[aria-sort]': {
          backgroundColor: '#459ac4',
        },
      },
      sortActive: {
        color: '#ffffff',
      },
      sortAction: {
        alignItems: 'center',
      },
      sortLabelRoot: {
        '& svg': {
          color: '#ffffff !important',
        },
      },
    },
    MUIDataTableSelectCell: {
      root: {
        backgroundColor: 'transparent !important',
      },
      headerCell: {
        backgroundColor: `${(palette!.primary as SimplePaletteColorOptions).main} !important`,
        '& span': {
          color: '#ffffff !important',
        },
      },
    },
    MUIDataTableBodyCell: {
      root: {
        padding: 8,
        color: (palette!.secondary as SimplePaletteColorOptions).main,
        '&:hover, &:active, &:focus': {
          color: (palette!.secondary as SimplePaletteColorOptions).main,
        },
      },
    },
    MUIDataTableToolbarSelect: {
      title: {
        color: (palette!.primary as SimplePaletteColorOptions).main,
      },
      iconButton: {
        color: (palette!.primary as SimplePaletteColorOptions).main,
      },
    },
    MUIDataTableBodyRow: {
      root: {
        '&:nth-child(odd)': {
          backgroundColor: palette!.background!.default,
        },
      },
    },
    MUIDataTablePagination: {
      root: {
        color: (palette!.primary as SimplePaletteColorOptions).main,
      },
    },
    MUIDataTableFilterList: {
      chip: {
        marginBottom: '8px',
      },
    },
  },
});

export default theme;
