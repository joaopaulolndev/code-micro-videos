import * as React from 'react';
import { useParams } from 'react-router';
import { Page } from '../../components/Page';
import Form from './Form';

const PageForm: React.FC = () => {
  const { id } = useParams();

  return (
    <Page title={!id ? 'Criar vídeo' : 'Editar vídeo'}>
      <Form />
    </Page>
  );
};

export default PageForm;
