import * as React from 'react';
import {
    Box,
    Button,
    ButtonProps,
    TextField,
    Theme,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormLabel
}
from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useForm} from "react-hook-form";
import castMemberHttp from "../../util/http/cast-member-http";
import {useEffect} from "react";

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    };
});

export const Form = () => {

    const classes = useStyles();

    const buttonProps: ButtonProps = {
        className: classes.submit,
        color: "secondary",
        variant: "contained"
    };

    const {register, handleSubmit, getValues, setValue} = useForm();

    useEffect(()=> {
        register({name:"type"})
    },[register]);

    function onSubmit(formData, event){
        console.log(event);
        castMemberHttp
            .create(formData)
            .then((response) => console.log(response))
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                name="name"
                inputRef={register}
                label="Nome"
                fullWidth
                variant={'outlined'}
            />
            <FormControl margin="normal">
                <FormLabel component="legend">Tipo</FormLabel>
                <RadioGroup aria-label="type"
                    name="type"
                    onChange={(e) => {
                        setValue('type', parseInt(e.target.value))
                    }}>
                    <FormControlLabel
                        value="1"
                        control={<Radio color="primary" />}
                        label="Diretor"
                    />
                    <FormControlLabel
                        value="2"
                        control={<Radio color="primary" />}
                        label="Ator"
                    />
                </RadioGroup>
            </FormControl>

            <Box dir={"rtl"}>
                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
};