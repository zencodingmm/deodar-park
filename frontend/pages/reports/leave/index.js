import React, { useState, useEffect, useRef, useCallback } from 'react';

import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';

import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { update as transactionUpdate } from '@/features/transaction/transactionSlice';
import { update as entryUpdate } from '@/features/entry/entrySlice';
import { axiosInstance } from '@/utils/axiosInstance';

const LeaveReport = () => {
    const router = useRouter();
    const toastRef = useRef(null);
    const searchFilterValue = [{ name: 'Employee ID', code: 'id' }];

    const [filterDropdown, setFilterDropdown] = useState(searchFilterValue[0]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const employeeLeaveList = useSelector(state => state.transaction.employeeLeave);
    const leaveType = useSelector(state => state.entry.leaveType);

    const dispatch = useDispatch();

    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const onSearchFilter = id => {
        console.log(id);
    };

    const clearFilter = () => {
        setGlobalFilterValue('');
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

    const dropDownEditor = options => {
        const value = leaveType.find(leave => leave.lev_type === options.value);

        return (
            <Dropdown
                value={value}
                onChange={e => {
                    options.editorCallback(e.value?.lev_type);
                    options.rowData.lev_id = e.value?.lev_id;
                }}
                options={leaveType}
                optionLabel='lev_type'
                placeholder='ရွေးချယ်ရန်'
            />
        );
    };

    // Calculate Date Function
    const CalcDate = (startDateTime, endDateTime) => {
        const startDate = new Date(startDateTime).getTime();
        const endDate = new Date(endDateTime).getTime();
        return Math.ceil(Math.abs((startDate - endDate) / (1000 * 3600 * 24)));
    };

    const onEditHandler = async e => {
        try {
            const { newData } = e;

            const durationDate = CalcDate(newData.leave_start_date, newData.leave_end_date);

            const res = await axiosInstance.put(`/leave/transaction/${newData.emp_lev_id}`, { ...newData, total_leave_days: durationDate });
            const { message } = res.data;

            if (res.status === 200) {
                fetchData().catch(error => console.log(error));
                toastRef.current.show({ severity: 'success', summary: 'Success', detail: message });
            }
        } catch (error) {
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.error });
            console.log(error);
        }
    };

    const onDeleteHandler = async options => {
        try {
            const res = await axiosInstance.delete(`/leave/transaction/${options.emp_lev_id}`);
            const { message } = res.data;

            if (res.status === 200) {
                fetchData().catch(error => console.log(error));
                toastRef.current.show({ severity: 'success', summary: 'Success', detail: message });
            }
        } catch (error) {
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.error });
            console.log(error);
        }
    };

    const allowanceAmount = options => {
        return (
            <InputNumber
                value={options.value}
                onValueChange={e => options.editorCallback(e.value)}
                readOnly
            />
        );
    };

    const dateTimeEditor = options => {
        return (
            <Calendar
                name={options.field}
                value={new Date(options.value)}
                onChange={e => options.editorCallback(e.target.value)}
                showIcon
            />
        );
    };

    const textEditor = options => {
        return (
            <InputText
                type='text'
                value={options.value}
                onChange={e => options.editorCallback(e.target.value)}
            />
        );
    };

    const fetchLeaveType = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/leave/entry');
            const { data } = res.data;

            if (res.status === 200) {
                dispatch(entryUpdate({ stateProperty: 'leaveType', data }));
            }
        } catch (error) {
            dispatch(entryUpdate({ stateProperty: 'leaveType', data: [] }));
            console.log(error);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchLeaveType().catch(error => console.log(error));
    }, [fetchLeaveType]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get(`/leave/transaction?page=${page}&pageSize=${rows}`);
            const { data, totalRecord } = res.data;

            if (res.status === 200) {
                dispatch(transactionUpdate({ stateProperty: 'employeeLeave', data }));
                setTotalRecord(totalRecord);
                setIsLoading(false);
            }
        } catch (error) {
            dispatch(transactionUpdate({ stateProperty: 'employeeLeave', data: [] }));
            setTotalRecord(0);
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
                    <h1 className='text-3xl underline'>Leave Reports</h1>
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
                        value={employeeLeaveList || undefined}
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
                        tableStyle={{ minWidth: '150rem' }}
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
                        />

                        <Column
                            field='rank_desc'
                            header='ရာထူး'
                        />

                        <Column
                            field='leave_type'
                            header='ခွင့်အမျိုးအစား'
                            editor={options => dropDownEditor(options)}
                        />

                        <Column
                            field='total_leave_days'
                            header='ခွင့်ရက်အရေအတွက်'
                            editor={options => allowanceAmount(options)}
                        />

                        <Column
                            field='leave_detail'
                            header='အကြောင်းအရာ'
                            editor={options => textEditor(options)}
                        />

                        <Column
                            field='leave_start_date'
                            header='State Date'
                            body={options => new Date(options?.leave_start_date).toLocaleDateString()}
                            editor={options => dateTimeEditor(options)}
                        />

                        <Column
                            field='leave_end_date'
                            header='End Date'
                            body={options => new Date(options?.leave_end_date).toLocaleDateString()}
                            editor={options => dateTimeEditor(options)}
                        />

                        <Column
                            field='approved_person'
                            header='Approved Person'
                            editor={options => textEditor(options)}
                        />

                        <Column
                            field='approved_date'
                            header='Approved Date'
                            body={options => new Date(options?.leave_end_date).toLocaleDateString()}
                            editor={options => dateTimeEditor(options)}
                        />
                    </DataTable>
                )}
            </div>
        </div>
    );
};

export default LeaveReport;
