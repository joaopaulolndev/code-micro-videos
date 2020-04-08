import React, { useEffect, useState } from 'react';
import {
    Checkbox,
    FormControlLabel,
    Box,
    Button,
    ButtonProps,
    TextField,
    Theme,
    MenuItem
}
    from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useForm} from "react-hook-form";
import genreHttp from "../../util/http/genre-http";
import categoryHttp from "../../util/http/category-http";
import { useSnackbar } from 'notistack';
import * as yup from '../../util/vendor/yup';
import {useHistory, useParams} from "react-router";

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
    categories_id: yup.array()
        .label('Categorias')
        .required(),
});

export const Form = () => {

    const { id } = useParams();
    const history = useHistory();
    const snackbar = useSnackbar();
    const classes = useStyles();
    const [genre, setGenre] = useState<{id:string} | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const buttonProps: ButtonProps = {
        className: classes.submit,
        color: "secondary",
        variant: "contained",
        disabled: loading
    };

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        errors,
        reset,
        watch,
    } = useForm({
        validationSchema,
        defaultValues: {
            categories_id: [],
            is_active: false,
        },
    });

    useEffect(()=> {
        register({ name: 'categories_id' });
        register({ name: 'is_active' });
    },[register]);

    useEffect(() => {
        let isSubscribed = true;

        (async () => {
            setLoading(true);

            try {
                const promises = [categoryHttp.list()];

                if (id) promises.push(genreHttp.get(id));

                const [categoryResponse, genreResponse] = await Promise.all(promises);

                if (isSubscribed) {
                    setCategories(categoryResponse.data.data);

                    if (id) {
                        setGenre(genreResponse.data.data);
                        reset({
                            ...genreResponse.data.data,
                            categories_id: genreResponse.data.data.categories.map((category) => category.id),
                        });
                    }
                }
            } catch (error) {
                snackbar.enqueueSnackbar('Não foi possível carregar as informações.', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            isSubscribed = false;
        };
    }, []); // eslint-disable-line

    const handleChange = (event) => {
        setValue('categories_id', event.target.value);
    };

    function onSubmit(formData, event) {
        setLoading(true);

        const http = !genre ? genreHttp.create(formData) : genreHttp.update(genre.id, formData);

        http
            .then((response) => {
                snackbar.enqueueSnackbar('Gênero salvo com sucesso.', { variant: 'success' });
                setTimeout(() => {
                    event
                        ? id
                            ? history.replace(`/genres/${response.data.data.id}/edit`)
                            : history.push(`/genres/${response.data.data.id}/edit`)
                        : history.push('/genres');
                });
            })
            .catch((error) => {
                snackbar.enqueueSnackbar('Não foi possível salvar o gênero.', { variant: 'error' });
                console.log(error);
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
                select
                name="categories_id"
                label="Categorias"
                value={watch('categories_id')}
                margin="normal"
                variant="outlined"
                fullWidth
                onChange={handleChange}
                SelectProps={{ multiple: true }}
                disabled={loading}
                error={errors.categories_id !== undefined}
                helperText={errors.categories_id && errors.categories_id['message']} // eslint-disable-line
                InputLabelProps={{ shrink: true }}
            >
                <MenuItem value="" disabled>
                    <em>Selecione categorias</em>
                </MenuItem>
                {categories.map(
                    (category, key) => (
                    <MenuItem key={key} value={category.id}>{category.name}</MenuItem>
                ))}
            </TextField>
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
                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
};