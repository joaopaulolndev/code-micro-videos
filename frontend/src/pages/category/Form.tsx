import * as React from 'react';
import {useEffect, useState} from "react";
import { useHistory, useParams } from 'react-router';
import {Box, Button, ButtonProps, Checkbox, TextField, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useForm} from "react-hook-form";
import categoryHttp from "../../util/http/category-http";
import * as yup from '../../util/vendor/yup';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    };
});

const validationSchema = yup.object().shape({
    name: yup.string()
        .label('Nome')
        .max(255)
        .required(),
});

export const Form = () => {


    const [loading, setLoading] = useState<boolean>(false);
    const classes = useStyles();

    const buttonProps: ButtonProps = {
        className: classes.submit,
        color: "secondary",
        variant: "contained"
    };

    const {register, handleSubmit, getValues, errors, reset} = useForm({
        validationSchema,
        defaultValues: {
            is_active: true
        }
    });

    useEffect(() => {
        register({ name: 'is_active' });
    }, [register]);

    const { id } = useParams();
    const [category, setCategory] = useState<{id: string} | null>(null);
    useEffect(() => {

        if (!id) return;

        categoryHttp
            .get(id)
            .then(({data}) => {
                setCategory(data.data);
                reset(data.data);
            })
    }, []); // eslint-disable-line

    function onSubmit(formData, event){
        const http = !category
            ? categoryHttp.create(formData)
            : categoryHttp.update(category.id, formData);

        http.then((response) => console.log(response))
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                name="name"
                inputRef={register}
                label="Nome"
                fullWidth
                variant={'outlined'}
                error={(errors as any).name !== undefined}
                helperText={(errors as any).name && (errors as any).name.message}
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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