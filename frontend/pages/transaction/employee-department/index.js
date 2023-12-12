import React, { useEffect, useState, useRef, useCallback } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { update as entryUpdate } from '@/features/entry/entrySlice';
import { Toast } from 'primereact/toast';
import { axiosInstance } from '@/utils/axiosInstance';

const CreateEmployeeDepartment = () => {
    const router = useRouter();
    const [employeeDepartment, setEmployeeDepartment] = useState({
        emp_id: '',
        emp_name: '',
        nrc: '',
        dept_id: '',
        dept_desc: '',
    });
    const [dropdownValue, setDropdownValue] = useState();
    const toastRef = useRef(null);

    // redux-toolkit get Data
    const department = useSelector(state => state.entry.department);

    const dispatch = useDispatch();

    // InputText onChange Handler
    const onChangeHandler = e => {
        setEmployeeDepartment(prevState => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };

    const restoreDefaultState = data => {
        if (data) {
            setEmployeeDepartment({
                emp_id: '',
                emp_name: '',
                nrc: '',
                dept_id: '',
                dept_desc: '',
            });
            setDropdownValue(null);
        } else {
            setEmployeeDepartment(prevState => {
                return {
                    ...prevState,
                    emp_name: '',
                    nrc: '',
                    dept_id: '',
                    dept_desc: '',
                };
            });
            setDropdownValue(null);
        }
    };

    // Search Employee
    const onSearchHandler = async id => {
        try {
            const res = await axiosInstance.get(`/profile/search?id=${id}`);
            const { data } = res.data;

            if (res.status === 200) {
                setEmployeeDepartment(prevState => ({ ...prevState, emp_id: data.employeeID, emp_name: data.employee_name, nrc: data.NRC }));
            }
        } catch (error) {
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.error });
            restoreDefaultState();
        }
    };

    // Dropdown onChange handler
    const onChangeDropdownHandler = e => {
        setEmployeeDepartment(prevState => {
            return {
                ...prevState,
                dept_desc: e.value.dept_desc,
                dept_id: e.value.dept_id,
            };
        });
        setDropdownValue(e.value);
    };

    // Submit Handler
    const onSubmitHandler = async e => {
        e.preventDefault();

        try {
            const res = await axiosInstance.post('/department/transaction', {
                emp_id: employeeDepartment.emp_id,
                emp_name: employeeDepartment.emp_name,
                nrc: employeeDepartment.nrc,
                dept_id: employeeDepartment.dept_id,
                dept_desc: employeeDepartment.dept_desc,
            });
            const { message } = res.data;

            if (res.status === 201) {
                toastRef.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: message,
                });
                restoreDefaultState('submit');
            }
        } catch (error) {
            toastRef.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Something wrong',
            });
        }
    };

    const fetchDepartment = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/department/entry');
            const { data } = res.data;

            if (res.status === 200) {
                dispatch(entryUpdate({ stateProperty: 'department', data }));
            }
        } catch (error) {
            dispatch(entryUpdate({ stateProperty: 'department', data: [] }));
        }
    }, [dispatch]);

    useEffect(() => {
        fetchDepartment();
    }, [fetchDepartment]);

    return (
        <div className='flex-1'>
            <Toast
                ref={toastRef}
                position='top-right'
            />
            <div className='flex gap-5'>
                <Button
                    icon='pi pi-arrow-left'
                    rounded
                    raised
                    onClick={() => router.back()}
                />

                <div className='h-full'>
                    <h1 className='text-3xl underline'>Employee Department</h1>
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
                                    value={employeeDepartment.emp_id}
                                    onChange={e => {
                                        onChangeHandler(e);
                                    }}
                                    required
                                />
                                <Button
                                    label='Search'
                                    type='button'
                                    onClick={() => onSearchHandler(employeeDepartment.emp_id)}
                                />
                            </div>
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='emp_name'>Name</label>
                            <InputText
                                id='emp_name'
                                name='emp_name'
                                type='text'
                                value={employeeDepartment.emp_name}
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
                                value={employeeDepartment.nrc}
                                onChange={onChangeHandler}
                                required
                                disabled
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='department'>Department</label>
                            <Dropdown
                                inputId='department'
                                name='department'
                                value={dropdownValue}
                                onChange={onChangeDropdownHandler}
                                options={department}
                                optionLabel='dept_desc'
                                placeholder='Choose Department'
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

export default CreateEmployeeDepartment;
