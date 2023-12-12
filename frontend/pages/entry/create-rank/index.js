import React, { useEffect, useState, useRef, useCallback } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { update } from '@/features/entry/entrySlice';
import { axiosInstance } from '@/utils/axiosInstance';

const CreateRank = () => {
    const router = useRouter();
    const [rank, setRank] = useState({
        rank_name: '',
        salary: 0,
    });
    const toastRef = useRef(null);

    // Redux-Toolkit
    const ranks = useSelector(state => state.entry.rankType);
    const dispatch = useDispatch();

    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);

    const onChangeHandler = e => {
        setRank(prevState => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };

    const onSubmitHandler = async e => {
        e.preventDefault();

        try {
            const res = await axiosInstance.post('/rank/entry', {
                rank_desc: rank.rank_name,
                salary: rank.salary,
            });
            const { message } = res.data;

            if (res.status === 201) {
                fetchRank();
                toastRef.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: message,
                });
                setRank({ rank_name: '', salary: 0 });
            }
        } catch (error) {
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

            const res = await axiosInstance.put(`/rank/entry/${newData.rank_id}`, newData);
            const { message } = res.data;

            if (res.status === 200) {
                fetchRank();
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
            const res = await axiosInstance.delete(`/rank/entry/${options.rank_id}`);

            const { message } = res.data;

            if (res.status === 200) {
                fetchRank();
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

    const rankNameEditor = options => {
        return (
            <InputText
                value={options.value}
                onChange={e => options.editorCallback(e.target.value)}
            />
        );
    };

    const fetchRank = useCallback(async () => {
        try {
            const res = await axiosInstance.get(`/rank/entry?page=${page}&pageSize=${rows}`);
            const { data, totalRecord } = res.data;

            if (res.status === 200) {
                dispatch(update({ stateProperty: 'rankType', data }));
                setTotalRecord(totalRecord);
            }
        } catch (error) {
            dispatch(update({ stateProperty: 'rankType', data: [] }));
            console.log(error);
        }
    }, [page, rows, dispatch]);

    useEffect(() => {
        fetchRank();
    }, [fetchRank]);

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
                    <h1 className='text-3xl underline'>ရာထူး/တာဝန်သတ်မှတ်ခြင်း</h1>
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
                                htmlFor='rank_name'
                                className='p-inputgroup-addon px-3'
                            >
                                ရာထူး
                            </label>
                            <InputText
                                id='rank_name'
                                type='text'
                                name='rank_name'
                                value={rank.rank_name}
                                onChange={onChangeHandler}
                                required
                            />
                        </div>

                        <div className='p-inputgroup col-12 md:col-6'>
                            <label
                                htmlFor='salary'
                                className='p-inputgroup-addon px-3'
                            >
                                လစာ
                            </label>
                            <InputNumber
                                inputId='salary'
                                type='text'
                                name='salary'
                                value={rank.salary}
                                onValueChange={onChangeHandler}
                                required
                            />
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
                        value={ranks}
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
                            field='rank_desc'
                            header='ရာထူးအမျိုးအစားများ'
                            editor={options => rankNameEditor(options)}
                        />
                        <Column
                            field='salary'
                            header='လစာ'
                            editor={options => rankNameEditor(options)}
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

export default CreateRank;
