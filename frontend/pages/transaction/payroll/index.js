import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import { useRouter } from "next/router";

import { useDispatch, useSelector } from "react-redux";
import {
  create as transactionCreate,
  update as transactionUpdate,
} from "@/features/transaction/transactionSlice";
import { update as entryUpdate } from "@/features/entry/entrySlice";

import { useEmployeePayRoll, usePayRollAccountHead } from "@/hooks/usePayroll";
import { useEmployee } from "@/hooks/useEmployee";
import { useDepartment, useEmployeeDepartment } from "@/hooks/useDepartment";
import { useEmployeeRank, useRank } from "@/hooks/useRank";

import { useQueryClient } from "@tanstack/react-query";
import { Paginator } from "primereact/paginator";

import { getEmployeePayroll as apiFetch } from "@/pages/api/payroll.api";

const CreatePayRoll = () => {
  const router = useRouter();
  const [payRoll, setPayRoll] = useState({
    emp_id: "",
    emp_name: "",
    emp_rank_id: "",
    emp_rank: "",
    emp_dept_id: "",
    emp_dept: "",
    account_id: "",
    account_head: "",
    account_type: "",
    allowance_amount: 0,
    detection_amount: 0,
    transaction_start_date: undefined,
    transaction_end_date: undefined,
  });
  const [isVisible, setIsVisible] = useState(false);
  const toastRef = useRef(null);

  // redux-toolkit get Data
  const payRollList = useSelector((state) => state.transaction.payRoll);
  const payRollAccountHead = useSelector(
    (state) => state.entry.payRollAccountHead
  );
  const dispatch = useDispatch();

  // tanstack-query
  const [queryFetch, setQueryFetch] = useState({
    field: null,
    data: null,
    datas: null,
  });
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [firsts, setFirsts] = useState(0);
  const [record, setRecord] = useState(0);
  const [rows, setRows] = useState(10);

  // Employee PayRoll
  const {
    useMutationCreateEmployeePayroll,
    useMutationUpdateEmployeePayroll,
    useQueryGetEmployeePayroll,
    useMutationDeleteEmployeePayroll,
  } = useEmployeePayRoll();
  // create
  const { mutateAsync: createEmployeePayRoll } =
    useMutationCreateEmployeePayroll();
  // get
  const {
    data: getEmployeePayRoll,
    isSuccess: getEmployeePayRollSuccess,
    isPreviousData,
  } = useQueryGetEmployeePayroll(page);
  // update
  const { mutateAsync: updateEmployeePayRoll } =
    useMutationUpdateEmployeePayroll();
  // delete
  const { mutateAsync: deleteEmployeePayRoll } =
    useMutationDeleteEmployeePayroll(queryFetch.deleteId);

  // payroll account head
  const { useQueryGetPayRollAccountHead } = usePayRollAccountHead();
  const {
    data: getPayRollAccountHead,
    isSuccess: getPayRollAccountHeadSuccess,
  } = useQueryGetPayRollAccountHead();

  // employees
  const { useEmployeeProfileSingleGetQuery, useEmployeeProfileFilterGetQuery } =
    useEmployee();
  const {
    data: getEmployees,
    isSuccess: getEmployeesSuccess,
    isError: getEmployeesError,
  } = useEmployeeProfileSingleGetQuery({
    field: queryFetch.field,
    data: queryFetch.data,
  });

  const { data: getEmployeeLists, isSuccess: getEmployeeListsSuccess } =
    useEmployeeProfileFilterGetQuery({
      field: queryFetch.field,
      datas: queryFetch.datas,
    });

  // employee department
  const {
    useSingleEmployeeDepartmentGetQuery,
    useFilterEmployeeDepartmentGetQuery,
  } = useEmployeeDepartment();
  // get
  const {
    data: getEmployeeDepartment,
    isSuccess: getEmployeeDepartmentSuccess,
    isError: getEmployeeDepartmentError,
  } = useSingleEmployeeDepartmentGetQuery({ id: queryFetch.data });

  const {
    data: getEmployeeDepartmentLists,
    isSuccess: getEmployeeDepartmentListsSuccess,
  } = useFilterEmployeeDepartmentGetQuery({ ids: queryFetch.datas });

  // Department List
  const { useDepartmentGetQuery } = useDepartment();
  const { data: getDepartments, isSuccess: getDepartmentsSuccess } =
    useDepartmentGetQuery();

  // employee rank
  const { useQueryGetSingleEmployeeRank, useQueryGetFilterEmployeeRank } =
    useEmployeeRank();
  // get employee rank
  const {
    data: getEmployeeRank,
    isSuccess: getEmployeeRankSuccess,
    isError: getEmployeeRankError,
  } = useQueryGetSingleEmployeeRank({ id: queryFetch.data });
  const { data: getEmployeeRankLists, isSuccess: getEmployeeRankListsSuccess } =
    useQueryGetFilterEmployeeRank({ ids: queryFetch.datas });

  // Rank List
  const { useQueryGetRank } = useRank();
  const { data: getRanks, isSuccess: getRanksSuccess } = useQueryGetRank();

  // InputText onChange Handler
  const onChangeHandler = (e) => {
    setPayRoll((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const onAmountChangeHandler = (e) => {
    if (payRoll.account_type === true || payRoll.account_type === 1) {
      setPayRoll((prevState) => ({
        ...prevState,
        allowance_amount: e.value,
      }));
    } else {
      setPayRoll((prevState) => ({
        ...prevState,
        detection_amount: e.value,
      }));
    }
  };

  // restore default state
  const restoreDefaultState = (data) => {
    if (data) {
      setPayRoll({
        emp_id: "",
        emp_name: "",
        emp_rank_id: "",
        emp_rank: "",
        emp_dept_id: "",
        emp_dept: "",
        account_id: "",
        account_head: "",
        account_type: "",
        allowance_amount: 0,
        detection_amount: 0,
        transaction_date: undefined,
        employment_date: undefined,
        labor_registration_number: "",
        social_security_number: "",
      });
      setQueryFetch((prevState) => ({
        ...prevState,
        field: null,
        data: null,
      }));
    } else {
      setPayRoll((prevState) => ({
        ...prevState,
        emp_name: "",
        emp_rank_id: "",
        emp_rank: "",
        emp_dept_id: "",
        emp_dept: "",
      }));
      setQueryFetch((prevState) => ({
        ...prevState,
        field: null,
        data: null,
      }));
    }
  };

  // Search Handler
  const onSearchHandler = (id) => {
    setQueryFetch((prevState) => ({
      field: "id",
      data: id,
      datas: prevState.datas,
    }));
  };

  useEffect(() => {
    if (getEmployeesSuccess) {
      const employee = getEmployees.data;

      if (employee) {
        if (getEmployeeDepartmentSuccess) {
          const employeeDepartment = getEmployeeDepartment.data;

          if (employeeDepartment) {
            if (getDepartmentsSuccess) {
              const departments = getDepartments.data.find(
                (dept) => dept.dept_id === employeeDepartment.dept_id
              );

              if (departments) {
                if (getEmployeeRankSuccess) {
                  const employeeRank = getEmployeeRank.data;

                  if (employeeRank) {
                    if (getRanksSuccess) {
                      const ranks = getRanks.data.find(
                        (rank) => rank.rank_id === employeeRank.rank_id
                      );

                      setPayRoll((prevState) => ({
                        ...prevState,
                        emp_id: employee.employeeID,
                        emp_name: employee.employee_name,
                        emp_dept_id: employeeDepartment.emp_dept_id,
                        emp_dept: departments.dept_desc,
                        emp_rank_id: employeeRank.emp_rank_id,
                        emp_rank: ranks.rank_desc,
                      }));
                    }
                  }
                } else if (getEmployeeRankError) {
                  toastRef.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "This employee not set rank.",
                  });
                  restoreDefaultState();
                }
              }
            }
          }
        } else if (getEmployeeDepartmentError) {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: "This employee not set department.",
          });
          restoreDefaultState();
        }
      }
    } else if (getEmployeesError) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Employee not found.",
      });
      restoreDefaultState();
    }
  }, [
    getDepartments,
    getDepartmentsSuccess,
    getEmployeeDepartment,
    getEmployeeDepartmentError,
    getEmployeeDepartmentSuccess,
    getEmployeeRank,
    getEmployeeRankError,
    getEmployeeRankSuccess,
    getEmployees,
    getEmployeesError,
    getEmployeesSuccess,
    getRanks,
    getRanksSuccess,
  ]);

  // Submit Handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      await createEmployeePayRoll(
        {
          emp_id: payRoll.emp_id,
          emp_rank_id: payRoll.emp_rank_id,
          emp_dept_id: payRoll.emp_dept_id,
          account_id: payRoll.account_id,
          allowance_amount: payRoll.allowance_amount,
          detection_amount: payRoll.detection_amount,
          transaction_start_date: payRoll.transaction_start_date,
          transaction_end_date: payRoll.transaction_end_date,
        },
        {
          onSuccess: () => {
            dispatch(
              transactionCreate({
                stateProperty: "payRoll",
                data: {
                  ...payRoll,
                  transaction_start_date: new Date(
                    payRoll.transaction_start_date
                  ).toString(),
                  transaction_end_date: new Date(
                    payRoll.transaction_end_date
                  ).toString(),
                },
              })
            );
            restoreDefaultState("submit");
            queryClient.refetchQueries({
              queryKey: ["get", "payRoll", page],
              type: "active",
            });
          },
          onSettled: (_, error) => {
            if (error) {
              toastRef.current.show({
                severity: "error",
                summary: "Error",
                detail: "Something wrong",
              });
            } else {
              toastRef.current.show({
                severity: "success",
                summary: "Success",
                detail: "Pay roll created successfully.",
              });
            }
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Datatable edit handler
  const onEditHandler = async (e) => {
    try {
      const _payRollList = [...payRollList];
      const { newData, index } = e;

      const currentAccountHead = payRollAccountHead.find(
        (account) => account.account_head === newData.account_head
      );

      if (
        currentAccountHead.account_type === 1 ||
        currentAccountHead.account_type === true
      ) {
        _payRollList[index] = {
          ...newData,
          transaction_date: newData.transaction_date.toString(),
          account_id: currentAccountHead.account_id,
          account_head: currentAccountHead.account_head,
          account_type: currentAccountHead.account_type,
          allowance_amount: currentAccountHead.amount,
          detection_amount: 0,
        };
        await updateEmployeePayRoll(
          {
            transaction_id: newData.transaction_id,
            emp_id: newData.emp_id,
            emp_rank_id: newData.emp_rank_id,
            emp_dept_id: newData.emp_dept_id,
            account_id: currentAccountHead.account_id,
            allowance_amount: currentAccountHead.amount,
            detection_amount: 0,
            transaction_date: newData.transaction_date,
          },
          {
            onSuccess: () => {
              dispatch(
                transactionUpdate({
                  stateProperty: "payRoll",
                  data: _payRollList,
                })
              );
            },
          }
        );
      } else if (
        currentAccountHead.account_type === 0 ||
        currentAccountHead.account_type === false
      ) {
        _payRollList[index] = {
          ...newData,
          transaction_date: newData.transaction_date.toString(),
          account_id: currentAccountHead.account_id,
          account_head: currentAccountHead.account_head,
          account_type: currentAccountHead.account_type,
          allowance_amount: 0,
          detection_amount: currentAccountHead.amount,
        };
        await updateEmployeePayRoll(
          {
            transaction_id: newData.transaction_id,
            emp_id: newData.emp_id,
            emp_rank_id: newData.emp_rank_id,
            emp_dept_id: newData.emp_dept_id,
            account_id: currentAccountHead.account_id,
            allowance_amount: 0,
            detection_amount: currentAccountHead.amount,
            transaction_date: newData.transaction_date,
          },
          {
            onSuccess: () => {
              dispatch(
                transactionUpdate({
                  stateProperty: "payRoll",
                  data: _payRollList,
                })
              );
            },
          }
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const inputTextEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onChange={(e) => options.editorCallback(e.value)}
      />
    );
  };

  const dateTimeEditor = (options) => {
    return (
      <Calendar
        name={options.field}
        value={new Date(options.value)}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const accountTypeBodyTemplate = (data) => {
    return (
      <Tag
        severity={
          data.account_type === false || data.account_type === 0
            ? "danger"
            : "success"
        }
        value={
          data.account_type === false || data.account_type === 0
            ? "ဖြတ်တောက်ငွေ"
            : "ထောက်ပံ့ငွေ"
        }
      />
    );
  };

  const onClickAccountHeadHandler = (e) => {
    if (e.data.account_type === 1 || e.data.account_type === true) {
      setPayRoll((prevState) => {
        return {
          ...prevState,
          account_id: e.data.account_id,
          account_head: e.data.account_head,
          account_type: e.data.account_type,
          allowance_amount: e.data.amount,
          detection_amount: 0,
        };
      });
    } else if (e.data.account_type === 0 || e.data.account_type === false) {
      setPayRoll((prevState) => {
        return {
          ...prevState,
          account_id: e.data.account_id,
          account_head: e.data.account_head,
          account_type: e.data.account_type,
          allowance_amount: 0,
          detection_amount: e.data.amount,
        };
      });
    }
    setIsVisible(false);
  };

  const tagTemplate = (data) => {
    if (data?.account_type === false || data?.account_type === 0) {
      return (
        <div className="flex justify-content-center align-items-center">
          <Tag severity="danger" value="ဖြတ်တောက်ငွေ" />
        </div>
      );
    } else {
      return (
        <div className="flex justify-content-center align-items-center">
          <Tag severity="success" value="ထောက်ပံငွေ" />
        </div>
      );
    }
  };

  const accountTypeEditor = (options) => {
    const onClickHandler = (e) => {
      if (e.data.account_type === 1 || e.data.account_type === true) {
        options?.editorCallback(e.data.account_head);
      } else if (e.data.account_type === 0 || e.data.account_type === false) {
        options?.editorCallback(e.data.account_head);
      }
      setIsVisible(false);
    };

    return (
      <div>
        <Button
          severity="secondary"
          type="button"
          label={options.value}
          className="w-auto mr-5"
          onClick={() => setIsVisible(true)}
          text
          size="small"
        />
        <Dialog visible={isVisible} onHide={() => setIsVisible(false)}>
          <DataTable
            value={payRollAccountHead}
            onRowClick={onClickHandler}
            rowClassName="cursor-pointer hover:surface-200"
          >
            <Column field="id" header="ID" />
            <Column field="account_head" header="Account Head" />
            <Column
              field="account_type"
              header="Account Type"
              body={accountTypeBodyTemplate}
            />
            <Column field="amount" header="Acount" />
          </DataTable>
        </Dialog>
      </div>
    );
  };

  const rowDeleteHandler = async (options) => {
    try {
      await deleteEmployeePayRoll(
        { id: options.transaction_id },
        {
          onSuccess: () => {
            const currentPayroll = payRollList.filter(
              (payroll) => payroll.transaction_id !== options.transaction_id
            );
            dispatch(
              transactionUpdate({
                stateProperty: "payRoll",
                data: currentPayroll,
              })
            );
          },
          onSettled: (data, error) => {
            if (error) {
              toastRef.current.show({
                severity: "error",
                summary: "Error",
                detail: "Something Wrong!",
              });
            } else if (data) {
              toastRef.current.show({
                severity: "success",
                summary: "Success",
                detail: "This employee has been removed form pay roll list.",
              });
            }
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const rowDeleteTemplate = (options) => {
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => rowDeleteHandler(options),
    });
  };

  useEffect(() => {
    if (getPayRollAccountHeadSuccess) {
      dispatch(
        entryUpdate({
          stateProperty: "payRollAccountHead",
          data: getPayRollAccountHead.data,
        })
      );
    }
  }, [dispatch, getPayRollAccountHead, getPayRollAccountHeadSuccess]);

  useEffect(() => {
    if (
      getEmployeePayRollSuccess &&
      getRanksSuccess &&
      getDepartmentsSuccess &&
      getPayRollAccountHeadSuccess
    ) {
      let queryData = [];

      setQueryFetch((prevState) => ({
        ...prevState,
        field: "id",
        datas: queryData,
      }));

      const employeePayRoll = getEmployeePayRoll.data;
      const ranks = getRanks.data;
      const departments = getDepartments.data;
      const accounts = getPayRollAccountHead.data;

      if (getEmployeePayRoll?.count) {
        setRecord(getEmployeePayRoll.count);
      }

      const result = employeePayRoll.map((empPayRoll) => {
        queryData.push(empPayRoll.emp_id);

        if (getEmployeeListsSuccess) {
          const employee = getEmployeeLists.find(
            (emp) => emp.data.employeeID === empPayRoll.emp_id
          );

          if (employee) {
            if (getEmployeeDepartmentListsSuccess) {
              const employeeDepartment = getEmployeeDepartmentLists.find(
                (emp) => emp.data.emp_dept_id === empPayRoll.emp_dept_id
              );

              if (employeeDepartment) {
                const department = departments.find(
                  (dept) => dept.dept_id === employeeDepartment.data.dept_id
                );

                if (department) {
                  if (getEmployeeRankListsSuccess) {
                    const employeeRank = getEmployeeRankLists.find(
                      (emp) => emp.data.emp_rank_id === empPayRoll.emp_rank_id
                    );

                    if (employeeRank) {
                      const rank = ranks.find(
                        (rank) => rank.rank_id === employeeRank.data.rank_id
                      );

                      if (rank) {
                        const account = accounts.find(
                          (acc) => acc.account_id === empPayRoll.account_id
                        );

                        return {
                          transaction_id: empPayRoll.transaction_id,
                          emp_id: employee.data.employeeID,
                          emp_name: employee.data.employee_name,
                          emp_rank_id: employeeRank.data.emp_rank_id,
                          emp_rank: rank.rank_desc,
                          emp_dept_id: employeeDepartment.data.emp_dept_id,
                          emp_dept: department.dept_desc,
                          account_id: account.account_id,
                          account_head: account.account_head,
                          account_type: account.account_type,
                          allowance_amount: empPayRoll.allowance_amount,
                          detection_amount: empPayRoll.detection_amount,
                          transaction_start_date: new Date(
                            empPayRoll.transaction_start_date
                          ).toString(),
                          transaction_end_date: new Date(
                            empPayRoll.transaction_end_date
                          ).toString(),
                        };
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      dispatch(transactionUpdate({ stateProperty: "payRoll", data: result }));
    }
  }, [
    dispatch,
    getDepartments,
    getDepartmentsSuccess,
    getEmployeeDepartmentLists,
    getEmployeeDepartmentListsSuccess,
    getEmployeeLists,
    getEmployeeListsSuccess,
    getEmployeePayRoll,
    getEmployeePayRollSuccess,
    getEmployeeRankLists,
    getEmployeeRankListsSuccess,
    getPayRollAccountHead,
    getPayRollAccountHeadSuccess,
    getRanks,
    getRanksSuccess,
  ]);

  useEffect(() => {
    if (!isPreviousData) {
      queryClient.prefetchQuery({
        queryKey: ["get", "payRoll", page],
        queryFn: () => apiFetch({ page }),
      });
    }
  }, [getEmployeePayRoll, isPreviousData, page, queryClient]);

  return (
    <div className="flex-1">
      <Toast ref={toastRef} />
      <ConfirmDialog />
      <div className="flex gap-5">
        <Button
          icon="pi pi-arrow-left"
          rounded
          raised
          onClick={() => router.back()}
        />

        <div className="h-full">
          <h1 className="text-3xl underline">Pay Roll</h1>
        </div>
      </div>
      <div className="card mt-6">
        <form className="col-12" onSubmit={onSubmitHandler}>
          <div className="p-fluid form-grid grid">
            <div className="field col-12 md:col-6">
              <label htmlFor="transaction_start_date">
                Transaction Start Date
              </label>
              <Calendar
                inputId="transaction_start_date"
                name="transaction_start_date"
                value={payRoll.transaction_start_date}
                onChange={onChangeHandler}
                showIcon
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="transaction_end_date">Transaction End Date</label>

              <Calendar
                inputId="transaction_end_date"
                name="transaction_end_date"
                value={payRoll.transaction_end_date}
                onChange={onChangeHandler}
                minDate={payRoll.transaction_start_date}
                showIcon
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="emp_id">ID</label>
              <div className="p-inputgroup">
                <InputText
                  id="emp_id"
                  name="emp_id"
                  type="search"
                  value={payRoll.emp_id}
                  onChange={onChangeHandler}
                  required
                />
                <Button
                  label="Search"
                  type="button"
                  onClick={() => onSearchHandler(payRoll.emp_id)}
                />
              </div>
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="emp_name">Name</label>
              <InputText
                id="emp_name"
                name="emp_name"
                type="text"
                value={payRoll.emp_name}
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
                value={payRoll.emp_rank}
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
                value={payRoll.emp_dept}
                onChange={onChangeHandler}
                required
              />
            </div>

            <div className="form-grid grid col-12 mx-auto card">
              <div className="field col-12 flex align-items-center">
                <Button
                  type="button"
                  label="Show Account Head List"
                  className="w-auto mr-5"
                  onClick={() => setIsVisible(true)}
                />

                <Dialog visible={isVisible} onHide={() => setIsVisible(false)}>
                  <DataTable
                    value={payRollAccountHead}
                    onRowClick={onClickAccountHeadHandler}
                    rowClassName="cursor-pointer hover:surface-200"
                    scrollable
                    scrollHeight="400px"
                  >
                    <Column field="account_id" header="ID" />
                    <Column field="account_head" header="Account Head" />
                    <Column
                      field="account_type"
                      header="Account Type"
                      body={accountTypeBodyTemplate}
                    />
                    <Column field="amount" header="Acount" />
                  </DataTable>
                </Dialog>
              </div>

              <div className="field col-12 md:col-6">
                <div className="flex justify-content-between pr-2">
                  <label htmlFor="account_head">Account Head</label>

                  <Tag
                    severity={
                      payRoll.account_type === false ||
                      payRoll.account_type === 0
                        ? "danger"
                        : "success"
                    }
                    value={
                      payRoll.account_type === false ||
                      payRoll.account_type === 0
                        ? "ဖြတ်တောက်ငွေ"
                        : "ထောက်ပံ့ငွေ"
                    }
                  />
                </div>

                <InputText
                  id="account_head"
                  name="account_head"
                  value={payRoll.account_head}
                  readOnly
                  required
                />
              </div>

              <div className="field col-12 md:col-6">
                <label htmlFor="amount">Amount</label>
                <InputNumber
                  inputId="amount"
                  name={
                    payRoll.account_type === true || payRoll.account_type === 1
                      ? "allowance_amount"
                      : "detection_amount"
                  }
                  value={
                    payRoll.account_type === true || payRoll.account_type === 1
                      ? payRoll.allowance_amount
                      : payRoll.detection_amount
                  }
                  onChange={onAmountChangeHandler}
                  required
                />
              </div>
            </div>

            <div className="field col-12 flex justify-content-end">
              <Button type="submit" label="Submit" className="w-auto" />
            </div>
          </div>
        </form>

        <div className="col-12 mt-5">
          <DataTable
            value={payRollList}
            editMode="row"
            rows={rows}
            removableSort
            showGridlines
            onRowEditComplete={onEditHandler}
            scrollable
            tableStyle={{ minWidth: "90rem" }}
          >
            <Column field="emp_id" header="Employee ID" sortable />
            <Column field="emp_name" header="Employee Name" sortable />
            <Column
              field="account_head"
              header="Account Head"
              sortable
              editor={accountTypeEditor}
            />
            <Column
              field="account_type"
              header="Account Type"
              body={tagTemplate}
            />
            <Column
              field="allowance_amount"
              header="Allowance Amount"
              body={(options) => `${options?.allowance_amount} Ks`}
              editor={(options) => inputTextEditor(options)}
              sortable
            />
            <Column
              field="detection_amount"
              header="Detection Amount"
              body={(options) => `${options?.detection_amount} Ks`}
              editor={(options) => inputTextEditor(options)}
              sortable
            />
            <Column
              field="transaction_start_date"
              header="Transaction Start Date"
              body={(options) =>
                new Date(options?.transaction_start_date)
                  .toString()
                  .substring(0, 15)
              }
              editor={(options) => dateTimeEditor(options)}
            />
            <Column
              field="transaction_end_date"
              header="Transaction End Date"
              body={(options) =>
                new Date(options?.transaction_end_date)
                  .toString()
                  .substring(0, 15)
              }
              editor={(options) => dateTimeEditor(options)}
            />
            {/* <Column rowEditor /> */}
            <Column
              frozen={true}
              alignFrozen="right"
              body={(options) => (
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  size="small"
                  rounded
                  onClick={() => rowDeleteTemplate(options)}
                />
              )}
            />
          </DataTable>
          <Paginator
            first={firsts}
            rows={rows}
            totalRecords={record}
            onPageChange={(e) => {
              setFirsts(e.first);
              setRows(e.rows);
              setPage(e.page);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreatePayRoll;
