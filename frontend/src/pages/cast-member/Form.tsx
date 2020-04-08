import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
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
    FormLabel, FormHelperText
}
    from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useForm} from "react-hook-form";
import { useSnackbar } from 'notistack';
import * as yup from '../../util/vendor/yup';
import castMemberHttp from "../../util/http/cast-member-http";

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
    type: yup.number()
        .label('Tipo')
        .required(),
});

export const Form = () => {

    const { id } = useParams();
    const history = useHistory();
    const snackbar = useSnackbar();
    const [castMember, setCastMember] = useState<{id:string} | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const classes = useStyles();

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
    } = useForm({ validationSchema, });

    useEffect(()=> {
        register({name:"type"})
    },[register]);

    useEffect(()=> {
        if(!id){
            return;
        }

        async function getCastMember(){
            setLoading(true);
            try {
                const {data} = await castMemberHttp.get(id);
                setCastMember(data.data);
                reset(data.data);
            }catch (error) {
                snackbar.enqueueSnackbar('Não foi possível carregar as informações.', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        }
        getCastMember();
    },[id, reset, snackbar]);

    async function onSubmit(formData, event){
        setLoading(true);
        try {
            const http = !castMember
                ? await castMemberHttp.create(formData)
                : await castMemberHttp.update(castMember.id, formData);
            const {data} = await http;
            snackbar.enqueueSnackbar('Membro de elenco salvo com sucesso.', { variant: 'success' });
            setTimeout(() => {
                event
                    ? (id
                        ? history.replace(`/cast-members/${data.data.id}/edit`)
                        : history.push(`/cast-members/${data.data.id}/edit`)
                    )
                    : history.push('/cast-members');
            });
        } catch (e) {
            snackbar.enqueueSnackbar('Não foi possível salvar o membro de elenco.', { variant: 'error' });
        } finally {
            setLoading(false);
        }

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
            <FormControl
                margin="normal"
                error={(errors as any).type !== undefined}
                disabled={loading}
            >
                <FormLabel component="legend">Tipo</FormLabel>
                <RadioGroup aria-label="type"
                    name="type"
                    onChange={(e) => {
                        setValue('type', parseInt(e.target.value))
                    }}
                    value={watch('type') + ""}
                >
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
                {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
            </FormControl>

            <Box dir={"rtl"}>
                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
};