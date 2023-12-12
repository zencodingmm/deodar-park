import React, { useEffect, useRef, useState, useCallback } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { update as transactionUpdate } from '@/features/transaction/transactionSlice';
import { update as entryUpdate } from '@/features/entry/entrySlice';
import { axiosInstance } from '@/utils/axiosInstance';

const RankReport = () => {
    const router = useRouter();
    const toastRef = useRef(null);

    const searchFilterValue = [
        { name: 'Employee ID', code: 'id' },
        // { name: "Name", code: "name" },
    ];

    const [filterDropdown, setFilterDropdown] = useState(searchFilterValue[0]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [searchAll, setSearchAll] = useState('filter');

    // redux-toolkit get Data
    const employeeRankList = useSelector(state => state.transaction.employeeRank);

    const rank = useSelector(state => state.entry.rankType);

    const dispatch = useDispatch();

    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Datatable edit handler
    const onEditHandler = async e => {
        try {
            const { newData } = e;

            const res = await axiosInstance.put(`/rank/transaction/${newData.emp_rank_id}`, newData);
            const { message } = res.data;

            if (res.status === 200) {
                fetchData().catch(error => console.log(error));
                toastRef.current.show({ severity: 'success', summary: 'Success', detail: message });
            }
        } catch (err) {
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Something Wrong!' });
        }
    };

    const onDeleteHandler = async options => {
        try {
            const res = await axiosInstance.delete(`/rank/transaction/${options.emp_rank_id}`);
            const { message } = res.data;

            if (res.status === 200) {
                fetchData().catch(error => console.log(error));
                toastRef.current.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
            }
        } catch (error) {
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Something Wrong!' });
        }
    };

    const dateTimeEditor = options => {
        return (
            <Calendar
                name={options.field}
                value={new Date(options.value)}
                onChange={e => options.editorCallback(e.target.value)}
            />
        );
    };

    const dropdownEditor = options => {
        const value = rank.find(item => item.rank_desc === options.value);

        return (
            <Dropdown
                value={value}
                onChange={e => {
                    options.editorCallback(e.value?.rank_desc);
                    options.rowData.salary = e.value?.salary;
                    options.rowData.rank_id = e.value?.rank_id;
                }}
                options={rank}
                optionLabel='rank_desc'
                placeholder='ရွေးချယ်ရန်'
            />
        );
    };

    // Filter
    // search filter
    const onSearchFilter = id => {};

    // clear filter
    const clearFilter = () => {
        setGlobalFilterValue('');
        setPage(0);
        setFirst(0);
        setRows(10);
    };

    // filter button all or filter
    const onFilterHandler = () => {
        if (searchAll !== 'all') {
            setSearchAll('all');
        } else {
            setSearchAll('filter');
        }
    };

    // on change filter value
    const onGlobalFilterChange = e => {
        setGlobalFilterValue(e.target.value);
    };

    console.log(employeeRankList);

    const renderHeader = () => {
        return (
            <div className='flex justify-content-between align-items-center'>
                <div className='flex gap-3'>
                    <div>
                        <Dropdown
                            value={filterDropdown}
                            onChange={e => {
                                setFilterDropdown(e.target.value);
                            }}
                            options={searchFilterValue}
                            optionLabel='name'
                        />
                    </div>
                    <div className='p-inputgroup w-20rem'>
                        <InputText
                            type='search'
                            placeholder='Search'
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                        />

                        <Button
                            label='Search'
                            onClick={() => onSearchFilter(globalFilterValue)}
                        />
                    </div>
                    <Button
                        label='Clear'
                        severity='danger'
                        onClick={clearFilter}
                    />
                </div>
                <Button
                    label={searchAll === 'all' ? 'Show Default' : 'Show All'}
                    severity='info'
                    onClick={onFilterHandler}
                />
            </div>
        );
    };

    const fetchRankType = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/rank/entry');
            const { data } = res.data;

            if (res.status === 200) {
                dispatch(entryUpdate({ stateProperty: 'rankType', data }));
            }
        } catch (error) {
            dispatch(entryUpdate({ stateProperty: 'rankType', data: [] }));
        }
    }, [dispatch]);

    useEffect(() => {
        fetchRankType().catch(error => console.log(error));
    }, [fetchRankType]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get(`/rank/transaction?page=${page}&pageSize=${rows}&showAll=${searchAll}`);
            const { data, totalRecord } = res.data;

            if (res.status === 200) {
                dispatch(transactionUpdate({ stateProperty: 'employeeRank', data }));
                setTotalRecord(totalRecord);
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            dispatch(transactionUpdate({ stateProperty: 'employeeRank', data: [] }));
        }
    }, [page, rows, dispatch, searchAll]);

    useEffect(() => {
        fetchData().catch(error => console.log(error));
    }, [fetchData]);

    return (
        <div className='flex-1'>
            <Toast ref={toastRef} />
            <div className='flex gap-5'>
                <Button
                    icon='pi pi-arrow-left'
                    rounded
                    raised
                    onClick={() => router.back()}
                />

                <div className='h-full'>
                    <h1 className='text-3xl underline'>Rank Reports</h1>
                </div>
            </div>

            <div className='col-12 mt-5 card'>
                {isLoading && (
                    <div className='flex justify-content-center align-items-center'>
                        <ProgressSpinner
                            style={{ width: '50px', height: '50px' }}
                            strokeWidth='8'
                            fill='var(--surface-ground)'
                            animationDuration='.5s'
                        />
                    </div>
                )}
                {!isLoading && (
                    <DataTable
                        value={employeeRankList || undefined}
                        editMode='row'
                        onRowEditComplete={onEditHandler}
                        lazy={true}
                        first={first}
                        totalRecords={totalRecord}
                        rowsPerPageOptions={[10, 30, 50, 100]}
                        rows={rows}
                        paginator
                        onPage={e => {
                            setRows(e.rows);
                            setFirst(e.first);
                            setPage(e.page);
                        }}
                        showGridlines={true}
                        header={renderHeader}
                        tableStyle={{ minWidth: '100rem' }}
                    >
                        {searchAll !== 'all' && (
                            <Column
                                align='center'
                                body={options => (
                                    <Button
                                        icon='pi pi-fw pi-trash'
                                        text
                                        rounded
                                        severity='danger'
                                        onClick={() => onDeleteHandler(options)}
                                    />
                                )}
                            />
                        )}
                        {searchAll !== 'all' && (
                            <Column
                                align='center'
                                rowEditor
                            />
                        )}
                        <Column
                            header='No'
                            body={(_, options) => options.rowIndex + 1}
                        />
                        <Column
                            field='emp_id'
                            header='Employee ID'
                        />
                        <Column
                            field='emp_name'
                            header='အမည်'
                        />
                        <Column
                            field='nrc'
                            header='မှတ်ပုံတင်'
                        />

                        <Column
                            field='dept_desc'
                            header='ဌာန'
                        />

                        <Column
                            field='rank_desc'
                            header='ရာထူး'
                            editor={options => dropdownEditor(options)}
                        />

                        <Column
                            field='salary'
                            header='လစာ'
                            body={options => `${options?.salary} Ks`}
                        />

                        <Column
                            field='assign_date'
                            header='သတ်မှတ်သည့်နေ့စွဲ'
                            body={options => new Date(options?.assign_date).toLocaleDateString()}
                            editor={options => dateTimeEditor(options)}
                        />

                        <Column
                            field='created_at'
                            header='Register Date'
                            body={options => new Date(options?.created_at).toLocaleDateString()}
                        />
                    </DataTable>
                )}
            </div>
        </div>
    );
};
export default RankReport;
