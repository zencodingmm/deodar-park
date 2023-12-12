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

import { update as transactionUpdate } from '@/features/transaction/transactionSlice';
import { update as entryUpdate } from '@/features/entry/entrySlice';
import { axiosInstance } from '@/utils/axiosInstance';

const InsuranceReport = () => {
    const router = useRouter();
    const toastRef = useRef(null);
    const searchFilterValue = [{ name: 'Employee ID', code: 'id' }];
    const [globalFilterValue, setGlobalFilterValue] = useState();

    const [filterDropdown, setFilterDropdown] = useState(searchFilterValue[0]);

    // redux-toolkit
    const employeeInsuranceList = useSelector(state => state.transaction.employeeInsurance);
    const insuranceType = useSelector(state => state.entry.insuranceType);

    const dispatch = useDispatch();

    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const onEditHandler = async e => {
        try {
            const { newData } = e;

            const res = await axiosInstance.put(`/insurance/transaction/${newData?.emp_ins_id}`, newData);
            const { message } = res.data;

            if (res.status === 200) {
                fetchData().catch(error => console.log(error));
                toastRef.current.show({ severity: 'success', summary: 'Success', detail: message });
            }
        } catch (error) {
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.error });
        }
    };

    const onDeleteHandler = async options => {
        try {
            const res = await axiosInstance.delete(`insurance/transaction/${options.emp_ins_id}`);
            const { message } = res.data;

            if (res.status === 200) {
                fetchData().catch(error => console.log(error));
                toastRef.current.show({ severity: 'success', summary: 'Success', detail: message });
            }
        } catch (error) {
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.error });
        }
    };

    const dropDownEditor = options => {
        const value = insuranceType.find(IT => IT.insurance_type === options.value);

        return (
            <Dropdown
                value={value}
                onChange={e => {
                    options.editorCallback(e.value?.insurance_type);
                    options.rowData.iid = e.value?.iid;
                }}
                options={insuranceType}
                optionLabel='insurance_type'
                placeholder='ရွေးချယ်ရန်'
            />
        );
    };

    // filter
    // clear filter
    const clearFilter = () => {
        setGlobalFilterValue(() => undefined);
    };

    // search filter
    const onSearchFilter = id => {
        console.log(id);
    };

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

    const fetchInsuranceType = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/insurance/entry');
            const { data } = res.data;

            if (res.status === 200) {
                dispatch(entryUpdate({ stateProperty: 'insuranceType', data }));
            }
        } catch (error) {
            dispatch(entryUpdate({ stateProperty: 'insuranceType', data: [] }));
            console.log(error);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchInsuranceType().catch(error => console.log(error));
    }, [fetchInsuranceType]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get(`/insurance/transaction?page=${page}&pageSize=${rows}`);
            const { data, totalRecord } = res.data;

            if (res.status === 200) {
                dispatch(transactionUpdate({ stateProperty: 'employeeInsurance', data }));
                setTotalRecord(totalRecord);
                setIsLoading(false);
            }
        } catch (error) {
            dispatch(transactionUpdate({ stateProperty: 'employeeInsurance', data: [] }));
            setIsLoading(false);
            console.log(error);
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
                    <h1 className='text-3xl underline'>Insurance Reports</h1>
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
                        value={employeeInsuranceList || undefined}
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
                        tableStyle={{ minWidth: '90rem' }}
                    >
                        <Column
                            align={'center'}
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
                            align={'center'}
                            rowEditor
                        />

                        <Column
                            header='No'
                            body={(_, options) => options?.rowIndex + 1}
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
                            field='dept_desc'
                            header='ဌာန'
                        />

                        <Column
                            field='rank_desc'
                            header='ရာထူး'
                        />

                        <Column
                            field='insurance_type'
                            header='အာမခံ'
                            editor={options => dropDownEditor(options)}
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

export default InsuranceReport;
