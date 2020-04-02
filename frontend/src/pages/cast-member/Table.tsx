import * as React from 'react';
import MUIDataTable, {MUIDataTableColumn} from "mui-datatables";
import {useEffect, useState} from "react";
import {httpVideo} from "../../util/http";
import format from "date-fns/format";
import parseIso from "date-fns/parseISO";

const CastMemberTypeMap = {
    1: 'Diretor',
    2: 'Ator'
};

const columnsDefinition:MUIDataTableColumn[] = [
    {
        name: "name",
        label: "Nome"
    },
    {
        name: "type",
        label: "Tipo?",
        options: {
            customBodyRender(value, tableMeta, updateValue){
                return CastMemberTypeMap[value];
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
];

type Props = {
    
};
const Table = (props: Props) => {

    const [data, setData] = useState([]);
    useEffect(() => {
        httpVideo.get('cast-members').then(
            response => setData(response.data.data)
        )
    }, []);

    return (
        <div>
            <MUIDataTable
                title="Listagem de Membros de Elencos"
                columns={columnsDefinition}
                data={data}
            />
        </div>
    );
};

export default Table;