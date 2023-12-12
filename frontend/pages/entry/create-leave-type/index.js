import React, { useEffect, useState, useRef, useCallback } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { update } from '@/features/entry/entrySlice';
import { axiosInstance } from '@/utils/axiosInstance';

const CreateLeaveType = () => {
    const router = useRouter();
    const [leaveValue, setLeaveValue] = useState({
        leaveName: '',
        leaveDay: 0,
    });
    const toastRef = useRef(null);

    // redux-toolkit data
    const leaves = useSelector(state => state.entry.leaveType);
    const dispatch = useDispatch();

    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);

    const onChangeHandler = e => {
        setLeaveValue(prevState => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };

    const onSubmitHandler = async e => {
        e.preventDefault();

        try {
            const res = await axiosInstance.post('/leave/entry', {
                lev_type: leaveValue.leaveName,
                lev_day: leaveValue.leaveDay,
            });
            const { message } = res.data;

            if (res.status === 201) {
                fetchLeave();
                toastRef.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: message,
                });
                setLeaveValue({
                    leaveName: '',
                    leaveDay: 0,
                });
            }
        } catch (err) {
            toastRef.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Something Wrong!',
            });
        }
    };

    const onEditHandler = async e => {
        try {
            const { newData } = e;

            const res = await axiosInstance.put(`/leave/entry/${newData.lev_id}`, newData);
            const { message } = res.data;

            if (res.status === 200) {
                fetchLeave();
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
                detail: 'Something Wrong!',
            });
        }
    };

    const onDeleteHandler = async options => {
        try {
            const res = await axiosInstance.delete(`leave/entry/${options.lev_id}`);
            const { message } = res.data;

            if (res.status === 200) {
                fetchLeave();
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
                detail: 'Something Wrong!',
            });
        }
    };

    const inputEditor = options => {
        return (
            <InputText
                value={options.value}
                onChange={e => options.editorCallback(e.target.value)}
            />
        );
    };

    const fetchLeave = useCallback(async () => {
        try {
            const res = await axiosInstance.get(`/leave/entry?page=${page}&pageSize=${rows}`);
            const { data, totalRecord } = res.data;

            if (res.status === 200) {
                dispatch(update({ stateProperty: 'leaveType', data }));
                setTotalRecord(totalRecord);
            }
        } catch (error) {
            dispatch(update({ stateProperty: 'leaveType', data: [] }));

            console.log(error);
        }
    }, [page, rows, dispatch]);

    useEffect(() => {
        fetchLeave();
    }, [fetchLeave]);

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
                    <h1 className='text-3xl underline'>ခွင့်အမျိုးအစားသတ်မှတ်ခြင်း</h1>
                </div>
            </div>
            <div className='card mt-6'>
                <form
                    className='col-12'
                    onSubmit={onSubmitHandler}
                >
                    <div className='form-grid grid'>
                        <div className='p-inputgroup col-12 lg:col-6'>
                            <label
                                htmlFor='leaveName'
                                className='p-inputgroup-addon'
                            >
                                ခွင့်အမျိုးအစား
                            </label>
                            <InputText
                                id='leaveName'
                                type='text'
                                name='leaveName'
                                value={leaveValue.leaveName}
                                onChange={onChangeHandler}
                            />
                        </div>

                        <div className='p-inputgroup col-12 lg:col-6'>
                            <label
                                htmlFor='leaveDay'
                                className='p-inputgroup-addon'
                            >
                                ခွင့်ရက်အရေအတွက်
                            </label>
                            <InputNumber
                                inputId='leaveDay'
                                name='leaveDay'
                                value={leaveValue.leaveDay}
                                onChange={e =>
                                    setLeaveValue(prevState => {
                                        return { ...prevState, leaveDay: e.value };
                                    })
                                }
                            />
                        </div>

                        <div className='field col-12 flex justify-content-end'>
                            <Button
                                label='Submit'
                                type='submit'
                                className='w-auto'
                            />
                        </div>
                    </div>
                </form>

                <div className='col-12 mt-5'>
                    <DataTable
                        value={leaves}
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
                    >
                        <Column
                            body={(_, options) => options.rowIndex + 1}
                            header='No'
                        />
                        <Column
                            field='lev_type'
                            header='ခွင့်အမျိုးအစားများ'
                            editor={options => inputEditor(options)}
                        />
                        <Column
                            field='lev_day'
                            header='ခွင့်ရက်'
                            editor={options => inputEditor(options)}
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

export default CreateLeaveType;
