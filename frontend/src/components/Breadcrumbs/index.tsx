import React from 'react';
import Link, { LinkProps } from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import MUIBreadcrumbs from '@material-ui/core/Breadcrumbs';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Route } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { Location } from 'history';
import RouteParser from 'route-parser';
import routes from '../../routes';

const breadcrumbNameMap: { [key: string]: string } = {};
routes.forEach((route) => {
  breadcrumbNameMap[route.path as string] = route.label;
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    linkRouter: {
      color: theme.palette.secondary.main,
      '&:focus, &:active': {
        color: theme.palette.secondary.main,
        textDecoration: 'none',
      },
      '&:hover': {
        color: theme.palette.secondary.dark,
        textDecoration: 'none',
      },
    },
  }),
);

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

const LinkRouter = (props: LinkRouterProps) => <Link {...props} component={RouterLink as any} />;

export default function Breadcrumbs() {
  const classes = useStyles();

  function makeBreadcrumbs(location: Location) {
    const pathnames = location.pathname.split('/').filter((x) => x);
    pathnames.unshift('/'); // ['/', 'categories', 'create']

    return (
      <MUIBreadcrumbs aria-label="breadcrumb">
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = pathnames
            .slice(0, index + 1)
            .join('/')
            .replace('//', '/'); // /categories | /categories
          const route = Object.keys(breadcrumbNameMap).find((path) =>
            new RouteParser(path).match(to),
          );

          if (route === undefined) return false;

          return last ? (
            <Typography color="textPrimary" key={to}>
              {breadcrumbNameMap[route]}
            </Typography>
          ) : (
            <LinkRouter color="inherit" to={to} key={to} className={classes.linkRouter}>
              {breadcrumbNameMap[route]}
            </LinkRouter>
          );
        })}
      </MUIBreadcrumbs>
    );
  }

  return (
    <Container>
      <Box paddingTop={2} paddingBottom={1}>
        <Route>{({ location }) => makeBreadcrumbs(location)}</Route>
      </Box>
    </Container>
  );
}
