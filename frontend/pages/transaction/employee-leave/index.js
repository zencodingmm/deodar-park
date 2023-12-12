import React, { useCallback, useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { update as entryUpdate } from '@/features/entry/entrySlice';
import { axiosInstance } from '@/utils/axiosInstance';

const CreateEmployeeLeave = () => {
    const router = useRouter();
    const [employeeLeave, setEmployeeLeave] = useState({
        emp_id: '',
        emp_name: '',
        nrc: '',
        emp_rank_id: '',
        rank_id: '',
        rank_desc: '',
        emp_dept_id: '',
        dept_id: '',
        dept_desc: '',
        lev_id: '',
        lev_type: '',
        total_leave_days: 0,
        leave_detail: '',
        leave_start_date: new Date(),
        leave_end_date: new Date(),
        approved_person: '',
        approved_date: new Date(),
    });
    const [dropdownValue, setDropdownValue] = useState();
    const toastRef = useRef(null);

    // redux-toolkit get Data
    const leave = useSelector(state => state.entry.leaveType);
    const dispatch = useDispatch();

    // InputText onChange Handler
    const onChangeHandler = e => {
        setEmployeeLeave(prevState => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };

    const restoreDefaultState = data => {
        if (data) {
            setEmployeeLeave({
                emp_id: '',
                emp_name: '',
                nrc: '',
                emp_rank_id: '',
                rank_id: '',
                rank_desc: '',
                emp_dept_id: '',
                dept_id: '',
                dept_desc: '',
                lev_id: '',
                lev_type: '',
                total_leave_days: 0,
                leave_detail: '',
                leave_start_date: new Date(),
                leave_end_date: new Date(),
                approved_person: '',
                approved_date: new Date(),
            });
        } else {
            setEmployeeLeave(prevState => {
                return (
                    {
                        ...prevState,
                        emp_name: '',
                        nrc: '',
                        emp_rank_id: '',
                        rank_id: '',
                        rank_desc: '',
                        emp_dept_id: '',
                        dept_id: '',
                        dept_desc: '',
                        lev_id: '',
                        lev_type: '',
                        total_leave_days: 0,
                        leave_detail: '',
                        leave_start_date: new Date(),
                        leave_end_date: new Date(),
                        approved_person: '',
                        approved_date: new Date(),
                    } || prevState
                );
            });
        }
    };

    // Search evaluation
    const onSearchHandler = async id => {
        try {
            const res = await axiosInstance.get(`/rank/transaction/search?id=${id}`);
            const { emp_id, emp_name, nrc, emp_dept_id, dept_id, dept_desc, emp_rank_id, rank_id, rank_desc } = res.data.data;

            if (res.status === 200) {
                setEmployeeLeave(prevState => ({ ...prevState, emp_id, emp_name, nrc, emp_dept_id, dept_id, dept_desc, emp_rank_id, rank_id, rank_desc }) || prevState);
            }
        } catch (error) {
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.error });
        }
    };

    // Dropdown onChange handler
    const onChangeDropdownHandler = e => {
        setEmployeeLeave(prevState => {
            return (
                {
                    ...prevState,
                    lev_id: e.value.lev_id,
                    lev_type: e.value.lev_type,
                } || prevState
            );
        });
        setDropdownValue(e.value);
    };

    // Submit Handler
    const onSubmitHandler = async e => {
        e.preventDefault();

        try {
            const res = await axiosInstance.post('/leave/transaction', employeeLeave);
            const { message } = res.data;

            if (res.status === 201) {
                restoreDefaultState('submit');
                toastRef.current.show({ severity: 'success', summary: 'Success', detail: message });
            }
        } catch (error) {
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.error });
            console.log(error);
        }
    };

    // Calculate Date Function
    const CalcDate = (startDateTime, endDateTime) => {
        const startDate = new Date(startDateTime).getTime();
        const endDate = new Date(endDateTime).getTime();
        return Math.ceil(Math.abs((startDate - endDate) / (1000 * 3600 * 24)));
    };

    // Calculate total date
    useEffect(() => {
        if (employeeLeave.leave_start_date && employeeLeave.leave_end_date) {
            setEmployeeLeave(prevState => {
                const durationDate = CalcDate(employeeLeave.leave_start_date, employeeLeave.leave_end_date);
                return { ...prevState, total_leave_days: durationDate } || prevState;
            });
        }
    }, [employeeLeave.leave_start_date, employeeLeave.leave_end_date]);

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
                    <h1 className='text-3xl underline'>Employee Leave</h1>
                </div>
            </div>
            <div className='card mt-6'>
                <form
                    className='col-12'
                    onSubmit={onSubmitHandler}
                >
                    <div className='p-fluid form-grid grid'>
                        <div className='field col-12'>
                            <div className='p-inputgroup col-12 md:col-6'>
                                <label
                                    htmlFor='emp_id'
                                    className='p-inputgroup-addon'
                                >
                                    ID
                                </label>
                                <InputText
                                    id='emp_id'
                                    name='emp_id'
                                    type='search'
                                    value={employeeLeave.emp_id}
                                    onChange={e => {
                                        onChangeHandler(e);
                                    }}
                                    required
                                />
                                <Button
                                    label='Search'
                                    type='button'
                                    onClick={() => onSearchHandler(employeeLeave.emp_id)}
                                />
                            </div>
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='emp_name'>Name</label>
                            <InputText
                                id='emp_name'
                                name='emp_name'
                                type='text'
                                value={employeeLeave.emp_name}
                                onChange={onChangeHandler}
                                readOnly
                                required
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='dept_desc'>Department</label>
                            <InputText
                                id='dept_desc'
                                name='dept_desc'
                                type='text'
                                value={employeeLeave.dept_desc}
                                onChange={onChangeHandler}
                                required
                                readOnly
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='rank_desc'>Rank</label>
                            <InputText
                                id='rank_desc'
                                name='rank_desc'
                                type='text'
                                value={employeeLeave.rank_desc}
                                onChange={onChangeHandler}
                                readOnly
                                required
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='leave'>Leave Type</label>
                            <Dropdown
                                inputId='leave'
                                name='leave'
                                value={dropdownValue}
                                onChange={onChangeDropdownHandler}
                                options={leave}
                                optionLabel='lev_type'
                                placeholder='Choose Leave Type'
                                required
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='total_leave_days'>Total Leave Day</label>
                            <InputNumber
                                inputId='total_leave_days'
                                name='total_leave_days'
                                value={employeeLeave.total_leave_days}
                                readOnly
                                required
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='leave_detail'>Leave Details</label>
                            <InputText
                                id='leave_detail'
                                name='leave_detail'
                                value={employeeLeave.leave_detail}
                                onChange={onChangeHandler}
                                required
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='leave_start_date'>Start Date</label>
                            <Calendar
                                inputId='leave_start_date'
                                name='leave_start_date'
                                value={employeeLeave.leave_start_date}
                                onChange={onChangeHandler}
                                placeholder='Choose Assign Date'
                                showIcon
                                required
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='leave_end_date'>End Date</label>
                            <Calendar
                                inputId='leave_end_date'
                                name='leave_end_date'
                                value={employeeLeave.leave_end_date}
                                onChange={onChangeHandler}
                                placeholder='Choose Register Date'
                                minDate={employeeLeave.leave_start_date}
                                showIcon
                                required
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='approved_person'>Approved Person</label>
                            <InputText
                                id='approved_person'
                                name='approved_person'
                                value={employeeLeave.approved_person}
                                onChange={onChangeHandler}
                                required
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='approved_date'>Approved Date</label>
                            <Calendar
                                inputId='approved_date'
                                name='approved_date'
                                value={employeeLeave.approved_date}
                                showIcon
                                placeholder='Choose Approved Date'
                                onChange={onChangeHandler}
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

export default CreateEmployeeLeave;
