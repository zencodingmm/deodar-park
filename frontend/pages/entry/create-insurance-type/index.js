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

const CreateInsuranceType = () => {
    const router = useRouter();
    const [insuranceName, setInsuranceName] = useState('');
    const toastRef = useRef(null);

    const insurances = useSelector(state => state.entry.insuranceType);
    const dispatch = useDispatch();

    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);

    const onChangeHandler = e => {
        setInsuranceName(e.target.value);
    };

    const onSubmitHandler = async e => {
        e.preventDefault();

        try {
            const res = await axiosInstance.post('/insurance/entry', { insurance_type: insuranceName });
            const { message } = res.data;

            if (res.status === 201) {
                fetchInsurance();
                toastRef.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: message,
                });
                setInsuranceName('');
            }
        } catch (error) {
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

            const res = await axiosInstance.put(`/insurance/entry/${newData.iid}`, newData);
            const { message } = res.data;

            if (res.status === 200) {
                fetchInsurance();
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

    const onDeleteHandler = async e => {
        try {
            const res = await axiosInstance.delete(`/insurance/entry/${e.iid}`);
            const { message } = res.data;

            if (res.status === 200) {
                fetchInsurance();
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

    const insuranceNameEditor = options => {
        return (
            <InputText
                value={options.value}
                onChange={e => options.editorCallback(e.target.value)}
            />
        );
    };

    const fetchInsurance = useCallback(async () => {
        try {
            const res = await axiosInstance.get(`/insurance/entry?page=${page}&pageSize=${rows}`);
            const { data, totalRecord } = res.data;

            if (res.status === 200) {
                dispatch(update({ stateProperty: 'insuranceType', data }));
                setTotalRecord(totalRecord);
            }
        } catch (error) {
            dispatch(update({ stateProperty: 'insuranceType', data: [] }));
            console.log(error);
        }
    }, [page, rows, dispatch]);

    useEffect(() => {
        fetchInsurance();
    }, [fetchInsurance]);

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
                    <h1 className='text-3xl underline'>အာမခံအမျိုးအစားသတ်မှတ်ခြင်း</h1>
                </div>
            </div>
            <div className='card mt-6'>
                <form
                    className='col-12'
                    onSubmit={onSubmitHandler}
                >
                    <div className='p-inputgroup'>
                        <label
                            htmlFor='insuranceName'
                            className='p-inputgroup-addon px-5'
                        >
                            အာမခံအမျိုးအစား
                        </label>
                        <InputText
                            id='insuranceName'
                            type='text'
                            name='insuranceName'
                            value={insuranceName}
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
                        value={insurances}
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
                            field='insurance_type'
                            header='အာမခံအမျိုးအစားများ'
                            editor={options => insuranceNameEditor(options)}
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

export default CreateInsuranceType;
