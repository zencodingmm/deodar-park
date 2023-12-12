import React, { useEffect, useRef, useState, useCallback } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { create, update } from '@/features/entry/entrySlice';
import { axiosInstance } from '@/utils/axiosInstance';

const CreateLoanType = () => {
    const router = useRouter();
    const [loanName, setLoanName] = useState('');
    const toastRef = useRef(null);

    // Redux-Toolkit
    const loans = useSelector(state => state.entry.loanType);
    const dispatch = useDispatch();

    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);

    const onChangeHandler = e => {
        setLoanName(e.target.value);
    };

    const onSubmitHandler = async e => {
        e.preventDefault();

        try {
            const res = await axiosInstance.post('/loan/entry', {
                loan_type: loanName,
            });
            const { message } = res.data;

            if (res.status === 200) {
                fetchLoan();
                toastRef.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: message,
                });
                setLoanName('');
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

            const res = await axiosInstance.put(`/loan/entry/${newData.loan_id}`, newData);
            const { message } = res.data;

            if (res.status === 200) {
                fetchLoan();
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
            const res = await axiosInstance.delete(`/loan/entry/${options.loan_id}`);
            const { message } = res.data;

            if (res.status === 200) {
                fetchLoan();
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

    const loanNameEditor = options => {
        return (
            <InputText
                value={options.value}
                onChange={e => options.editorCallback(e.target.value)}
            />
        );
    };

    const fetchLoan = useCallback(async () => {
        try {
            const res = await axiosInstance.get(`/loan/entry?page=${page}&pageSize=${rows}`);

            const { data, totalRecord } = res.data;

            if (res.status === 200) {
                dispatch(update({ stateProperty: 'loanType', data }));
                setTotalRecord(totalRecord);
            }
        } catch (error) {
            dispatch(update({ stateProperty: 'loanType', data: [] }));

            console.log(error);
        }
    }, [page, rows, dispatch]);

    useEffect(() => {
        fetchLoan();
    }, [fetchLoan]);

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
                    <h1 className='text-3xl underline'>ချေးငွေအမျိုးအစားသတ်မှတ်ပေးခြင်း</h1>
                </div>
            </div>
            <div className='card mt-6'>
                <form
                    className='col-12'
                    onSubmit={onSubmitHandler}
                >
                    <div className='p-inputgroup'>
                        <label
                            htmlFor='loanName'
                            className='p-inputgroup-addon px-5'
                        >
                            ခွင့်အမျိုးအစား
                        </label>
                        <InputText
                            id='loanName'
                            type='text'
                            name='loanName'
                            value={loanName}
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
                        value={loans}
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
                            field='loan_type'
                            header='ချေးငွေအမျိုးအစား'
                            editor={options => loanNameEditor(options)}
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

export default CreateLoanType;
