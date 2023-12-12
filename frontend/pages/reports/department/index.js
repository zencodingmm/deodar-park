import React, { useState, useEffect, useRef, useCallback } from 'react';

import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';

import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { update } from '@/features/transaction/transactionSlice';
import { update as entryUpdate } from '@/features/entry/entrySlice';
import { axiosInstance } from '@/utils/axiosInstance';

const DepartmentReport = () => {
    const router = useRouter();
    const toastRef = useRef(null);
    const searchFilterValue = [{ name: 'Employee ID', code: 'id' }];
    const [filterDropdown, setFilterDropdown] = useState(searchFilterValue[0]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    // redux-toolkit
    const employeeDepartmentList = useSelector(state => state.transaction.employeeDepartment);

    const department = useSelector(state => state.entry.department);

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
            const departmentNewData = department.find(dept => dept.dept_desc === newData.dept_desc);

            const updateData = {
                ...newData,
                dept_id: departmentNewData.dept_id,
            };

            const res = await axiosInstance.put(`/department/transaction/${newData.emp_dept_id}`, updateData);
            const { message } = res.data;

            if (res.status === 200) {
                fetchData().catch(error => console.log(error));
                toastRef.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: message,
                });
            }
        } catch (err) {
            toastRef.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Something Wrong',
            });
        }
    };

    const onDeleteHandler = async options => {
        try {
            const res = await axiosInstance.delete(`/department/transaction/${options.emp_dept_id}`);
            const { message } = res.data;

            if (res.status === 200) {
                fetchData().catch(error => console.log(error));
                toastRef.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: message,
                });
            }
        } catch (error) {
            toastRef.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Something Wrong',
            });
        }
    };

    // dropdown Editor
    const dropDownEditor = options => {
        const value = department.find(dept => dept.dept_desc === options.value);

        return (
            <Dropdown
                value={value}
                onChange={e => {
                    options.editorCallback(e.value?.dept_desc);
                }}
                options={department}
                optionLabel='dept_desc'
                placeholder='ရွေးချယ်ရန်'
            />
        );
    };

    // clear filter
    const clearFilter = () => {
        setGlobalFilterValue('');
    };

    // search filter
    const onSearchFilter = id => {};

    // on change filter value
    const onGlobalFilterChange = e => {
        setGlobalFilterValue(e.target.value);
    };

    // header for datatable
    const renderHeader = () => {
        return (
            <div className='flex gap-3'>
                <div>
                    <Dropdown
                        value={filterDropdown}
                        onChange={e => {
                            setFilterDropdown(e.target.value);
                            setQueryFetch(
                                prevState =>
                                    ({
                                        ...prevState,
                                        field: e?.target.value.code,
                                    }) || prevState,
                            );
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
        );
    };

    const fetchDepartmentList = useCallback(async () => {
        try {
            const res = await axiosInstance.get('department/entry');
            const { data } = res.data;

            if (res.status === 200) {
                dispatch(entryUpdate({ stateProperty: 'department', data }));
            }
        } catch (error) {
            dispatch(entryUpdate({ stateProperty: 'department', data: [] }));
        }
    }, [dispatch]);

    useEffect(() => {
        fetchDepartmentList().catch(error => console.log(error));
    }, [fetchDepartmentList]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get(`/department/transaction?page=${page}&pageSize=${rows}`);
            const { data, totalRecord } = res.data;

            if (res.status === 200) {
                dispatch(update({ stateProperty: 'employeeDepartment', data }));
                setTotalRecord(totalRecord);
                setIsLoading(false);
            }
        } catch (error) {
            dispatch(update({ stateProperty: 'employeeDepartment', data: [] }));
            console.log(error);
            setIsLoading(false);
        }
    }, [page, rows, dispatch]);

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
                    <h1 className='text-3xl underline'>Department Reports</h1>
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
                        value={employeeDepartmentList || undefined}
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
                    >
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
                        <Column
                            align='center'
                            rowEditor
                        />
                        <Column
                            header='No'
                            body={(_, options) => options.rowIndex + 1}
                        />
                        <Column
                            field='emp_id'
                            header='ID'
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
                            sortField='dept_id'
                            editor={options => dropDownEditor(options)}
                        />
                    </DataTable>
                )}
            </div>
        </div>
    );
};

export default DepartmentReport;
