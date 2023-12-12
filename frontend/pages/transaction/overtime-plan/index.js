import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";

import { useRouter } from "next/router";

import { useDispatch, useSelector } from "react-redux";
import { create as transactionCreate } from "@/features/transaction/transactionSlice";
import { update as entryUpdate } from "@/features/entry/entrySlice";

import { useOTShiftType } from "@/hooks/useOvertime";
import { useEmployee } from "@/hooks/useEmployee";
import { useDepartment, useEmployeeDepartment } from "@/hooks/useDepartment";
import { useEmployeeRank, useRank } from "@/hooks/useRank";
import { useEmployeeOvertimePlan } from "@/hooks/useOvertime";

const CreateOvertimePlan = () => {
  const router = useRouter();
  const [overtimePlan, setOvertimePlan] = useState({
    shift_id: "",
    shift_group_name: "",
    start_date: undefined,
    end_date: undefined,
    start_time: undefined,
    end_time: undefined,
    emp_id: "",
    emp_name: "",
    emp_rank_id: "",
    emp_rank: "",
    emp_dept_id: "",
    emp_dept: "",
    plan_date: undefined,
    substituted: false,
    remark: "",
  });
  const [dropdownValue, setDropdownValue] = useState();
  const toastRef = useRef(null);

  // redux-toolkit
  const overtimeShiftType = useSelector(
    (state) => state.entry.overtimeShiftType,
  );
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

  // Overtime Shift Type
  const { useQueryGetOTShiftType } = useOTShiftType();
  const { data: getOTShiftType, isSuccess: getOTShiftTypeSuccess } =
    useQueryGetOTShiftType();

  // Overtime Plan
  const {
    useMutationCreateEmployeeOvertimePlan,
    useQueryGetEmployeeOvertimePlan,
  } = useEmployeeOvertimePlan();
  // create
  const { mutateAsync: createOvertimePlan } =
    useMutationCreateEmployeeOvertimePlan();
  // get
  const { data: getOvertimePlan, isSuccess: getOvertimePlanSuccess } =
    useQueryGetEmployeeOvertimePlan(0);

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

  // Department List
  const { useDepartmentGetQuery } = useDepartment();
  const { data: getDepartmentList, isSuccess: getDepartmentListSuccess } =
    useDepartmentGetQuery();

  // employee department
  const { useSingleEmployeeDepartmentGetQuery } = useEmployeeDepartment();
  // get
  const {
    data: getEmployeeDepartment,
    isSuccess: getEmployeeDepartmentSuccess,
    isError: getEmployeeDepartmentError,
  } = useSingleEmployeeDepartmentGetQuery({ id: queryFetch.data });

  // Rank List
  const { useQueryGetRank } = useRank();
  const { data: getRankList, isSuccess: getRankListSuccess } =
    useQueryGetRank();

  // employee rank
  const { useQueryGetSingleEmployeeRank } = useEmployeeRank();
  // get employee rank
  const {
    data: getEmployeeRank,
    isSuccess: getEmployeeRankSuccess,
    isError: getEmployeeRankError,
  } = useQueryGetSingleEmployeeRank({ id: queryFetch.data });

  // InputText onChange Handler
  const onChangeHandler = (e) => {
    setOvertimePlan((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  // Dropdown onChange handler
  const onChangeDropdownHandler = (e) => {
    setOvertimePlan((prevState) => ({
      ...prevState,
      shift_group_name: e.value.shift_group_name,
      shift_id: e.value.rid,
      start_date: e.value.start_date,
      end_date: e.value.end_date,
      start_time: e.value.start_time,
      end_time: e.value.end_time,
    }));
    setDropdownValue(e.value);
  };

  // restore default state
  const restoreDefaultState = (data) => {
    if (data) {
      setOvertimePlan({
        shift_id: "",
        shift_group_name: "",
        start_date: undefined,
        end_date: undefined,
        start_time: undefined,
        end_time: undefined,
        emp_id: "",
        emp_name: "",
        emp_rank_id: "",
        emp_rank: "",
        emp_dept_id: "",
        emp_dept: "",
        plan_date: undefined,
        substituted: false,
        remark: "",
      });
      setQueryFetch((prevState) => ({
        ...prevState,
        field: null,
        data: null,
      }));
      setDropdownValue(null);
    } else {
      setOvertimePlan((prevState) => ({
        ...prevState,
        emp_name: "",
        emp_rank_id: "",
        emp_rank: "",
        emp_dept_id: "",
        emp_dept: "",
        plan_date: undefined,
        substituted: false,
        remark: "",
      }));
      setQueryFetch((prevState) => ({
        ...prevState,
        field: null,
        data: null,
      }));
    }
  };

  // search handler
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
                (dept) => dept.dept_id === employeeDepartment.dept_id,
              );

              if (department) {
                if (getEmployeeRankSuccess) {
                  const employeeRank = getEmployeeRank.data;

                  if (employeeRank) {
                    if (getRankListSuccess) {
                      const rank = getRankList.data.find(
                        (rank) => rank.rank_id === employeeRank.rank_id,
                      );

                      setOvertimePlan((prevState) => ({
                        ...prevState,
                        emp_name: employee.employee_name,
                        emp_dept_id: employeeDepartment.emp_dept_id,
                        emp_dept: department.dept_desc,
                        emp_rank_id: employeeRank.emp_rank_id,
                        emp_rank: rank.rank_desc,
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

  // Submit Handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      await createOvertimePlan(
        {
          rid: record + 1 || 1,
          shift_type_id: overtimePlan.shift_id,
          emp_id: overtimePlan.emp_id,
          emp_rank_id: overtimePlan.emp_rank_id,
          emp_dept_id: overtimePlan.emp_dept_id,
          plan_date: overtimePlan.plan_date,
          substituted: overtimePlan.substituted,
          remark: overtimePlan.remark,
        },
        {
          onSuccess: () => {
            setRecord((prevState) => prevState + 1);
            dispatch(
              transactionCreate({
                stateProperty: "overtimePlan",
                data: {
                  rid: record + 1 || 1,
                  ...overtimePlan,
                  start_date: overtimePlan.start_date.toString(),
                  end_date: overtimePlan.end_date.toString(),
                  start_time: overtimePlan.start_time.toString(),
                  end_time: overtimePlan.end_time.toString(),
                  plan_date: overtimePlan.plan_date.toString(),
                },
              }),
            );
            // restore default state
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
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (getOTShiftTypeSuccess) {
      dispatch(
        entryUpdate({
          stateProperty: "overtimeShiftType",
          data: getOTShiftType.data,
        }),
      );
    }
  }, [dispatch, getOTShiftTypeSuccess, getOTShiftType]);

  useEffect(() => {
    if (getOvertimePlanSuccess) {
      setRecord(getOvertimePlan?.count);
    }
  }, [getOvertimePlan, getOvertimePlanSuccess]);

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
          <h1 className="text-3xl underline">Overtime Plan</h1>
        </div>
      </div>
      <div className="card mt-6">
        <form className="col-12" onSubmit={onSubmitHandler}>
          <div className="p-fluid form-grid grid">
            <div className="field col-12 md:col-6">
              <label htmlFor="shift_type">Shift Type</label>
              <Dropdown
                inputId="shift_type"
                name="shift_type"
                value={dropdownValue}
                onChange={onChangeDropdownHandler}
                options={overtimeShiftType}
                optionLabel="shift_group_name"
                placeholder="Choose"
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="start_date">Start Date</label>
              <Calendar
                inputId="start_date"
                name="start_date"
                value={new Date(overtimePlan.start_date)}
                onChange={onChangeHandler}
                placeholder="Start Date"
                showIcon
                disabled
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="end_date">End Date</label>
              <Calendar
                inputId="end_date"
                name="end_date"
                value={new Date(overtimePlan.end_date)}
                onChange={onChangeHandler}
                placeholder="End Date"
                showIcon
                disabled
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="start_time">Start Time</label>
              <Calendar
                inputId="start_time"
                name="start_time"
                value={new Date(overtimePlan.start_time)}
                onChange={onChangeHandler}
                placeholder="Start Time"
                timeOnly
                showIcon
                disabled
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="loan_request_date">End Time</label>
              <Calendar
                inputId="loan_request_date"
                name="loan_request_date"
                value={new Date(overtimePlan.end_time)}
                onChange={onChangeHandler}
                placeholder="End Time"
                timeOnly
                showIcon
                disabled
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="emp_id">ID</label>
              <div className="p-inputgroup">
                <InputText
                  id="emp_id"
                  name="emp_id"
                  value={overtimePlan.emp_id}
                  type="search"
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
                  onClick={() => onSearchHandler(overtimePlan.emp_id)}
                />
              </div>
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="emp_name">Name</label>
              <InputText
                id="emp_name"
                name="emp_name"
                value={overtimePlan.emp_name}
                type="text"
                onChange={onChangeHandler}
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="emp_rank">Rank</label>
              <InputText
                id="emp_rank"
                name="emp_rank"
                value={overtimePlan.emp_rank}
                type="text"
                onChange={onChangeHandler}
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="emp_dept">Department</label>
              <InputText
                id="emp_dept"
                name="emp_dept"
                value={overtimePlan.emp_dept}
                type="text"
                onChange={onChangeHandler}
                required
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="plan_date">Plan Date</label>
              <Calendar
                inputId="plan_date"
                name="plan_date"
                value={overtimePlan.plan_date}
                onChange={onChangeHandler}
                placeholder="Plan Date"
                showIcon
                required
              />
            </div>

            <div className="field col-12">
              <div className="flex align-items-center">
                <Checkbox
                  inputId="substituted"
                  name="substituted"
                  value={overtimePlan.substituted}
                  checked={overtimePlan.substituted}
                  onChange={(e) => {
                    setOvertimePlan((prevState) => {
                      return { ...prevState, substituted: e.checked };
                    });
                  }}
                />
                <label htmlFor="substituted" className="ml-3">
                  Substituted
                </label>
              </div>
            </div>

            <div className="field col-12">
              <label htmlFor="remark">Remark</label>
              <InputTextarea
                id="remark"
                name="remark"
                value={overtimePlan.remark}
                onChange={onChangeHandler}
                autoResize
                rows={5}
                cols={20}
                required
              />
            </div>

            <div className="field col-12 flex justify-content-end">
              <Button type="submit" label="Submit" className="w-auto mx-3" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOvertimePlan;
