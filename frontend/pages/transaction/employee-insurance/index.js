import React, { useEffect, useRef, useState, useCallback } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { update as entryUpdate } from '@/features/entry/entrySlice';
import { axiosInstance } from '@/utils/axiosInstance';

const CreateEmployeeInsurance = () => {
    const router = useRouter();
    const [employeeInsuranceValues, setEmployeeInsuranceValues] = useState({
        emp_id: '',
        emp_name: '',
        nrc: '',
        emp_rank_id: '',
        rank_id: '',
        rank_desc: '',
        emp_dept_id: '',
        dept_id: '',
        dept_desc: '',
        iid: '',
        insurance_type: '',
    });
    const [dropdownValue, setDropdownValue] = useState();
    const toastRef = useRef(null);

    // redux-toolkit get Data
    const insuranceTypes = useSelector(state => state.entry.insuranceType);

    const dispatch = useDispatch();

    // InputText onChange Handler
    const onChangeHandler = e => {
        setEmployeeInsuranceValues(prevState => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };

    // Restore Default State
    const restoreDefaultState = data => {
        if (data) {
            setEmployeeInsuranceValues({
                emp_id: '',
                emp_name: '',
                nrc: '',
                emp_rank_id: '',
                rank_id: '',
                rank_desc: '',
                emp_dept_id: '',
                dept_id: '',
                dept_desc: '',
                iid: '',
                insurance_type: '',
            });
        } else {
            setEmployeeInsuranceValues(prevState => {
                return {
                    ...prevState,
                    emp_name: '',
                    nrc: '',
                    emp_rank_id: '',
                    rank_id: '',
                    rank_desc: '',
                    emp_dept_id: '',
                    dept_id: '',
                    dept_desc: '',
                    iid: '',
                    insurance_type: '',
                };
            });
        }
    };

    // Search evaluation
    const onSearchHandler = async id => {
        try {
            const res = await axiosInstance.get(`/rank/transaction/search?id=${id}`);
            const { data } = res.data;

            if (res.status === 200) {
                setEmployeeInsuranceValues(prevState => {
                    return {
                        ...prevState,
                        emp_id: data.emp_id,
                        emp_name: data.emp_name,
                        nrc: data.nrc,
                        emp_rank_id: data.emp_rank_id,
                        rank_id: data.rank_id,
                        rank_desc: data.rank_desc,
                        emp_dept_id: data.emp_dept_id,
                        dept_id: data.dept_id,
                        dept_desc: data.dept_desc,
                    };
                });
            }
        } catch (error) {
            restoreDefaultState();
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.error, life: 3000 });
        }
    };

    // Dropdown onChange handler
    const onChangeDropdownHandler = e => {
        setEmployeeInsuranceValues(prevState => {
            return {
                ...prevState,
                iid: e.value.iid,
                insurance_type: e.value.insurance_type,
            };
        });
        setDropdownValue(e.value);
    };

    // Submit Handler
    const onSubmitHandler = async e => {
        e.preventDefault();

        try {
            const res = await axiosInstance.post('/insurance/transaction', employeeInsuranceValues);
            const { message } = res.data;

            if (res.status === 201) {
                restoreDefaultState('submit');
                toastRef.current.show({ severity: 'success', summary: 'Success', detail: message });
            }
        } catch (err) {
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: err?.response?.data?.error });
        }
    };

    const fetchInsTypes = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/insurance/entry');

            const { data } = await res.data;

            if (res.status === 200) {
                dispatch(entryUpdate({ stateProperty: 'insuranceType', data }));
            }
        } catch (error) {
            dispatch(entryUpdate({ stateProperty: 'insuranceType', data: [] }));
            console.log(error);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchInsTypes();
    }, [fetchInsTypes]);

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
                    <h1 className='text-3xl underline'>Employee Insurance</h1>
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
                                    value={employeeInsuranceValues.emp_id}
                                    onChange={e => {
                                        onChangeHandler(e);
                                    }}
                                    required
                                />
                                <Button
                                    label='Search'
                                    type='button'
                                    onClick={() => onSearchHandler(employeeInsuranceValues.emp_id)}
                                />
                            </div>
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='emp_name'>Name</label>
                            <InputText
                                id='emp_name'
                                name='emp_name'
                                type='text'
                                value={employeeInsuranceValues.emp_name}
                                onChange={onChangeHandler}
                                required
                                disabled
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='emp_rank'>Rank</label>
                            <InputText
                                id='emp_rank'
                                name='emp_rank'
                                type='text'
                                value={employeeInsuranceValues.rank_desc}
                                onChange={onChangeHandler}
                                required
                                disabled
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='emp_dept'>Department</label>
                            <InputText
                                id='emp_dept'
                                name='emp_dept'
                                type='text'
                                value={employeeInsuranceValues.dept_desc}
                                onChange={onChangeHandler}
                                required
                                disabled
                            />
                        </div>

                        <div className='field col-12'>
                            <label htmlFor='insurance_type'>Insurance Type</label>
                            <Dropdown
                                inputId='insurance_type'
                                name='insurance_type'
                                value={dropdownValue}
                                onChange={onChangeDropdownHandler}
                                options={insuranceTypes}
                                optionLabel='insurance_type'
                                placeholder='ရွေးချယ်ရန်'
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

export default CreateEmployeeInsurance;
