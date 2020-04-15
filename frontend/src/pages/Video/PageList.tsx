import * as React from 'react';
import { Link } from 'react-router-dom';
import { Box, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Page } from '../../components/Page';
import Table from './Table';

const PageList: React.FC = () => (
  <Page title="Listagem vídeos">
    <Box dir="rtl" paddingBottom={2}>
      <Fab
        title="Adicionar vídeo"
        color="secondary"
        size="small"
        component={Link}
        to="/videos/create"
      >
        <AddIcon />
      </Fab>
    </Box>
    <Box>
      <Table />
    </Box>
  </Page>
);

export default PageList;
