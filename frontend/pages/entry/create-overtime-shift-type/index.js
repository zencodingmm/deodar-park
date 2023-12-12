import React, { useEffect, useState, useRef, useCallback } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { create, update } from '@/features/entry/entrySlice';
import { axiosInstance } from '@/utils/axiosInstance';

const CreateOverTimeShiftType = () => {
    const router = useRouter();
    const [overtimeShift, setOvertimeShift] = useState({
        shift_group_name: '',
        start_date: new Date(),
        end_date: new Date(),
        start_time: new Date(),
        end_time: new Date(),
    });
    const toastRef = useRef(null);

    // redux-toolkit
    const overtimeShiftList = useSelector(state => state.entry.overtimeShiftType);
    const dispatch = useDispatch();

    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);

    const onChangeHandler = e => {
        setOvertimeShift(prevState => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };

    const onSubmitHandler = async e => {
        e.preventDefault();

        try {
            const res = await axiosInstance.post('/overtime/entry', overtimeShift);
            const { message } = res.data;

            if (res.status === 201) {
                fetchData();
                toastRef.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: message,
                });
                setOvertimeShift({
                    shift_group_name: '',
                    start_date: new Date(),
                    end_date: new Date(),
                    start_time: new Date(),
                    end_time: new Date(),
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

    const onEditHandler = async e => {
        try {
            const { newData } = e;

            const res = await axiosInstance.put(`/overtime/entry/${newData.rid}`, newData);
            const { message } = res.data;

            if (res.status === 200) {
                fetchData();
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

    const onDeleteHandler = async options => {
        try {
            const res = await axiosInstance.delete(`/overtime/entry/${options.rid}`);
            const { message } = res.data;

            if (res.status === 200) {
                fetchData();
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

    const nameEditor = options => {
        return (
            <InputText
                name={options.field}
                value={options.value || ''}
                onChange={e => options.editorCallback(e.target.value)}
            />
        );
    };

    const dateEditor = options => {
        return (
            <Calendar
                name={options.field}
                value={new Date(options.value)}
                onChange={e => options.editorCallback(e.target.value)}
            />
        );
    };

    const timeEditor = options => {
        return (
            <Calendar
                name={options.field}
                value={new Date(options.value)}
                onChange={e => options.editorCallback(e.target.value)}
                timeOnly
                hourFormat='12'
            />
        );
    };

    const fetchData = useCallback(async () => {
        try {
            const res = await axiosInstance.get(`/overtime/entry?page=${page}&pageSize=${rows}`);
            const { data, totalRecord } = res.data;

            if (res.status === 200) {
                dispatch(update({ stateProperty: 'overtimeShiftType', data }));
                setTotalRecord(totalRecord);
            }
        } catch (error) {
            dispatch(update({ stateProperty: 'overtimeShiftType', data: [] }));

            console.log(error);
        }
    }, [page, rows, dispatch]);

    useEffect(() => {
        fetchData();
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
                    <h1 className='text-3xl underline'>Overtime Shift Type</h1>
                </div>
            </div>
            <div className='card mt-6'>
                <form
                    className='p-fluid formgrid grid'
                    onSubmit={onSubmitHandler}
                >
                    <div className='field col-12'>
                        <label htmlFor='shift_group_name'>အုပ်စု အမည်</label>
                        <InputText
                            id='shift_group_name'
                            name='shift_group_name'
                            value={overtimeShift.shift_group_name}
                            onChange={onChangeHandler}
                            required
                        />
                    </div>

                    <div className='field col-12 md:col-6'>
                        <label htmlFor='start_date'>အချိန်ပိုစတင်မည့်နေ့</label>
                        <Calendar
                            inputId='start_date'
                            name='start_date'
                            value={overtimeShift.start_date}
                            onChange={onChangeHandler}
                            showIcon
                            required
                        />
                    </div>

                    <div className='field col-12 md:col-6'>
                        <label htmlFor='end_date'>အချိန်ပိုကုန်ဆုံးမည့်နေ့</label>
                        <Calendar
                            inputId='end_date'
                            name='end_date'
                            value={overtimeShift.end_date}
                            onChange={onChangeHandler}
                            minDate={overtimeShift.start_date}
                            showIcon
                            required
                        />
                    </div>

                    <div className='field col-12 md:col-6'>
                        <label htmlFor='start_time'>အချိန်ပိုစတင်မည့်အချိန်</label>
                        <Calendar
                            inputId='start_time'
                            name='start_time'
                            value={overtimeShift.start_time}
                            onChange={onChangeHandler}
                            showIcon
                            timeOnly
                            required
                            hourFormat='12'
                        />
                    </div>

                    <div className='field col-12 md:col-6'>
                        <label htmlFor='end_time'>အချိန်ပိုကုန်ဆုံးမည့်အချိန်</label>
                        <Calendar
                            inputId='end_time'
                            name='end_time'
                            value={overtimeShift.end_time}
                            onChange={onChangeHandler}
                            showIcon
                            timeOnly
                            required
                            hourFormat='12'
                        />
                    </div>

                    <div className='field flex justify-content-end col-12 my-5'>
                        <Button
                            label='Submit'
                            type='submit'
                            className='w-auto'
                        />
                    </div>
                </form>

                <div>
                    <DataTable
                        value={overtimeShiftList}
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
                        tableStyle={{ minWidth: '100rem' }}
                    >
                        <Column
                            header='ID'
                            body={(_, options) => options.rowIndex + 1}
                        />
                        <Column
                            field='shift_group_name'
                            header='အုပ်စုအမည်'
                            editor={options => nameEditor(options)}
                        />
                        <Column
                            field='start_date'
                            header='အချိန်ပိုစတင်သည့်နေ့'
                            editor={options => dateEditor(options)}
                            body={options => new Date(options.start_date).toLocaleDateString()}
                        />
                        <Column
                            field='end_date'
                            header='အချိန်ပိုကုန်ဆုံးသည့်နေ့'
                            editor={options => dateEditor(options)}
                            body={options => new Date(options.end_date).toLocaleDateString()}
                        />
                        <Column
                            field='start_time'
                            header='အချိန်ပိုစတင်သည့်အချိန်'
                            editor={options => timeEditor(options)}
                            body={options => new Date(options.start_time).toLocaleTimeString()}
                        />
                        <Column
                            field='end_time'
                            header='အချိန်ပိုကုန်ဆုံးသည့်အချိန်'
                            editor={options => timeEditor(options)}
                            body={options => new Date(options.end_time).toLocaleTimeString()}
                            sortable
                        />
                        <Column
                            align='center'
                            rowEditor
                        />
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
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default CreateOverTimeShiftType;
