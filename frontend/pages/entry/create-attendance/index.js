import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { create, update } from '@/features/entry/entrySlice';
import { update as transactionUpdate } from '@/features/transaction/transactionSlice';
import { axiosInstance } from '@/utils/axiosInstance';

const CreateDepartment = () => {
    const router = useRouter();
    const [attendance, setAttendance] = useState({
        emp_id: '',
        emp_name: '',
        emp_rank: '',
        start_date_time: undefined,
        end_date_time: undefined,
        reg_Date: Date.now(),
    });
    const toastRef = useRef(null);

    // redux-toolkit
    const attendanceList = useSelector(state => state.entry.attendance);
    const dispatch = useDispatch();

    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);

    const onSearchEmployee = async id => {
        try {
            const res = await axiosInstance.get(`/profile/search?id=${id}`);
            const { data: employee } = res.data;

            setAttendance(prevState => ({ ...prevState, emp_id: employee.employeeID, emp_name: employee.employee_name }));
        } catch (error) {}
    };

    const onChangeHandler = e => {
        setAttendance(prevState => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };

    const onSubmitHandler = async e => {
        e.preventDefault();

        try {
        } catch (err) {
            console.error(err);
        }
    };

    const onEditHandler = async e => {
        try {
        } catch (err) {
            console.error(err);
        }
    };

    const attendanceInfoEditor = options => {
        return (
            <Calendar
                name={options.field}
                value={new Date(options.value)}
                onChange={e => options.editorCallback(e.target.value)}
                showTime
            />
        );
    };

    const dateTimeBodyTemplate = data => {
        return data.substring(0, 25);
    };

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
                    <h1 className='text-3xl underline'>ရုံးတက်/ရုံးဆင်းချိန်သတ်မှတ်ခြင်း</h1>
                </div>
            </div>
            <div className='card mt-6'>
                <form
                    className='p-fluid formgrid grid'
                    onSubmit={onSubmitHandler}
                >
                    <div className='field col-12'>
                        <div className='p-inputgroup col-12 md:col-6'>
                            <label
                                htmlFor='emp_id'
                                className='p-inputgroup-addon font-bold px-2'
                            >
                                ID
                            </label>
                            <InputText
                                id='emp_id'
                                name='emp_id'
                                type='search'
                                value={attendance.emp_id}
                                onChange={onChangeHandler}
                                required
                            />
                            <Button
                                label='Search'
                                type='button'
                                onClick={() => onSearchEmployee(attendance.emp_id)}
                            />
                        </div>
                    </div>

                    <div className='field col-12 md:col-6'>
                        <label htmlFor='emp_name'>အမည်</label>
                        <InputText
                            id='emp_name'
                            name='emp_name'
                            value={attendance.emp_name}
                            onChange={onChangeHandler}
                            required
                        />
                    </div>

                    <div className='field col-12 md:col-6'>
                        <label htmlFor='emp_rank'>ရာထူး</label>
                        <InputText
                            id='emp_rank'
                            name='emp_rank'
                            value={attendance.emp_rank}
                            onChange={onChangeHandler}
                            required
                        />
                    </div>

                    <div className='field col-12 md:col-6'>
                        <label htmlFor='start_date_time'>အလုပ်ဝင်သည့်အချိန်</label>
                        <Calendar
                            inputId='start_date_time'
                            name='start_date_time'
                            value={attendance.start_date_time}
                            onChange={onChangeHandler}
                            showIcon
                            showTime
                            required
                        />
                    </div>

                    <div className='field col-12 md:col-6'>
                        <label htmlFor='end_date_time'>အလုပ်ဆင်းသည့်အချိန်</label>
                        <Calendar
                            inputId='end_date_time'
                            name='end_date_time'
                            value={attendance.end_date_time}
                            onChange={onChangeHandler}
                            showIcon
                            showTime
                            required
                        />
                    </div>

                    <div className='field flex justify-content-end col-12 my-5'>
                        <Button
                            label='Submit'
                            type='submit'
                            className='w-auto'
                        />
                    </div>
                </form>

                <div className='col-12 mt-5'>
                    <DataTable
                        value={attendanceList}
                        editMode='row'
                        paginator
                        rows={10}
                        removableSort
                        showGridlines
                        onRowEditComplete={onEditHandler}
                        emptyMessage={'ရုံးတက်/ရုံးဆင်းချိန် သတ်မှတ်ထားခြင်းမရှိပါ။'}
                    >
                        <Column
                            field='rid'
                            header='ID'
                            sortable
                        />
                        <Column
                            field='emp_id'
                            header='Employee ID'
                            sortable
                        />
                        <Column
                            field='emp_name'
                            header='အမည်'
                            sortable
                        />
                        <Column
                            field='start_date_time'
                            header='အလုပ်ဝင်သည့်အချိန်'
                            editor={options => attendanceInfoEditor(options)}
                            body={options => dateTimeBodyTemplate(new Date(options.start_date_time).toString())}
                            sortable
                        />
                        <Column
                            field='end_date_time'
                            header='အလုပ်ဆင်သည့်အချိန်'
                            editor={options => attendanceInfoEditor(options)}
                            body={options => dateTimeBodyTemplate(new Date(options.end_date_time).toString())}
                            sortable
                        />
                        <Column rowEditor />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default CreateDepartment;
