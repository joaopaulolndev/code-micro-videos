import {RouteProps} from 'react-router-dom'
import Dashboard from "../pages/Dashboard";
import CategoryList from "../pages/category/PageList";
import CastMemberList from "../pages/cast-member/PageList";
import GenreList from "../pages/genre/PageList";
import PageForm from "../pages/category/PageForm";

export interface MyRouteProps extends RouteProps {
    name: string;
    label: string;
}

const routes: MyRouteProps[] = [
    {
        name: 'dashboard',
        label: 'Dashboard',
        path: '/',
        component: Dashboard,
        exact: true
    },
    {
        name: 'categories.list',
        label: 'Listar Categorias',
        path: '/categories',
        component: CategoryList,
        exact: true
    },
    {
        name: 'categories.create',
        label: 'Criar Categoria',
        path: '/categories/create',
        component: PageForm,
        exact: true
    },
    {
        name: 'categories.edit',
        label: 'Editar Categoria',
        path: '/categories/:id/edit',
        component: CategoryList,
        exact: true
    },
    {
        name: 'cast_members.list',
        label: 'Lista membros de elenco',
        path: '/cast-members',
        component: CastMemberList,
        exact: true
    },
    {
        name: 'cast_members.create',
        label: 'Criar membros de elenco',
        path: '/cast-members/create',
        component: CastMemberList,
        exact: true
    },
    {
        name: 'genres.list',
        label: 'Lista gêneros',
        path: '/genres',
        component: GenreList,
        exact: true
    },
    {
        name: 'genres.create',
        label: 'Criar gêneros',
        path: '/genres/create',
        component: GenreList,
        exact: true
    }
];

export default routes;