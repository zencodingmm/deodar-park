import React, { useEffect, useState, useRef, useCallback } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { update } from '@/features/entry/entrySlice';
import { axiosInstance } from '@/utils/axiosInstance';

const CreatePayRollAccountHead = () => {
    const router = useRouter();
    const [payRoll, setPayRoll] = useState({
        account_head: '',
        account_type: false,
        amount: undefined,
    });
    const toastRef = useRef(null);

    // Redux-Toolkit
    const payRollList = useSelector(state => state.entry.payRollAccountHead);
    const dispatch = useDispatch();

    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);

    const onChangeHandler = e => {
        setPayRoll(prevState => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };

    const onSubmitHandler = async e => {
        e.preventDefault();

        try {
            const res = await axiosInstance.post('/payroll/entry', {
                account_head: payRoll.account_head,
                account_type: payRoll.account_type,
                amount: payRoll.amount,
            });
            const { message } = res.data;

            if (res.status === 201) {
                fetchPayRoll();
                toastRef.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: message,
                });
                setPayRoll({ account_head: '', account_type: 0, amount: undefined });
            }
        } catch (err) {
            toastRef.current.show({
                severity: 'error',
                summary: 'Error',
                deatil: 'Something Wrong',
            });
        }
    };

    const onEditHandler = async e => {
        try {
            const { newData } = e;

            const res = await axiosInstance.put(`/payroll/entry/${newData.account_id}`, newData);
            const { message } = res.data;

            if (res.status === 200) {
                fetchPayRoll();
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
                deatil: 'Something Wrong',
            });
        }
    };

    const onDeleteHandler = async options => {
        try {
            const res = await axiosInstance.delete(`/payroll/entry/${options.account_id}`);
            const { message } = res.data;

            if (res.status === 200) {
                fetchPayRoll();
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
                deatil: 'Something Wrong',
            });
        }
    };

    const payRollEditor = options => {
        return (
            <InputText
                value={options.value}
                onChange={e => options.editorCallback(e.target.value)}
            />
        );
    };

    const dropDownTag = data => {
        return (
            <Tag
                severity={!data ? 'danger' : 'success'}
                value={!data ? 'ဖြတ်တောက်ငွေ' : 'ထောက်ပံ့ငွေ'}
            />
        );
    };

    const payRollTypeEditor = options => {
        return (
            <Dropdown
                value={options.value}
                valueTemplate={dropDownTag}
                options={[true, false]}
                name='account_type'
                onChange={e => options.editorCallback(e.value)}
                itemTemplate={dropDownTag}
            />
        );
    };

    const accountBodyTemplate = data => {
        return (
            <Tag
                severity={!data.account_type ? 'danger' : 'success'}
                value={!data.account_type ? 'ဖြတ်တောက်ငွေ' : 'ထောက်ပံ့ငွေ'}
            />
        );
    };

    const fetchPayRoll = useCallback(async () => {
        try {
            const res = await axiosInstance.get(`/payroll/entry?page=${page}&pageSize=${rows}`);
            const { data, totalRecord } = res.data;

            if (res.status === 200) {
                dispatch(update({ stateProperty: 'payRollAccountHead', data }));
                setTotalRecord(totalRecord);
            }
        } catch (error) {
            dispatch(update({ stateProperty: 'payRollAccountHead', data: [] }));
            console.log(error);
        }
    }, [page, rows, dispatch]);

    useEffect(() => {
        fetchPayRoll();
    }, [fetchPayRoll]);

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
                    <h1 className='text-3xl underline'>Pay Roll Account Head</h1>
                </div>
            </div>
            <div className='card mt-6'>
                <form
                    className='col-12'
                    onSubmit={onSubmitHandler}
                >
                    <div className='form-grid grid'>
                        <div className='p-inputgroup col-12 md:col-6'>
                            <label
                                htmlFor='account_head'
                                className='p-inputgroup-addon px-3'
                            >
                                Head
                            </label>
                            <InputText
                                id='account_head'
                                type='text'
                                name='account_head'
                                value={payRoll.account_head}
                                onChange={onChangeHandler}
                            />
                        </div>

                        <div className='p-inputgroup col-12 md:col-6'>
                            <label
                                htmlFor='amount'
                                className='p-inputgroup-addon px-3'
                            >
                                Amount
                            </label>
                            <InputNumber
                                inputId='amount'
                                name='amount'
                                value={payRoll.amount}
                                onValueChange={onChangeHandler}
                            />
                        </div>

                        <div className='input-group flex gap-4 col-12 mt-3'>
                            <div className='flex align-items-center gap-2'>
                                <RadioButton
                                    inputId='detection'
                                    name='account_type'
                                    value={false}
                                    checked={payRoll.account_type !== true}
                                    onChange={onChangeHandler}
                                />
                                <label htmlFor='detection'>ဖြတ်တောက်ငွေ</label>
                            </div>

                            <div className='flex align-items-center gap-2'>
                                <RadioButton
                                    inputId='allowance'
                                    name='account_type'
                                    value={true}
                                    checked={payRoll.account_type !== false}
                                    onChange={onChangeHandler}
                                />
                                <label htmlFor='allowance'>ထောက်ပံ့ငွေ</label>
                            </div>
                        </div>

                        <div className='field col-12 flex justify-content-end'>
                            <Button
                                type='submit'
                                label='Submit'
                                className='w-auto'
                            />
                        </div>
                    </div>
                </form>

                <div className='col-12 mt-5'>
                    <DataTable
                        value={payRollList}
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
                            field='account_id'
                            header='ID'
                            sortable
                        />
                        <Column
                            field='account_head'
                            header='Account Head'
                            editor={options => payRollEditor(options)}
                            sortable
                        />
                        <Column
                            field='account_type'
                            header='Account Type'
                            body={accountBodyTemplate}
                            editor={options => payRollTypeEditor(options)}
                        />
                        <Column
                            field='amount'
                            header='Ammount'
                            editor={options => payRollEditor(options)}
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

export default CreatePayRollAccountHead;
