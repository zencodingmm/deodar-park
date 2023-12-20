import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';

import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import { update as transactionUpdate } from '@/features/transaction/transactionSlice';
import { update as entryUpdate } from '@/features/entry/entrySlice';

const DepartmentReport = () => {
    const router = useRouter();
    const toastRef = useRef(null);
    const searchFilterValue = [{ name: 'Employee ID', code: 'id' }];

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filterDropdown, setFilterDropdown] = useState(searchFilterValue[0]);

    const loanRecordList = useSelector(state => state.transaction.loanRecord);
    const loanType = useSelector(state => state.entry.loanType);
    const dispatch = useDispatch();

    const clearFilter = () => {
        setGlobalFilterValue('');
    };

    const onGlobalFilterChange = e => {
        setGlobalFilterValue(e.target.value);
    };

    const onSearchFilter = id => {};

    const dropDownEditor = options => {
        // const value = getLeaveType.data.find((lt) => lt.lev_type === options.value);
        const loan = loanType.find(loan => loan.loan_type === options.value);

        return (
            <Dropdown
                value={loan}
                onChange={e => {
                    options.editorCallback(e.value?.loan_type);
                }}
                options={loanType}
                optionLabel='loan_type'
                placeholder='ရွေးချယ်ရန်'
            />
        );
    };

    // header for datatable
    const renderHeader = () => {
        return (
            <div className='flex gap-3'>
                <div>
                    <Dropdown
                        value={filterDropdown}
                        onChange={e => {
                            setFilterDropdown(e.target.value);
                        }}
                        options={searchFilterValue}
                        optionLabel='name'
                    />
                </div>
                <div className='p-inputgroup w-20rem'>
                    <InputText
                        type='search'
                        placeholder='Search'
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                    />

                    <Button
                        label='Search'
                        onClick={() => onSearchFilter(globalFilterValue)}
                    />
                </div>
                <Button
                    label='Clear'
                    severity='danger'
                    onClick={clearFilter}
                />
            </div>
        );
    };

    const allowanceAmount = options => {
        return (
            <InputNumber
                value={options.value}
                onValueChange={e => options.editorCallback(e.value)}
            />
        );
    };

    // Datatable edit handler
    const onEditHandler = async e => {
        try {
        } catch (err) {
            console.error(err);
        }
    };

    const dateTimeEditor = options => {
        return (
            <Calendar
                name={options.field}
                value={new Date(options.value)}
                onChange={e => options.editorCallback(e.target.value)}
            />
        );
    };

    const textEditor = options => {
        return (
            <InputText
                type='text'
                value={options.value}
                onChange={e => options.editorCallback(e.target.value)}
            />
        );
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
                    <h1 className='text-3xl underline'>Record Reports</h1>
                </div>
            </div>

            <div className='col-12 mt-5 card'>
                {!isFetched && (
                    <div className='flex justify-content-center align-items-center'>
                        <ProgressSpinner
                            style={{ width: '50px', height: '50px' }}
                            strokeWidth='8'
                            fill='var(--surface-ground)'
                            animationDuration='.5s'
                        />
                    </div>
                )}
                {isFetched && (
                    // console.log("list",loanRecordList)

                    <DataTable
                        value={loanRecordList || undefined}
                        editMode='row'
                        paginator={true}
                        lazy={true}
                        first={firsts}
                        rows={rows}
                        totalRecords={record}
                        removableSort
                        showGridlines
                        onRowEditComplete={onEditHandler}
                        emptyMessage='Information not found'
                        header={renderHeader}
                        onPage={e => {
                            if (!isPreviousData) {
                                setFirsts(e.first);
                                setRows(e.rows);
                                setPage(e.page);
                            }
                        }}
                    >
                        <Column
                            field='emp_loan_id'
                            header='Id'
                            sortable
                        />

                        <Column
                            field='emp_id'
                            header='အမည်'
                        />

                        <Column
                            field='emp_rank_id'
                            header='Rank Type'
                        />

                        <Column
                            field='emp_dept_id'
                            header='Department'
                        />

                        <Column
                            field='loan_id'
                            header='loan_id'
                            editor={options => dropDownEditor(options)}
                        />

                        <Column
                            field='loan_amount'
                            header='loan_amount'
                            editor={options => allowanceAmount(options)}
                        />

                        <Column
                            field='loan_request_date'
                            header='loan_request_date'
                            editor={options => dateTimeEditor(options)}
                        />

                        <Column
                            field='loan_submittion_date'
                            header='loan_submittion_date'
                            editor={options => dateTimeEditor(options)}
                        />

                        <Column
                            field='loan_insurance_person'
                            header='loan_insurance_person'
                            editor={options => textEditor(options)}
                        />

                        <Column
                            field='loan_submited_detail'
                            header='loan_submited_detail'
                            editor={options => textEditor(options)}
                        />

                        <Column
                            field='loan_issued_person'
                            header='loan_issued_person'
                            editor={options => textEditor(options)}
                        />

                        <Column
                            field='reg_date'
                            header='reg_date'
                            editor={options => dateTimeEditor(options)}
                        />

                        <Column
                            field='repayment_start_date'
                            header='repayment_start_date'
                            editor={options => dateTimeEditor(options)}
                            body={options => new Date(options?.repayment_start_date).toString().substring(0, 15)}
                        />

                        <Column
                            field='repayment_end_date'
                            header='repayment_end_date'
                            editor={options => dateTimeEditor(options)}
                            body={options => new Date(options?.repayment_end_date).toString().substring(0, 15)}
                        />

                        <Column
                            field='reg_date'
                            header='Reg Date'
                            editor={options => dateTimeEditor(options)}
                            body={options => new Date(options?.reg_date).toString().substring(0, 15)}
                        />
                        {/* <Column
              field="dept_desc"
              header="Department"
              sortField="dept_id"
              // editor={(options) => dropDownEditor(options)}
            /> */}
                        <Column rowEditor />
                    </DataTable>
                )}
            </div>
        </div>
    );
};

export default DepartmentReport;
