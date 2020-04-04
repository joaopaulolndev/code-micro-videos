import * as React from 'react';
import {
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
import {useEffect, useState} from "react";

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
        variant: "outlined"
    };

    const [categories, setCategories] = useState<any[]>([]);
    const {register, handleSubmit, getValues, setValue, watch} = useForm({
        defaultValues: {categories_id: []}
    });

    useEffect(()=> {
        register({name:"categories_id"})
    },[register]);

    useEffect(()=> {
        categoryHttp
            .list()
            .then(({data}) => setCategories(data.data));
    },[]);

    function onSubmit(formData, event){
        console.log(event);
        genreHttp
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
            <TextField
                select
                name="categories_id"
                label="Categorias"
                value={watch('categories_id')}
                margin="normal"
                variant="outlined"
                fullWidth
                onChange={(e) => {
                    setValue('categories_id', e.target.value, true);
                }}
                SelectProps={{ multiple: true }}
            >
                <MenuItem value="" disabled>
                    <em>Selecione categorias</em>
                </MenuItem>
                {categories.map(
                    (category, key) => (
                    <MenuItem key={key} value={category.id}>{category.name}</MenuItem>
                ))}
            </TextField>

            <Box dir={"rtl"}>
                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
};