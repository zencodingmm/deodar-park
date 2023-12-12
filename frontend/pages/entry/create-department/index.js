import React, { useEffect, useRef, useState, useCallback } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { update } from '@/features/entry/entrySlice';
import { axiosInstance } from '@/utils/axiosInstance';

const CreateDepartment = () => {
    const router = useRouter();
    const [departmentName, setDepartmentName] = useState('');
    const toastRef = useRef(null);

    const departments = useSelector(state => state.entry.department);
    const dispatch = useDispatch();

    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);

    const onChangeHandler = e => {
        setDepartmentName(e.target.value);
    };

    const onSubmitHandler = async e => {
        e.preventDefault();

        try {
            const res = await axiosInstance.post('/department/entry', {
                dept_desc: departmentName,
            });

            const { message } = res.data;

            if (res.status === 201) {
                fetchDepartment();
                toastRef.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: message,
                });

                setDepartmentName('');
            }
        } catch (error) {
            toastRef.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error?.reponse?.data?.error,
            });
        }
    };

    const onEditHandler = async e => {
        try {
            const { newData } = e;

            const res = await axiosInstance.put(`/department/entry/${newData.dept_id}`, newData);
            const { message } = res.data;

            if (res.status === 200) {
                fetchDepartment();
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
                detail: error?.reponse?.data?.error,
            });
        }
    };

    const onDeleteHandler = async e => {
        try {
            const res = await axiosInstance.delete(`/department/entry/${e.dept_id}`);
            const { message } = res.data;

            if (res.status === 200) {
                fetchDepartment();
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
                detail: error?.reponse?.data?.error,
            });
        }
    };

    const departmentNameEditor = options => {
        return (
            <InputText
                value={options.value}
                onChange={e => options.editorCallback(e.target.value)}
            />
        );
    };

    const fetchDepartment = useCallback(async () => {
        try {
            const res = await axiosInstance.get(`/department/entry?page=${page}&pageSize=${rows}`);
            const { data, totalRecord } = res.data;

            if (res.status === 200) {
                dispatch(
                    update({
                        stateProperty: 'department',
                        data,
                    }),
                );
                setTotalRecord(totalRecord);
            }
        } catch (error) {
            dispatch(
                update({
                    stateProperty: 'department',
                    data: [],
                }),
            );
            console.log(error);
        }
    }, [page, rows, dispatch]);

    useEffect(() => {
        fetchDepartment();
    }, [fetchDepartment]);

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

                <div className='h-full align-items-center'>
                    <h1 className='text-3xl underline'>ဌာနအမျိုးအစားများသတ်မှတ်ခြင်း</h1>
                </div>
            </div>
            <div className='card mt-6'>
                <form
                    className='col-12'
                    onSubmit={onSubmitHandler}
                >
                    <div className='p-inputgroup'>
                        <label
                            htmlFor='departmentName'
                            className='p-inputgroup-addon px-5'
                        >
                            ဌာန
                        </label>
                        <InputText
                            id='departmentName'
                            type='text'
                            name='dept_name'
                            value={departmentName}
                            onChange={onChangeHandler}
                            required
                        />
                        <Button
                            label='Submit'
                            type='submit'
                            className='px-5'
                        />
                    </div>
                </form>

                <div className='col-12 mt-5'>
                    <DataTable
                        value={departments}
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
                            field='dept_desc'
                            header='ဌာနအမျိုးအစားများ'
                            editor={options => departmentNameEditor(options)}
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

export default CreateDepartment;
