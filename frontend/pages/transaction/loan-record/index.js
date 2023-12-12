import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";

import { useRouter } from "next/router";

import { useDispatch, useSelector } from "react-redux";
import { create as transactionCreate } from "@/features/transaction/transactionSlice";
import { update as entryUpdate } from "@/features/entry/entrySlice";
import { useEmployee } from "@/hooks/useEmployee";
import { useDepartment, useEmployeeDepartment } from "@/hooks/useDepartment";
import { useEmployeeRank, useRank } from "@/hooks/useRank";
import { useEmployeeLoanRecord, useLoanType } from "@/hooks/useLoan";

const CreateLoanRecord = () => {
  const router = useRouter();
  const [loanRecord, setLoanRecord] = useState({
    emp_id: "",
    emp_name: "",
    emp_rank_id: "",
    emp_rank: "",
    emp_dept_id: "",
    emp_dept: "",
    loan_id: "",
    loan_type: "",
    loan_amount: 0,
    loan_request_date: undefined,
    loan_submittion_date: undefined,
    loan_insurance_person: "",
    loan_submited_detail: "",
    loan_issued_person: "",
    reg_date: new Date(),
    repayment_start_date: null,
    repayment_end_date: null,
  });
  const [dropdownValue, setDropdownValue] = useState();
  const toastRef = useRef(null);

  // redux-toolkit get Data
  const loanTypeList = useSelector((state) => state.entry.loanType);
  const dispatch = useDispatch();

  // tanstack-query
  const [queryFetch, setQueryFetch] = useState({
    field: null,
    data: null,
    empData: null,
    empDatas: null,
    datas: null,
  });
  const [record, setRecord] = useState(0);

  // employees
  const { useEmployeeProfileSingleGetQuery } = useEmployee();
  const {
    data: getEmployees,
    isSuccess: getEmployeesSuccess,
    isError: getEmployeesError,
  } = useEmployeeProfileSingleGetQuery({
    field: queryFetch.field,
    data: queryFetch.data,
  });

  // employee department
  const { useSingleEmployeeDepartmentGetQuery } = useEmployeeDepartment();
  // get
  const {
    data: getEmployeeDepartment,
    isSuccess: getEmployeeDepartmentSuccess,
    isError: getEmployeeDepartmentError,
  } = useSingleEmployeeDepartmentGetQuery({ id: queryFetch.data });

  // Department Type List
  const { useDepartmentGetQuery } = useDepartment();
  const { data: getDepartmentList, isSuccess: getDepartmentListSuccess } =
    useDepartmentGetQuery();

  // employee rank
  const { useQueryGetSingleEmployeeRank } = useEmployeeRank();
  // get employee rank
  const {
    data: getEmployeeRank,
    isSuccess: getEmployeeRankSuccess,
    isError: getEmployeeRankError,
  } = useQueryGetSingleEmployeeRank({ id: queryFetch.data });

  // Rank Type List
  const { useQueryGetRank } = useRank();
  const { data: getRankList, isSuccess: getRankListSuccess } =
    useQueryGetRank();

  // Loan Type
  const { useQueryGetLoanType } = useLoanType();
  const { data: getLoanList, isSuccess: getLoanListSuccess } =
    useQueryGetLoanType();

  // Employee Loan List
  const { useMutationCreateEmployeeLoanRecord, useQueryGetEmployeeLoanRecord } =
    useEmployeeLoanRecord();
  // create
  const { mutateAsync: createEmployeeLoanRecord } =
    useMutationCreateEmployeeLoanRecord();
  // get
  const {
    data: getEmployeeLoanRecord,
    isSuccess: getEmployeeLoanRecordSuccess,
  } = useQueryGetEmployeeLoanRecord(0);

  // restore default state
  const restoreDefaultState = (data) => {
    if (data) {
      setLoanRecord({
        emp_id: "",
        emp_name: "",
        emp_rank_id: "",
        emp_rank: "",
        emp_dept_id: "",
        emp_dept: "",
        loan_id: "",
        loan_type: "",
        loan_amount: 0,
        loan_request_date: undefined,
        loan_submittion_date: undefined,
        loan_insurance_person: "",
        loan_submited_detail: "",
        loan_issued_person: "",
        reg_date: new Date(),
        repayment_start_date: undefined,
        repayment_end_date: undefined,
      });
      setDropdownValue(null);
    } else {
      setLoanRecord((prevState) => ({
        ...prevState,
        emp_name: "",
        emp_rank_id: "",
        emp_rank: "",
        emp_dept_id: "",
        emp_dept: "",
        loan_id: "",
        loan_type: "",
        loan_amount: 0,
        loan_request_date: undefined,
        loan_submittion_date: undefined,
        loan_insurance_person: "",
        loan_submited_detail: "",
        loan_issued_person: "",
        reg_date: new Date(),
        repayment_start_date: undefined,
        repayment_end_date: undefined,
      }));
      setDropdownValue(null);
    }
  };

  // Search Handler
  const onSearchHandler = (id) => {
    setQueryFetch((prevState) => ({
      field: "id",
      data: id,
      datas: prevState.datas,
    }));

    if (getEmployeesSuccess) {
      const employee = getEmployees.data;

      if (employee) {
        if (getEmployeeDepartmentSuccess) {
          const employeeDepartment = getEmployeeDepartment.data;

          if (employeeDepartment) {
            if (getDepartmentListSuccess) {
              const department = getDepartmentList.data.find(
                (dept) => dept.dept_id === employeeDepartment.dept_id
              );

              if (department) {
                if (getEmployeeRankSuccess) {
                  const employeeRank = getEmployeeRank.data;

                  if (employeeRank) {
                    if (getRankListSuccess) {
                      const rank = getRankList.data.find(
                        (rank) => rank.rank_id === employeeRank.rank_id
                      );

                      setLoanRecord((prevState) => ({
                        ...prevState,
                        emp_id: employee.employeeID,
                        emp_name: employee.employee_name,
                        emp_rank_id: employeeRank.emp_rank_id,
                        emp_rank: rank.rank_desc,
                        emp_dept_id: employeeDepartment.emp_dept_id,
                        emp_dept: department.dept_desc,
                      }));
                    }
                  }
                } else if (getEmployeeRankError) {
                  toastRef.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "This Employee have not set rank!",
                  });
                  // restore default state
                  restoreDefaultState();
                }
              }
            }
          }
        } else if (getEmployeeDepartmentError) {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: "This Employee have not set department!",
          });
          // restore default state
          restoreDefaultState();
        }
      }
    } else if (getEmployeesError) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Employee not found!",
      });
      // restore default state
      restoreDefaultState();
    }
  };

  // InputText onChange Handler
  const onChangeHandler = (e) => {
    setLoanRecord((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  // Dropdown onChange handler
  const onChangeDropdownHandler = (e) => {
    setLoanRecord((prevState) => ({
      ...prevState,
      loan_id: e.value.loan_id,
      loan_type: e.value.loan_type,
    }));
    setDropdownValue(e.value);
  };

  // Submit Handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      await createEmployeeLoanRecord(
        {
          emp_loan_id: record + 1 || 1,
          emp_id: loanRecord.emp_id,
          emp_rank_id: loanRecord.emp_rank_id,
          emp_dept_id: loanRecord.emp_dept_id,
          loan_id: loanRecord.loan_id,
          loan_amount: loanRecord.loan_amount,
          loan_request_date: loanRecord.loan_request_date,
          loan_submittion_date: loanRecord.loan_submittion_date,
          loan_insurance_person: loanRecord.loan_insurance_person,
          loan_submited_detail: loanRecord.loan_submited_detail,
          loan_issued_person: loanRecord.loan_issued_person,
          reg_date: loanRecord.reg_date,
          repayment_start_date: loanRecord.repayment_start_date,
          repayment_end_date: loanRecord.repayment_end_date,
        },
        {
          onSuccess: () => {
            setRecord((prevState) => prevState + 1);
            dispatch(
              transactionCreate({
                stateProperty: "loanRecord",
                data: {
                  emp_loan_id: record + 1 || 1,
                  ...loanRecord,
                  loan_request_date: loanRecord.loan_request_date.toString(),
                  loan_submittion_date:
                    loanRecord.loan_submittion_date.toString(),
                  reg_date: new Date(loanRecord.reg_date).toString(),
                  repayment_start_date: new Date(
                    loanRecord.repayment_start_date
                  ).toString(),
                  repayment_end_date: new Date(
                    loanRecord.repayment_end_date
                  ).toString(),
                },
              })
            );

            // Change default Value
            restoreDefaultState("submit");
          },
          onSettled: (data, error) => {
            if (error) {
              toastRef.current.show({
                severity: "error",
                summary: "Error",
                detail: error?.response?.data?.message,
              });
            } else {
              toastRef.current.show({
                severity: "success",
                summary: "Success",
                detail: data.message,
              });
            }
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  // get loan list type
  useEffect(() => {
    if (getLoanListSuccess) {
      dispatch(
        entryUpdate({ stateProperty: "loanType", data: getLoanList?.data })
      );
    }
  }, [dispatch, getLoanList, getLoanListSuccess]);

  useEffect(() => {
    if (getEmployeeLoanRecordSuccess) {
      setRecord(getEmployeeLoanRecord?.count);
    }
  }, [getEmployeeLoanRecordSuccess, getEmployeeLoanRecord]);

  console.log(loanRecord);

  return (
    <div className="flex-1">
      <Toast ref={toastRef} />
      <div className="flex gap-5">
        <Button
          icon="pi pi-arrow-left"
          rounded
          raised
          onClick={() => router.back()}
        />

        <div className="h-full">
          <h1 className="text-3xl underline">Loan Record</h1>
        </div>
      </div>
      <div className="card mt-6">
        <form className="col-12" onSubmit={onSubmitHandler}>
          <div className="p-fluid form-grid grid">
            <div className="field col-12 md:col-6">
              <label htmlFor="emp_id">ID</label>
              <div className="p-inputgroup">
                <InputText
                  id="emp_id"
                  name="emp_id"
                  type="search"
                  value={loanRecord.emp_id}
                  onChange={(e) => {
                    onChangeHandler(e);
                    setQueryFetch((prevState) => ({
                      ...prevState,
                      field: "id",
                      data: e.target.value,
                    }));
                  }}
                  required
                />
                <Button
                  label="Search"
                  type="button"
                  onClick={() => onSearchHandler(loanRecord.emp_id)}
                />
              </div>
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="emp_name">Name</label>
              <InputText
                id="emp_name"
                name="emp_name"
                type="text"
                value={loanRecord.emp_name}
                onChange={onChangeHandler}
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="emp_rank">Rank</label>
              <InputText
                id="emp_rank"
                name="emp_rank"
                type="text"
                value={loanRecord.emp_rank}
                onChange={onChangeHandler}
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="emp_dept">Department</label>
              <InputText
                id="emp_dept"
                name="emp_dept"
                type="text"
                value={loanRecord.emp_dept}
                onChange={onChangeHandler}
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="loan">Loan Type</label>
              <Dropdown
                inputId="loan"
                name="loan"
                value={dropdownValue}
                onChange={onChangeDropdownHandler}
                options={loanTypeList}
                optionLabel="loan_type"
                placeholder="Choose Loan Type"
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="loan_amount">Loan Amount</label>
              <InputNumber
                inputId="loan_amount"
                name="loan_amount"
                value={loanRecord.loan_amount}
                onValueChange={onChangeHandler}
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="loan_request_date">Request Date</label>
              <Calendar
                inputId="loan_request_date"
                name="loan_request_date"
                value={loanRecord.loan_request_date}
                onChange={onChangeHandler}
                placeholder="Choose Request Date"
                showIcon
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="loan_submittion_date">Submittion Date</label>
              <Calendar
                inputId="loan_submittion_date"
                name="loan_submittion_date"
                value={loanRecord.loan_submittion_date}
                onChange={onChangeHandler}
                placeholder="Choose Submittion Date"
                showIcon
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="loan_insurance_person">Insurance Person</label>
              <InputText
                id="loan_insurance_person"
                name="loan_insurance_person"
                value={loanRecord.loan_insurance_person}
                onChange={onChangeHandler}
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="loan_issued_person">Issued Person</label>
              <InputText
                id="loan_issued_person"
                name="loan_issued_person"
                value={loanRecord.loan_issued_person}
                onChange={onChangeHandler}
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="repayment_start_date">Repayment Start Date</label>
              <Calendar
                inputId="repayment_start_date"
                name="repayment_start_date"
                value={loanRecord.repayment_start_date}
                showIcon
                placeholder="Choose start date"
                onChange={onChangeHandler}
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="repayment_end_date">Repayment End Date</label>
              <Calendar
                inputId="repayment_end_date"
                name="repayment_end_date"
                value={loanRecord.repayment_end_date}
                minDate={loanRecord.repayment_start_date}
                showIcon
                placeholder="Choose end date"
                onChange={onChangeHandler}
              />
            </div>

            <div className="field col-12">
              <label htmlFor="loan_submited_detail">Submited Detail</label>
              <InputTextarea
                id="loan_submited_detail"
                name="loan_submited_detail"
                value={loanRecord.loan_submited_detail}
                onChange={onChangeHandler}
                required
                rows={5}
                cols={30}
                autoResize
              />
            </div>

            <div className="field col-12 flex justify-content-end">
              <Button type="submit" label="Submit" className="w-auto" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLoanRecord;
