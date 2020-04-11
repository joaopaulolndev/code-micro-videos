import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import categoryHttp from '../../util/http/category-http';
import { formatDate } from '../../util/format';
import DefaultTable, { MuiDataTableRefComponent, TableColumn } from '../../components/DefaultTable';
import { BadgeNo, BadgeYes } from '../../components/Badge';
import { Category, ListResponse } from '../../util/models';
import FilterResetButton from '../../components/DefaultTable/FilterResetButton';
import useFilter from '../../hooks/useFilter';
import * as Yup from '../../util/vendor/yup';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const DEBOUNCE_TIME = 300;
const DEBOUNCE_SEARCH_TIME = 300;
const ROWS_PER_PAGE = 10;
const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

const columnsDefinition: TableColumn[] = [
    {
        name: 'name',
        label: 'Nome',
        options: {
            filter: false,
        },
    },
    {
        name: 'is_active',
        label: 'Ativo?',
        width: '15%',
        options: {
            filter: true,
            filterType: 'dropdown',
            filterOptions: {
                names: ['Sim', 'Não'],
            },
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <BadgeYes /> : <BadgeNo />;
            },
        },
    },
    {
        name: 'created_at',
        label: 'Criado em',
        width: '15%',
        options: {
            filter: false,
            customBodyRender(value, tableMeta, updateValue) {
                return formatDate(value, "dd/MM/yyyy 'às' H:mm");
            },
        },
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
                        <Link to={`/categories/${value}/edit`}><EditIcon color={"secondary"} /></Link>
                        <Link to={`/categories/${value}/delete`}><DeleteIcon color={"error"} /></Link>
                    </>
                );
            },
        },
    },
];

type TableProps = {};

const Table: React.FC = (props: TableProps) => {
    const snackbar = useSnackbar();
    const subscribed = useRef(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const tableRef = useRef() as MutableRefObject<MuiDataTableRefComponent>;
    const {
        columns,
        filterManager,
        filterState,
        debounceFilterState,
        totalRecords,
        setTotalRecords,
    } = useFilter({
        columns: columnsDefinition,
        rowsPerPage: ROWS_PER_PAGE,
        rowsPerPageOptions: ROWS_PER_PAGE_OPTIONS,
        debounceTime: DEBOUNCE_TIME,
        tableRef,
        extraFilter: {
            createValidationSchema: () => {
                return Yup.object().shape({
                    is_active: Yup.string()
                        .nullable()
                        .transform((value) => (!value || !['Sim', 'Não'].includes(value) ? undefined : value))
                        .default(null),
                });
            },
            formatSearchParams: (debouncedState) => {
                return debouncedState.extraFilter
                    ? {
                        ...(debouncedState.extraFilter.is_active !== null && {
                            is_active: debouncedState.extraFilter.is_active,
                        }),
                    }
                    : undefined;
            },
            getStateFromUrl: (queryParams) => ({ is_active: queryParams.get('is_active') }),
        },
    });

    useEffect(() => {
        subscribed.current = true;
        filterManager.pushHistory();
        getData();
        return () => {
            subscribed.current = false;
        };
        // eslint-disable-next-line
    }, [
        filterManager.cleanSearchText(debounceFilterState.search), // eslint-disable-line
        debounceFilterState.pagination.page,
        debounceFilterState.pagination.per_page,
        debounceFilterState.order,
        JSON.stringify(debounceFilterState.extraFilter), // eslint-disable-line
    ]);

    // column is_active
    const indexColumnIsActive = columns.findIndex((column) => column.name === 'is_active');
    const columnIsActive = columns[indexColumnIsActive];
    const isActiveFilterValue =
        filterState.extraFilter && (filterState.extraFilter.is_active as never);
    (columnIsActive.options as any).filterList = isActiveFilterValue ? [isActiveFilterValue] : [];

    const serverSideFilterList = columns.map((column) => []);
    if (isActiveFilterValue !== undefined && isActiveFilterValue !== null) {
        serverSideFilterList[indexColumnIsActive] = [isActiveFilterValue];
    }

    async function getData() {
        setLoading(true);

        try {
            const response = await categoryHttp.list<ListResponse<Category>>({
                queryParams: {
                    search: filterManager.cleanSearchText(filterState.search),
                    page: filterState.pagination.page,
                    per_page: filterState.pagination.per_page,
                    sort: filterState.order.sort,
                    dir: filterState.order.dir,
                    ...(debounceFilterState.extraFilter &&
                        debounceFilterState.extraFilter.is_active !== null && {
                            is_active: debounceFilterState.extraFilter.is_active === 'Sim',
                        }),
                },
            });
            if (subscribed.current) {
                setCategories(response.data.data);
                setTotalRecords(response.data.meta.total);
            }
        } catch (error) {
            if (categoryHttp.isCancelledRequest(error)) return;
            snackbar.enqueueSnackbar('Não foi possível carregar as informações.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <DefaultTable
            title=""
            columns={columns}
            data={categories}
            loading={loading}
            debouncedSearchTime={DEBOUNCE_SEARCH_TIME}
            ref={tableRef}
            options={{
                serverSide: true,
                serverSideFilterList,
                responsive: 'scrollMaxHeight',
                searchText: filterState.search as any,
                page: filterState.pagination.page - 1,
                rowsPerPage: filterState.pagination.per_page,
                rowsPerPageOptions: ROWS_PER_PAGE_OPTIONS,
                count: totalRecords,
                customToolbar: () => <FilterResetButton handleClick={() => filterManager.resetFilter()} />,
                onFilterChange: (changedColumn, filterList) => {
                    if (changedColumn === 'is_active') {
                        filterManager.changeExtraFilter({
                            [changedColumn]:
                                filterList[indexColumnIsActive][0] !== undefined
                                    ? filterList[indexColumnIsActive][0]
                                    : null,
                        });
                    }
                },
                onSearchChange: (value) => filterManager.changeSearch(value),
                onChangePage: (page) => filterManager.changePage(page),
                onChangeRowsPerPage: (perPage) => filterManager.changeRowsPerPage(perPage),
                onColumnSortChange: (changedColumn, direction) =>
                    filterManager.changeColumnSort(changedColumn, direction),
            }}
        />
    );
};

export default Table;