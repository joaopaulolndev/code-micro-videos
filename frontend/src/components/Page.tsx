// @flow 
import * as React from 'react';
import {Container, Typography, makeStyles} from "@material-ui/core";

const userStyles = makeStyles({
   title:{
       color: '#999999'
   }
});

type PageProps = {
    title: string
};
export const Page:React.FC<PageProps> = (props) => {

    const classes = userStyles();

    return (
        <Container>
            <Typography className={classes.title} component="h1" variant="h5">
                {props.title}
            </Typography>
            {props.children}
        </Container>
    );
};