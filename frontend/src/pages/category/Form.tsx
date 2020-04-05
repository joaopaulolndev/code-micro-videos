import * as React from 'react';
import {Box, Button, ButtonProps, Checkbox, TextField, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useForm} from "react-hook-form";
import categoryHttp from "../../util/http/category-http";
import * as Yup from 'yup';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    };
});

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .label('Nome')
        .max(255)
        .required(),
});

export const Form = () => {

    const classes = useStyles();

    const buttonProps: ButtonProps = {
        className: classes.submit,
        color: "secondary",
        variant: "contained"
    };

    const {register, handleSubmit, getValues, errors} = useForm({
        validationSchema,
        defaultValues: {
            is_active: true
        }
    });

    function onSubmit(formData, event){
        console.log(event);
        categoryHttp
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
                error={errors.name !== undefined}
                helperText={errors.name && errors.name.message}
            />

            <TextField
                name="description"
                inputRef={register}
                label="Descrição"
                multiline
                rows="4"
                fullWidth
                variant={'outlined'}
                margin={'normal'}
            />
            <Checkbox
                name="is_active"
                color={"primary"}
                inputRef={register}
                defaultChecked
            />
            Ativo ?

            <Box dir={"rtl"}>
                <Button
                    color={"primary"}
                    {...buttonProps}
                    onClick={() => onSubmit(getValues(), null)}>
                    Salvar
                </Button>
                <Button
                    {...buttonProps}
                    type="submit">
                    Salvar e continuar editando
                </Button>
            </Box>
        </form>
    );
};