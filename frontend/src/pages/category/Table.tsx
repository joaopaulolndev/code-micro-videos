import * as React from 'react';
import {MUIDataTableColumn} from "mui-datatables";
import {useEffect, useState} from "react";
import format from "date-fns/format";
import parseIso from "date-fns/parseISO";
import categoryHttp from "../../util/http/category-http";
import {BadgeYes, BadgeNo} from "../../components/Badge"
import { Category, ListResponse } from '../../util/models';
import DefaultTable from "../../components/DefaultTable";
import {Link} from "react-router-dom";
import {useSnackbar} from "notistack";

const columnsDefinition:MUIDataTableColumn[] = [
    {
        name: "name",
        label: "Nome",
    },
    {
        name: "is_active",
        label: "Ativo?",
        options: {
            customBodyRender(value, tableMeta, updateValue){
                return value ? <BadgeYes /> : <BadgeNo/>;
            }
        }
    },
    {
        name: "created_at",
        label: "Criado em",
        options: {
            customBodyRender(value, tableMeta, updateValue){
                return <span>{format(parseIso(value),'dd/MM/yyyy')}</span>
            }
        }
    },
    {
        name: 'id',
        label: 'Ações',
        options: {
            sort: false,
            print: false,
            filter: false,
            searchable: false,
            setCellProps: (value) => ({
                style: {
                    width: '10%',
                    whiteSpace: 'nowrap',
                },
            }),
            customBodyRender(value, tableMeta, updateValue) {
                return (
                    <>
                        <Link to={`/categories/${value}/edit`}>editar</Link>
                        {' | '}
                        <Link to={`/categories/${value}/delete`}>deletar</Link>
                    </>
                );
            },
        },
    },
];

type Props = {
    
};
const Table = (props: Props) => {

    const snackbar = useSnackbar();
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        let isSubscribed = true;
        (async () => {
            setLoading(true);
            try {
                const {data} = await categoryHttp.list<ListResponse<Category>>();
                if(isSubscribed)
                    setData(data.data);
            } catch (error) {
                snackbar.enqueueSnackbar('Não foi possível carregar as categorias.', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            isSubscribed = false;
        }
    }, []);

    return (
        <div>
            <DefaultTable
                title="Listagem de Categorias"
                columns={columnsDefinition}
                data={data}
                loading={loading}
                options={{
                    responsive: 'scrollMaxHeight',
                }}
            />
        </div>
    );
};

export default Table;