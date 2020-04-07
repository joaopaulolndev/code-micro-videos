import * as React from 'react';
import {useEffect, useState} from "react";
import { useHistory, useParams } from 'react-router';
import {Box, Button, ButtonProps, Checkbox, FormControlLabel, TextField, Theme} from "@material-ui/core";
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

    const { id } = useParams();
    const [category, setCategory] = useState<{id: string} | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const classes = useStyles();
    const history = useHistory();

    const buttonProps: ButtonProps = {
        className: classes.submit,
        color: "secondary",
        variant: "contained",
        disabled: loading
    };

    const {register, handleSubmit, setValue, getValues, errors, reset, watch} = useForm({
        validationSchema,
        defaultValues: {
            is_active: true
        }
    });

    useEffect(() => {
        register({ name: 'is_active' });
    }, [register]);


    useEffect(() => {

        if (!id) return;

        setLoading(true);

        categoryHttp
            .get(id)
            .then(({data}) => {
                setCategory(data.data);
                reset(data.data);
            }).finally(() => setLoading(false));
    }, []); // eslint-disable-line

    function onSubmit(formData, event){

        setLoading(true);

        const http = !category
            ? categoryHttp.create(formData)
            : categoryHttp.update(category.id, formData);

        http
            .then((response) => {
                setTimeout(() => {
                    event
                        ? id
                            ? history.replace(`/categories/${response.data.data.id}/edit`)
                            : history.push(`/categories/${response.data.data.id}/edit`)
                        : history.push('/categories');
                });
            })
            .finally(() => setLoading(false));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                name="name"
                inputRef={register}
                label="Nome"
                fullWidth
                variant={'outlined'}
                disabled={loading}
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
                disabled={loading}
                margin={'normal'}
                InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
                disabled={loading}
                control={
                    <Checkbox
                        name="is_active"
                        color="primary"
                        onChange={() => setValue('is_active', !getValues().is_active)}
                        //checked={watch('is_active')}
                        checked={true}
                    />
                }
                label="Ativo?"
                labelPlacement="end"
            />

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