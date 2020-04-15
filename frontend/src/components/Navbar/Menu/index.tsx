import * as React from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Menu as MUIMenu, MenuItem } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';

import routes, { MyRouteProps } from '../../../routes';

const listRoutes = {
  dashboard: 'Dashboard',
  'categories.list': 'Categorias',
  'cast_members.list': 'Membros de elenco',
  'genres.list': 'Gêneros',
  'videos.list': 'Vídeos',
};

const menuRoutes = routes.filter((route) => Object.keys(listRoutes).includes(route.name));

export const Menu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: any) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        aria-controls="menu-appbar"
        aira-haspopup="true"
        onClick={handleOpen}
      >
        <MenuIcon />
      </IconButton>

      <MUIMenu
        id="menu-appbar"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        getContentAnchorEl={null}
      >
        {Object.keys(listRoutes).map((routeName, key) => {
          const menu = menuRoutes.find((route) => route.name === routeName) as MyRouteProps;
          return (
            <MenuItem
              key={String(key)}
              component={Link}
              to={menu.path as string}
              onClick={handleClose}
            >
              {listRoutes[routeName]}
            </MenuItem>
          );
        })}
      </MUIMenu>
    </>
  );
};
