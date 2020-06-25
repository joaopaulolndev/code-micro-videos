import * as React from 'react';
import {Page} from "../../components/Page";
import {Box, Fab} from "@material-ui/core";
import {Link} from "react-router-dom";
import AddIcon from '@material-ui/icons/Add';
import Table from "./Table";

const PageList = () => {
    return (
        <Page title={'Listagem de vídeos'}>
            <Box dir={'rtl'} paddingBottom={2}>
                <Fab
                    title="Adicionar vídeo"
                    color={'secondary'}
                    size="small"
                    component={Link}
                    to="/videos/create"
                >
                    <AddIcon/>
                </Fab>
            </Box>
            <Box>
                <Table/>
            </Box>
        </Page>
    );
};


export default PageList;
