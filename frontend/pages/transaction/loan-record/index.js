import React, { useCallback, useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { update as entryUpdate } from '@/features/entry/entrySlice';
import { axiosInstance } from '@/utils/axiosInstance';

const CreateLoanRecord = () => {
    const router = useRouter();
    const [loanRecord, setLoanRecord] = useState({
        emp_id: '',
        emp_name: '',
        nrc: '',
        emp_dept_id: '',
        dept_id: '',
        dept_desc: '',
        emp_rank_id: '',
        rank_id: '',
        rank_desc: '',
        loan_id: '',
        loan_type: '',
        loan_amount: 0,
        loan_request_date: new Date(),
        loan_submittion_date: new Date(),
        loan_insurance_person: '',
        loan_issued_person: '',
        repayment_start_date: new Date(),
        repayment_end_date: new Date(),
        loan_submited_detail: '',
    });
    const [dropdownValue, setDropdownValue] = useState();
    const toastRef = useRef(null);

    // redux-toolkit get Data
    const loanTypeList = useSelector(state => state.entry.loanType);
    const dispatch = useDispatch();

    // restore default state
    const restoreDefaultState = data => {
        if (data) {
            setLoanRecord({
                emp_id: '',
                emp_name: '',
                nrc: '',
                emp_dept_id: '',
                dept_id: '',
                dept_desc: '',
                emp_rank_id: '',
                rank_id: '',
                rank_desc: '',
                loan_id: '',
                loan_type: '',
                loan_amount: 0,
                loan_request_date: new Date(),
                loan_submittion_date: new Date(),
                loan_insurance_person: '',
                loan_issued_person: '',
                repayment_start_date: new Date(),
                repayment_end_date: new Date(),
                loan_submited_detail: '',
            });
            setDropdownValue(null);
        } else {
            setLoanRecord(prevState => ({
                ...prevState,
                emp_name: '',
                nrc: '',
                emp_dept_id: '',
                dept_id: '',
                dept_desc: '',
                emp_rank_id: '',
                rank_id: '',
                rank_desc: '',
                loan_id: '',
                loan_type: '',
                loan_amount: 0,
                loan_request_date: new Date(),
                loan_submittion_date: new Date(),
                loan_insurance_person: '',
                loan_issued_person: '',
                repayment_start_date: new Date(),
                repayment_end_date: new Date(),
                loan_submited_detail: '',
            }));
            setDropdownValue(null);
        }
    };

    // Search Handler
    const onSearchHandler = async id => {
        try {
            const res = await axiosInstance.get(`/rank/transaction/search?id=${id}`);
            const { emp_id, emp_name, nrc, emp_dept_id, dept_id, dept_desc, emp_rank_id, rank_id, rank_desc } = res.data.data;

            if (res.status === 200) {
                setLoanRecord(prevState => ({ ...prevState, emp_id, emp_name, nrc, emp_dept_id, dept_id, dept_desc, emp_rank_id, rank_id, rank_desc }));
            }
        } catch (error) {
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.error });
        }
    };

    // InputText onChange Handler
    const onChangeHandler = e => {
        setLoanRecord(prevState => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };

    // Dropdown onChange handler
    const onChangeDropdownHandler = e => {
        setLoanRecord(prevState => ({ ...prevState, loan_id: e.target.value.loan_id, loan_type: e.target.value.loan_type }));
        setDropdownValue(e.value);
    };

    // Submit Handler
    const onSubmitHandler = async e => {
        e.preventDefault();

        try {
            const res = await axiosInstance.post('/loan/transaction', loanRecord);
            const { message } = res.data;

            if (res.status === 201) {
                restoreDefaultState('submit');
                toastRef.current.show({ severity: 'success', summary: 'Success', detail: message });
            }
        } catch (error) {
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.error });
            console.error(error);
        }
    };

    const fetchLoanType = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/loan/entry');
            const { data } = res.data;

            if (res.status === 200) {
                dispatch(entryUpdate({ stateProperty: 'loanType', data }));
            }
        } catch (error) {
            dispatch(entryUpdate({ stateProperty: 'loanType', data: [] }));
            console.log(error);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchLoanType().catch(error => console.log(error));
    }, [fetchLoanType]);

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
                    <h1 className='text-3xl underline'>Loan Record</h1>
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
                                    value={loanRecord.emp_id}
                                    onChange={onChangeHandler}
                                    required
                                />
                                <Button
                                    label='Search'
                                    type='button'
                                    onClick={() => onSearchHandler(loanRecord.emp_id)}
                                />
                            </div>
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='emp_name'>Name</label>
                            <InputText
                                id='emp_name'
                                name='emp_name'
                                type='text'
                                value={loanRecord.emp_name}
                                onChange={onChangeHandler}
                                required
                                readOnly
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='dept_desc'>Department</label>
                            <InputText
                                id='dept_desc'
                                name='dept_desc'
                                type='text'
                                value={loanRecord.dept_desc}
                                onChange={onChangeHandler}
                                required
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='rank_desc'>Rank</label>
                            <InputText
                                id='rank_desc'
                                name='rank_desc'
                                type='text'
                                value={loanRecord.rank_desc}
                                onChange={onChangeHandler}
                                required
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='loan'>Loan Type</label>
                            <Dropdown
                                inputId='loan'
                                name='loan'
                                value={dropdownValue}
                                onChange={onChangeDropdownHandler}
                                options={loanTypeList}
                                optionLabel='loan_type'
                                placeholder='Choose Loan Type'
                                required
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='loan_amount'>Loan Amount</label>
                            <InputNumber
                                inputId='loan_amount'
                                name='loan_amount'
                                value={loanRecord.loan_amount}
                                onValueChange={onChangeHandler}
                                required
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='loan_request_date'>Request Date</label>
                            <Calendar
                                inputId='loan_request_date'
                                name='loan_request_date'
                                value={loanRecord.loan_request_date}
                                onChange={onChangeHandler}
                                placeholder='Choose Request Date'
                                showIcon
                                required
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='loan_submittion_date'>Submittion Date</label>
                            <Calendar
                                inputId='loan_submittion_date'
                                name='loan_submittion_date'
                                value={loanRecord.loan_submittion_date}
                                onChange={onChangeHandler}
                                placeholder='Choose Submittion Date'
                                showIcon
                                required
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='loan_insurance_person'>Insurance Person</label>
                            <InputText
                                id='loan_insurance_person'
                                name='loan_insurance_person'
                                value={loanRecord.loan_insurance_person}
                                onChange={onChangeHandler}
                                required
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='loan_issued_person'>Issued Person</label>
                            <InputText
                                id='loan_issued_person'
                                name='loan_issued_person'
                                value={loanRecord.loan_issued_person}
                                onChange={onChangeHandler}
                                required
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='repayment_start_date'>Repayment Start Date</label>
                            <Calendar
                                inputId='repayment_start_date'
                                name='repayment_start_date'
                                value={loanRecord.repayment_start_date}
                                showIcon
                                placeholder='Choose start date'
                                onChange={onChangeHandler}
                            />
                        </div>

                        <div className='field col-12 md:col-6'>
                            <label htmlFor='repayment_end_date'>Repayment End Date</label>
                            <Calendar
                                inputId='repayment_end_date'
                                name='repayment_end_date'
                                value={loanRecord.repayment_end_date}
                                minDate={loanRecord.repayment_start_date}
                                showIcon
                                placeholder='Choose end date'
                                onChange={onChangeHandler}
                            />
                        </div>

                        <div className='field col-12'>
                            <label htmlFor='loan_submited_detail'>Submited Detail</label>
                            <InputTextarea
                                id='loan_submited_detail'
                                name='loan_submited_detail'
                                value={loanRecord.loan_submited_detail}
                                onChange={onChangeHandler}
                                required
                                rows={5}
                                cols={30}
                                autoResize
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

export default CreateLoanRecord;
