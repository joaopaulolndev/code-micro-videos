import * as React from 'react';
import { Link } from 'react-router-dom';
import { Box, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Page } from '../../components/Page';
import Table from './Table';

type ListProps = {};

const PageList: React.FC = (props: ListProps) => (
  <Page title="Listagem de gêneros">
    <Box dir="rtl" paddingBottom={2}>
      <Fab
        title="Adicionar gênero"
        color="secondary"
        size="small"
        component={Link}
        to="/genres/create"
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
