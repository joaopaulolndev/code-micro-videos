import { RouteProps } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import CategoryList from '../pages/Category/PageList';
import CategoryForm from '../pages/Category/PageForm';
import CastMemberList from '../pages/CastMember/PageList';
import CastMemberForm from '../pages/CastMember/PageForm';
import GenreList from '../pages/Genre/PageList';
import GenreForm from '../pages/Genre/PageForm';
import VideoList from '../pages/Video/PageList';
import VideoForm from '../pages/Video/PageForm';

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
    exact: true,
  },
  {
    name: 'categories.list',
    label: 'Listar categorias',
    path: '/categories',
    component: CategoryList,
    exact: true,
  },
  {
    name: 'categories.create',
    label: 'Criar categorias',
    path: '/categories/create',
    component: CategoryForm,
    exact: true,
  },
  {
    name: 'categories.edit',
    label: 'Editar categoria',
    path: '/categories/:id/edit',
    component: CategoryForm,
    exact: true,
  },
  {
    name: 'cast_members.list',
    label: 'Listar membros de elencos',
    path: '/cast-members',
    component: CastMemberList,
    exact: true,
  },
  {
    name: 'cast_members.create',
    label: 'Criar membro de elenco',
    path: '/cast-members/create',
    component: CastMemberForm,
    exact: true,
  },
  {
    name: 'cast_members.edit',
    label: 'Editar membro de elenco',
    path: '/cast-members/:id/edit',
    component: CastMemberForm,
    exact: true,
  },
  {
    name: 'genres.list',
    label: 'Listar gêneros',
    path: '/genres',
    component: GenreList,
    exact: true,
  },
  {
    name: 'genres.create',
    label: 'Criar gênero',
    path: '/genres/create',
    component: GenreForm,
    exact: true,
  },
  {
    name: 'genres.edit',
    label: 'Editar gênero',
    path: '/genres/:id/edit',
    component: GenreForm,
    exact: true,
  },
  {
    name: 'videos.list',
    label: 'Listar vídeos',
    path: '/videos',
    component: VideoList,
    exact: true,
  },
  {
    name: 'videos.create',
    label: 'Criar vídeo',
    path: '/videos/create',
    component: VideoForm,
    exact: true,
  },
  {
    name: 'videos.edit',
    label: 'Editar vídeo',
    path: '/videos/:id/edit',
    component: VideoForm,
    exact: true,
  },
];

export default routes;
