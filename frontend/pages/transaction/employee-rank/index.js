import React, { useEffect, useRef, useState, useCallback } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { update as entryUpdate } from '@/features/entry/entrySlice';
import { axiosInstance } from '@/utils/axiosInstance';

const CreateEmployeeRank = () => {
    const router = useRouter();
    const [employeeRank, setEmployeeRank] = useState({
        emp_id: '',
        emp_name: '',
        nrc: '',
        rank_id: '',
        rank_desc: '',
        assign_date: new Date(),
        salary: 0,
        emp_dept_id: '',
    });
    const [dropdownValue, setDropdownValue] = useState();
    const toastRef = useRef(null);

    // redux-toolkit get Data
    const rank = useSelector(state => state.entry.rankType);

    const dispatch = useDispatch();

    // InputText onChange Handler
    const onChangeHandler = e => {
        setEmployeeRank(prevState => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };

    // restore default state
    const restoreDefaultState = data => {
        if (data) {
            setEmployeeRank({
                emp_id: '',
                emp_name: '',
                nrc: '',
                rank_id: '',
                rank_desc: '',
                assign_date: new Date(),
                salary: 0,
                emp_dept_id: '',
            });
            setDropdownValue(null);
        } else {
            setEmployeeRank(prevState => {
                return {
                    ...prevState,
                    emp_name: '',
                    nrc: '',
                    rank_id: '',
                    rank_desc: '',
                    assign_date: new Date(),
                    salary: 0,
                    emp_dept_id: '',
                };
            });
            setDropdownValue(null);
        }
    };

    // Search Employee
    const onSearchHandler = async id => {
        try {
            const res = await axiosInstance.get(`/department/transaction/search?id=${employeeRank.emp_id}`);
            const { data } = res.data;

            if (res.status === 200) {
                setEmployeeRank(prevState => ({ ...prevState, emp_id: data.emp_id, emp_name: data.emp_name, nrc: data.nrc, emp_dept_id: data.emp_dept_id }));
            }
        } catch (error) {
            restoreDefaultState();
            toastRef.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error?.response?.data?.error,
            });
        }
    };

    // Submit Handler
    const onSubmitHandler = async e => {
        e.preventDefault();

        try {
            const res = await axiosInstance.post('/rank/transaction', {
                emp_id: employeeRank.emp_id,
                emp_name: employeeRank.emp_name,
                nrc: employeeRank.nrc,
                rank_id: employeeRank.rank_id,
                rank_desc: employeeRank.rank_desc,
                assign_date: employeeRank.assign_date,
                salary: employeeRank.salary,
                emp_dept_id: employeeRank.emp_dept_id,
            });
            const { message } = res.data;

            if (res.status === 201) {
                restoreDefaultState('submit');
                toastRef.current.show({ severity: 'success', summary: 'Success', detail: message });
            }
        } catch (err) {
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Something Wrong!' });
        }
    };

    // Dropdown onChange handler
    const onChangeDropdownHandler = async e => {
        setEmployeeRank(prevState => {
            return {
                ...prevState,
                rank_desc: e.value.rank_desc,
                rank_id: e.value.rank_id,
                salary: e.value.salary,
            };
        });
        setDropdownValue(e.value);
    };

    const fetchRankType = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/rank/entry');
            const { data } = res.data;

            if (res.status === 200) {
                dispatch(entryUpdate({ stateProperty: 'rankType', data }));
            }
        } catch (error) {
            dispatch(entryUpdate({ stateProperty: 'rankType', data: [] }));
            console.log(error);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchRankType();
    }, [fetchRankType]);

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
                    <h1 className='text-3xl underline'>Employee Rank</h1>
                </div>
            </div>

            <div className='card mt-6'>
                <form
                    className='col-12'
                    onSubmit={onSubmitHandler}
                >
                    <div className='p-fluid form-grid grid'>
                        <div className='field col-12 md:col-6'>
                            <label htmlFor='emp_id'>ID</label>
                            <div className='p-inputgroup'>
                                <InputText
                                    id='emp_id'
                                    name='emp_id'
                                    type='search'
                                    value={employeeRank.emp_id}
                                    onChange={e => {
                                        onChangeHandler(e);
                                    }}
                                    required
                                />
                                <Button
                                    label='Search'
                                    type='button'
                                    onClick={() => onSearchHandler(employeeRank.emp_id)}
                                />
                            </div>
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='emp_name'>Name</label>
                            <InputText
                                id='emp_name'
                                name='emp_name'
                                type='text'
                                value={employeeRank.emp_name}
                                onChange={onChangeHandler}
                                required
                                disabled
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='nrc'>NRC</label>
                            <InputText
                                id='nrc'
                                name='nrc'
                                type='text'
                                value={employeeRank.nrc}
                                onChange={onChangeHandler}
                                required
                                disabled
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='rank_desc'>Rank Type</label>
                            <Dropdown
                                inputId='rank_desc'
                                name='rank_desc'
                                value={dropdownValue}
                                onChange={onChangeDropdownHandler}
                                options={rank}
                                optionLabel='rank_desc'
                                placeholder='Choose Rank'
                                required
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='salary'>Salary</label>
                            <InputNumber
                                inputId='salary'
                                name='salary'
                                value={employeeRank.salary}
                                onValueChange={onChangeHandler}
                                required
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='assign_date'>Assign Date</label>
                            <Calendar
                                inputId='assign_date'
                                name='assign_date'
                                value={employeeRank.assign_date}
                                onChange={onChangeHandler}
                                placeholder='Choose Assign Date'
                                showIcon
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
            </div>
        </div>
    );
};

export default CreateEmployeeRank;
