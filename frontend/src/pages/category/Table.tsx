import * as React from 'react';
import MUIDataTable, {MUIDataTableColumn} from "mui-datatables";

const columnsDefinition:MUIDataTableColumn[] = [
    {
        name: "name",
        label: "Nome"
    },
    {
        name: "is_active",
        label: "Ativo?"
    },
    {
        name: "created_at",
        label: "Criado em"
    },
];

const data = [
    {name:"teste1", is_active: true, created_at: "2019-12-12"},
    {name:"teste2", is_active: false, created_at: "2019-12-13"},
    {name:"teste3", is_active: true, created_at: "2019-12-14"},
    {name:"teste4", is_active: false, created_at: "2019-12-15"}
];
type Props = {
    
};
const Table = (props: Props) => {
    return (
        <div>
            <MUIDataTable
                title="Listagem de Categorias"
                columns={columnsDefinition}
                data={data}
            />
        </div>
    );
};

export default Table;