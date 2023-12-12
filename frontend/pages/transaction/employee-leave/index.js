import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";

import { useRouter } from "next/router";

import { useDispatch, useSelector } from "react-redux";
import { create as transactionCreate } from "@/features/transaction/transactionSlice";
import { update as entryUpdate } from "@/features/entry/entrySlice";

import { useEmployeeRank, useRank } from "@/hooks/useRank";
import { useDepartment, useEmployeeDepartment } from "@/hooks/useDepartment";
import { useEmployee } from "@/hooks/useEmployee";
import { useLeaveType, useEmployeeLeave } from "@/hooks/useLeave";

const CreateEmployeeLeave = () => {
  const router = useRouter();
  const [employeeLeave, setEmployeeLeave] = useState({
    emp_id: "",
    emp_name: "",
    emp_rank_id: "",
    emp_rank: "",
    emp_dept_id: "",
    emp_dept: "",
    lev_id: "",
    lev_type: "",
    total_leave_days: 0,
    leave_detail: "",
    leave_start_date: undefined,
    leave_end_date: undefined,
    approved_person: "",
    approved_date: "",
  });
  const [dropdownValue, setDropdownValue] = useState();
  const toastRef = useRef(null);

  // redux-toolkit get Data
  const leave = useSelector((state) => state.entry.leaveType);
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

  // department list
  const { useDepartmentGetQuery } = useDepartment();
  const { data: getDepartment, isSuccess: getDepartmentSuccess } =
    useDepartmentGetQuery();

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

  // get rank type
  const { useQueryGetRank } = useRank();
  const { data: getRankType, isSuccess: getRankTypeSuccess } =
    useQueryGetRank();

  // employee rank
  const { useQueryGetSingleEmployeeRank } = useEmployeeRank();
  // get employee rank
  const {
    data: getEmployeeRank,
    isSuccess: getEmployeeRankSuccess,
    isError: getEmployeeRankError,
  } = useQueryGetSingleEmployeeRank({ id: queryFetch.data });

  // employee department
  const { useSingleEmployeeDepartmentGetQuery } = useEmployeeDepartment();
  // get
  const {
    data: getEmployeeDepartment,
    isSuccess: getEmployeeDepartmentSuccess,
    isError: getEmployeeDepartmentError,
  } = useSingleEmployeeDepartmentGetQuery({ id: queryFetch.data });

  // leave type
  const { useQueryGetLeaveType } = useLeaveType();
  const { data: getLeaveType, isSuccess: getLeaveTypeSuccess } =
    useQueryGetLeaveType();

  // employee leave
  const { useMutationCreateEmployeeLeave, useQueryGetEmployeeLeave } =
    useEmployeeLeave();
  // create
  const { mutateAsync: createEmployeeLeave } = useMutationCreateEmployeeLeave();
  // get
  const { data: getEmployeeLeave, isSuccess: getEmployeeLeaveSuccess } =
    useQueryGetEmployeeLeave(0);

  // InputText onChange Handler
  const onChangeHandler = (e) => {
    setEmployeeLeave((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const restoreDefaultState = (data) => {
    if (data) {
      setEmployeeLeave({
        emp_id: "",
        emp_name: "",
        emp_rank_id: "",
        emp_rank: "",
        emp_dept_id: "",
        emp_dept: "",
        lev_id: "",
        lev_type: "",
        total_leave_days: 0,
        leave_detail: "",
        leave_start_date: undefined,
        leave_end_date: undefined,
        approved_person: "",
        approved_date: "",
      });
    } else {
      setEmployeeLeave((prevState) => {
        return {
          ...prevState,
          emp_name: "",
          emp_rank_id: "",
          emp_rank: "",
          emp_dept_id: "",
          emp_dept: "",
          leave: null,
          total_leave_days: 0,
          leave_detail: "",
          leave_start_date: undefined,
          leave_end_date: undefined,
          approved_person: "",
          approved_date: "",
        };
      });
    }
  };

  // Search evaluation
  const onSearchHandler = (id) => {
    setQueryFetch((prevState) => ({ ...prevState, field: "id", data: id }));

    if (getEmployeesSuccess) {
      const employee = getEmployees.data;

      if (employee) {
        if (getEmployeeDepartmentSuccess) {
          const employeeDepartment = getEmployeeDepartment.data;

          if (employeeDepartment) {
            if (getDepartmentSuccess) {
              const department = getDepartment.data.find(
                (dept) => dept.dept_id === employeeDepartment.dept_id
              );

              if (getEmployeeRankSuccess) {
                const employeeRank = getEmployeeRank.data;

                if (employeeRank) {
                  if (getRankTypeSuccess) {
                    const rank = getRankType.data.find(
                      (rankType) => rankType.rank_id === employeeRank.rank_id
                    );

                    setEmployeeLeave((prevState) => {
                      return {
                        ...prevState,
                        emp_name: employee.employee_name,
                        emp_rank_id: employeeRank.emp_rank_id,
                        emp_rank: rank.rank_desc,
                        emp_dept_id: employeeDepartment.emp_dept_id,
                        emp_dept: department.dept_desc,
                      };
                    });
                  }
                }
              } else if (getEmployeeRankError) {
                toastRef.current.show({
                  severity: "error",
                  summary: "Error",
                  detail: "This employee was not set rank.",
                });
                // restore default State
                restoreDefaultState();
              }
            }
          }
        } else if (getEmployeeDepartmentError) {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: "This employee was not set department.",
          });
          // restore Default State
          restoreDefaultState();
        }
      }
    } else if (getEmployeesError) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Employee not found.",
      });
      // restore Default State
      restoreDefaultState();
    }
  };

  // Dropdown onChange handler
  const onChangeDropdownHandler = (e) => {
    setEmployeeLeave((prevState) => {
      return {
        ...prevState,
        lev_id: e.value.lev_id,
        lev_type: e.value.lev_type,
      };
    });
    setDropdownValue(e.value);
  };

  // Submit Handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      await createEmployeeLeave(
        {
          rid: record + 1 || 1,
          emp_id: employeeLeave.emp_id,
          emp_rank_id: employeeLeave.emp_rank_id,
          emp_dept_id: employeeLeave.emp_dept_id,
          lev_id: employeeLeave.lev_id,
          leave_detail: employeeLeave.leave_detail,
          total_leave_days: employeeLeave.total_leave_days,
          leave_start_date: employeeLeave.leave_start_date,
          leave_end_date: employeeLeave.leave_end_date,
          approved_person: employeeLeave.approved_person,
          approved_date: employeeLeave.approved_date,
        },
        {
          onSuccess: () => {
            setRecord((prevState) => prevState + 1);
            dispatch(
              transactionCreate({
                stateProperty: "employeeLeave",
                data: {
                  ...employeeLeave,
                  rid: record + 1 || 1,
                  leave_start_date: employeeLeave.leave_start_date.toString(),
                  leave_end_date: employeeLeave.leave_end_date.toString(),
                  approved_date: employeeLeave.approved_date.toString(),
                },
              })
            );

            // restore Default State
            restoreDefaultState("submit");
            setDropdownValue(null);
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
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate Date Function
  const CalcDate = (startDateTime, endDateTime) => {
    const startDate = new Date(startDateTime).getTime();
    const endDate = new Date(endDateTime).getTime();
    return Math.abs((startDate - endDate) / (1000 * 3600 * 24));
  };

  // Calculate total date
  useEffect(() => {
    if (employeeLeave.leave_start_date && employeeLeave.leave_end_date) {
      setEmployeeLeave((prevState) => {
        const durationDate = CalcDate(
          employeeLeave.leave_start_date,
          employeeLeave.leave_end_date
        );
        return { ...prevState, total_leave_days: durationDate };
      });
    }
  }, [employeeLeave.leave_start_date, employeeLeave.leave_end_date]);

  // leave type
  useEffect(() => {
    if (getLeaveTypeSuccess) {
      dispatch(
        entryUpdate({ stateProperty: "leaveType", data: getLeaveType.data })
      );
    }
  }, [dispatch, getLeaveType, getLeaveTypeSuccess]);

  useEffect(() => {
    if (getEmployeeLeaveSuccess) {
      setRecord(getEmployeeLeave?.count);
    }
  }, [getEmployeeLeaveSuccess, getEmployeeLeave]);

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
          <h1 className="text-3xl underline">Employee Leave</h1>
        </div>
      </div>
      <div className="card mt-6">
        <form className="col-12" onSubmit={onSubmitHandler}>
          <div className="p-fluid form-grid grid">
            <div className="field col-12">
              <div className="p-inputgroup col-12 md:col-6">
                <label htmlFor="emp_id" className="p-inputgroup-addon">
                  ID
                </label>
                <InputText
                  id="emp_id"
                  name="emp_id"
                  type="search"
                  value={employeeLeave.emp_id}
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
                  onClick={() => onSearchHandler(employeeLeave.emp_id)}
                />
              </div>
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="emp_name">Name</label>
              <InputText
                id="emp_name"
                name="emp_name"
                type="text"
                value={employeeLeave.emp_name}
                onChange={onChangeHandler}
                readOnly
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="emp_rank">Rank</label>
              <InputText
                id="emp_rank"
                name="emp_rank"
                type="text"
                value={employeeLeave.emp_rank}
                onChange={onChangeHandler}
                readOnly
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="emp_dept">Department</label>
              <InputText
                id="emp_dept"
                name="emp_dept"
                type="text"
                value={employeeLeave.emp_dept}
                onChange={onChangeHandler}
                required
                readOnly
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="leave">Leave Type</label>
              <Dropdown
                inputId="leave"
                name="leave"
                value={dropdownValue}
                onChange={onChangeDropdownHandler}
                options={leave}
                optionLabel="lev_type"
                placeholder="Choose Leave Type"
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="total_leave_days">Total Leave Day</label>
              <InputNumber
                inputId="total_leave_days"
                name="total_leave_days"
                value={employeeLeave.total_leave_days}
                readOnly
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="leave_detail">Leave Details</label>
              <InputText
                id="leave_detail"
                name="leave_detail"
                value={employeeLeave.leave_detail}
                onChange={onChangeHandler}
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="leave_start_date">Start Date</label>
              <Calendar
                inputId="leave_start_date"
                name="leave_start_date"
                value={employeeLeave.leave_start_date}
                onChange={onChangeHandler}
                placeholder="Choose Assign Date"
                showIcon
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="leave_end_date">End Date</label>
              <Calendar
                inputId="leave_end_date"
                name="leave_end_date"
                value={employeeLeave.leave_end_date}
                onChange={onChangeHandler}
                placeholder="Choose Register Date"
                minDate={employeeLeave.leave_start_date}
                showIcon
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="approved_person">Approved Person</label>
              <InputText
                id="approved_person"
                name="approved_person"
                value={employeeLeave.approved_person}
                onChange={onChangeHandler}
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="approved_date">Approved Date</label>
              <Calendar
                inputId="approved_date"
                name="approved_date"
                value={employeeLeave.approved_date}
                showIcon
                placeholder="Choose Approved Date"
                onChange={onChangeHandler}
                required
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

export default CreateEmployeeLeave;
