import React, { useState, useEffect, useRef } from "react";

import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { update } from "@/features/transaction/transactionSlice";
import { update as entryUpdate } from "@/features/entry/entrySlice";

import { useEmployeeInsurance,useInsuranceType } from "@/hooks/useInsurance";
import { useLeaveType,useEmployeeLeave } from "@/hooks/useLeave";

import { useDepartment, useEmployeeDepartment } from "@/hooks/useDepartment";
import { useEmployeeRank, useRank } from "@/hooks/useRank";

import { useEmployee } from "@/hooks/useEmployee";

import { isError, useQueryClient } from "@tanstack/react-query";
import { getEmployeeInsurance } from "@/pages/api/insurance.api";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";


const LeaveReport = () => 
  {
    
    const router = useRouter();
    const toastRef = useRef(null);
    const searchFilterValue = [
      { name: "Employee ID", code: "id" },
    ];
    
    const [filterDropdown, setFilterDropdown] = useState(searchFilterValue[0]);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [page, setPage] = useState(0);

    // for employeee
    const { useEmployeeProfileFilterGetQuery, useEmployeeProfileSingleGetQuery } =
    useEmployee();

    //get rank type
    const { useQueryGetRank } = useRank();
    const { data: getRankType, isSuccess: getRankTypeSuccess } = useQueryGetRank();

    // const {useInsurance}
    const {useInsuranceTypeGetQuery} = useInsuranceType();
    const {data: getInsuranceType, isSuccess: getInsuranceTypeSuccess} = useInsuranceTypeGetQuery();

      // get department type
    const { useDepartmentGetQuery } = useDepartment();
    const { data: getDepartmentLists, isSuccess: getDepartmentListsSuccess } = useDepartmentGetQuery();
    
    // get insurance type
    const [queryFetch, setQueryFetch] = useState({
      field: null,
      data: null,
      datas: [],
      empData: null,
    });

    const [firsts, setFirsts] = useState(0);
    const [rows, setRows] = useState(10);

    const { data: getSingleEmployee, isSuccess: getSingleEmployeeSuccess , isError :getSingleEmployeeError } =
    useEmployeeProfileSingleGetQuery({
      field: queryFetch.field,
      data: queryFetch.data,
    });

    const { data: getEmployeeList, isSuccess: getEmployeeListSuccess } =
    useEmployeeProfileFilterGetQuery({
      field: queryFetch.field,
      datas: queryFetch.datas,
    });


    const {
      useMutationCreateEmployeeLeave,
      useQueryGetEmployeeLeave,
      useMutationUpdateEmployeeLeave,
      useQueryGetSingleEmployeeLeave,
    } 
    = useEmployeeLeave(); 


    const {
      useMutationCreateLeaveType,
      useQueryGetLeaveType,
      useMutationUpdateLeaveType,
    } = useLeaveType();

    const { data: getLeaveType, isSuccess: getLeaveTypeSuccess } = useQueryGetLeaveType();

    const {
      data: getEmployeeLeave,
      isSuccess: getEmployeeLeaveSuccess,
      isPreviousData,
      refetch,
      isFetched,
    } = useQueryGetEmployeeLeave(page);

    const {
      data: getSingleEmployeeLeave,
      isSuccess: getSingleEmployeeLeaveSuccess,
      isError : getSingleEmployeeLeaveError,
    } = useQueryGetSingleEmployeeLeave(queryFetch.empData )

    // const { data: getEmployeeLeave, isSuccess: getEmployeeLeaveSuccess } = useQueryGetEmployeeLeave();

    // rank type 
    const {
      useMutationUpdateEmployeeRank,
      useQueryGetEmployeeRank,
      useQueryGetSingleEmployeeRank,
    } 
    = useEmployeeRank();
  
    // get evaluation rank
    const [searchAll, setSearchAll] = useState("filter");

    const 
    {
      data: getEmployeeRanks,
      isSuccess: getEmployeeRanksSuccess,
      isPreviousRankData,
      refetchRank,
      isFetchedRank,
    } 
    = useQueryGetEmployeeRank({ filter: searchAll, page });
  
// useEmployeeProfileUpdateMutation

    const onSearchFilter = (id) => {

      setQueryFetch(
        (prevState) =>
          ({
            ...prevState,
            data: id,
            empData: id,
          }) || prevState
      );
  
      if (
        getSingleEmployeeSuccess
         &&
         getSingleEmployeeLeaveSuccess
          &&
        getDepartmentListsSuccess
      ) {
  

        const { data: employee } = getSingleEmployee;
        
        const { data: singleEmployeeLeave } = getSingleEmployeeLeave;
  
        const rank = getRankType.data.find(
          (rank) => rank.rank_id === singleEmployeeLeave.emp_rank_id,
        );

        const department = getDepartmentLists.data.find(
          (dept) => dept.dept_id === singleEmployeeLeave?.emp_dept_id,
        );

        const leaveType = getLeaveType.data.find((lt) => lt.lev_id === singleEmployeeLeave.lev_id);

        // const department = getDepartment.data.find(
        //   (dept) => dept.dept_id === employeeDepartment.dept_id
        // );
  
        dispatch(
          update({
            stateProperty: "employeeLeave",
            data: [
              {
                rid:singleEmployeeLeave.rid,
                emp_id :employee.employee_name,
                emp_rank_id : rank?.rank_desc,
                emp_dept_id:department?.dept_desc,
                lev_id : leaveType.lev_type,
                total_leave_days:singleEmployeeLeave.total_leave_days,
                leave_detail:singleEmployeeLeave.leave_detail,
                leave_start_date : singleEmployeeLeave.leave_start_date,
                leave_end_date : singleEmployeeLeave.leave_end_date,
                approved_person : singleEmployeeLeave.approved_person,
                approved_date : singleEmployeeLeave.approved_date
              },
            ],
          })
        );
  
      } 
      else if (getSingleEmployeeError || getSingleEmployeeLeaveError) {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "This employee not set department.",
        });
      }



    };


    const 
    {
      data: getSingleEmployeeRank,
      isSuccess: getSingleEmployeeRankSuccess,
      isError: getSingleEmployeeRankError,
    } 
    = useQueryGetSingleEmployeeRank({ id: queryFetch.data });

    const dispatch = useDispatch();
    const [record, setRecord] = useState(0);


    useEffect(() => 
    {
      if(
          getEmployeeLeaveSuccess &&
          globalFilterValue === ""
        )
      {

          let queryData = [];
          setQueryFetch(
            (prevState) =>
              ({
                ...prevState,
                field: "id",
                datas: queryData,
              }) || prevState,
          );

          
          const getEmployeeLeaveData = getEmployeeLeave.data;
          
          if(getEmployeeLeave?.count)
          {
              setRecord(getEmployeeLeave.count);
          }

          if(getEmployeeLeaveData){

              const result = getEmployeeLeaveData.map((ie) => 
              {
                  queryData.push(ie.emp_id);   

                  if(getRankTypeSuccess && getEmployeeListSuccess && getInsuranceTypeSuccess)
                  {

                    const employee = getEmployeeList.find(
                      (emp) => emp.data.employeeID === parseInt(ie.emp_id),
                    );

                    const rank = getRankType.data.find(
                      (rank) => rank.rank_id === ie.emp_rank_id,
                    );

                    const department = getDepartmentLists.data.find(
                      (dept) => dept.dept_id === ie?.emp_dept_id,
                    );

                    const leaveType = getLeaveType.data.find((lt) => lt.lev_id === ie.lev_id);
                      
                    if(employee && rank && department)
                    {
                        return {
                          rid:ie.rid,
                          emp_id :employee.data.employee_name,
                          emp_rank_id : rank?.rank_desc,
                          emp_dept_id:department?.dept_desc,
                          lev_id : leaveType.lev_type,
                          total_leave_days:ie.total_leave_days,
                          leave_detail:ie.leave_detail,
                          leave_start_date : ie.leave_start_date,
                          leave_end_date : ie.leave_end_date,
                          approved_person : ie.approved_person,
                          approved_date : ie.approved_date
                        }
                    }

                  }
                    
              })
              
              dispatch(
                update({
                  stateProperty: "employeeLeave",
                  data : result,
                }),
              );

          }
        }
    },[
      getEmployeeList,
      getEmployeeLeaveSuccess,
      dispatch,
      globalFilterValue
      // insuranceEmployee,
      // insuranceEmployeeSuccess,
    ]);

    const employeeLeaveList = useSelector(
      (state) => state.transaction.employeeLeave,
    ); 

    const clearFilter = () => {
      setGlobalFilterValue("");
      refetch().catch((err) => console.log(err));
    };

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);

        setQueryFetch(
          (prevState) =>
            ({
              ...prevState,
              field: filterDropdown.code,
              data: e.target.value,
              empData: e.target.value,
            }) || prevState
        );
    };


    useEffect(() => {
      if (getLeaveTypeSuccess) {
        if (!Array.isArray(getLeaveType.data)) {
          dispatch(
            entryUpdate({
              stateProperty: "leaveType",
              data: [getLeaveType.data],
            })
          );
        } else {
          dispatch(
            entryUpdate({
              stateProperty: "leaveType",
              data: getLeaveType.data,
            })
          );
        }
      }
    }, [dispatch, getLeaveTypeSuccess, getLeaveType]);

    
  
    // header for datatable
    const renderHeader = () => {
      return (
        <div className="flex gap-3">
          <div>
            <Dropdown
              value={filterDropdown}
              onChange={(e) => {
                setFilterDropdown(e.target.value);
                setQueryFetch(
                  (prevState) =>
                    ({
                      ...prevState,
                      field: e?.target.value.code,
                    }) || prevState
                );
              }}
              options={searchFilterValue}
              optionLabel="name"
            />
          </div>
          <div className="p-inputgroup w-20rem">
            <InputText
              type="search"
              placeholder="Search"
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
            />
  
            <Button
              label="Search"
              onClick={() => onSearchFilter(globalFilterValue)}
            />
          </div>
          <Button label="Clear" severity="danger" onClick={clearFilter} />
        </div>
      );
    };

    const leaveType = useSelector((state) => state.entry.leaveType);

    const dropDownEditor = (options) => {

      const value = getLeaveType.data.find((lt) => lt.lev_type === options.value);

      return (
        <Dropdown
          value={value}
          onChange={(e) => {
            options.editorCallback(e.value?.lev_type);
          }}
          options={leaveType}
          optionLabel="lev_type"
          placeholder="ရွေးချယ်ရန်"
        />
      );
    };


    const { mutateAsync: updateEmployeeLeave } = useMutationUpdateEmployeeLeave();

    const onEditHandler = async (e) => {
		
      try {
        
        const _employeeLeave = [...employeeLeaveList];
        const { newData, index } = e;

        console.log("newData",newData);
        console.log("getLeaveType",getLeaveType);

        const newEmployeeProfile = getLeaveType.data.find(
          (lvT) => lvT.lev_type === newData.lev_id
        );

        console.log("newEmployeeProfile",newEmployeeProfile);
        _employeeLeave[index] = {
          ...newData,
          lev_id: newEmployeeProfile.lev_id,
        };
  

        await updateEmployeeLeave(
          {
            rid : newData.rid,
            lev_id : newEmployeeProfile.lev_id, 
            lev_day  : newData.lev_day,
            total_leave_days : newData.total_leave_days,
            leave_detail : newData.leave_detail,
            leave_start_date : newData.leave_start_date,
            leave_end_date : newData.leave_end_date,
            approved_person : newData.approved_person,
            approved_date : newData.approved_date,
          },
          {
            onSuccess: async () => {
              // try {
                dispatch(
                  update({
                    stateProperty: "employeeLeave",
                    data: _employeeLeave,
                  })
                );
              // } catch (err) {
              //   console.error(err);
              // }
            },
            onSettled: (data, error) => {
              if (error) {
                toastRef.current.show({
                  severity: "error",
                  summary: "Error",
                  detail: error?.message,
                  life: 3000,
                });
              } else {
                toastRef.current.show({
                  severity: "success",
                  summary: "Success",
                  detail: data.message,
                  life: 3000,
                });
              }
            },
          }
        );
      } catch (err) {
        console.error(err);
      }
      
    };


    const allowanceAmount = (options) => {
      return (
          <InputNumber 
              value={options.value} 
              onValueChange={(e) => options.editorCallback(e.value)} 
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

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
     };

     const leaveDetail = (options) => {
      return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
   };

  
  return (
    <div className="flex-1">
      <Toast 
      ref={toastRef}
       />
      <div className="flex gap-5">
        <Button
          icon="pi pi-arrow-left"
          rounded
          raised
          onClick={() => router.back()}
        />

        <div className="h-full">
          <h1 className="text-3xl underline">Leave Reports</h1>
        </div>
      </div>

      <div className="col-12 mt-5 card">
        {!isFetched && (
          <div className="flex justify-content-center align-items-center">
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="8"
              fill="var(--surface-ground)"
              animationDuration=".5s"
            />
          </div>
        )}
        {
        isFetched && (


          <DataTable

            value={
              employeeLeaveList
              || undefined
            }
            editMode="row"
            paginator={true}
            lazy={true}
            first={firsts}
            rows={rows}
            totalRecords={record}
            removableSort
            showGridlines
            onRowEditComplete={onEditHandler}
            emptyMessage="Information not found"
            header={renderHeader}
            onPage={(e) => {
              if (!isPreviousData) {
                setFirsts(e.first);
                setRows(e.rows);
                setPage(e.page);
              }
            }}

          >
            <Column field="rid" header="Id" sortable/>

            <Column field="emp_id" header="အမည်" />

            <Column field="emp_rank_id" 
                    header="Rank Type" 
            />

            <Column field="emp_dept_id" header="Department" />

            <Column field="lev_id" 
                    header="leave Type"
                    editor={(options) => dropDownEditor(options)}
            />

            <Column field="total_leave_days" 
                    header="total_leave_days"
                    editor={(options) => 
                      allowanceAmount(options)}  
           />

            <Column field="leave_detail" 
                    header="leave_detail" 
                    editor={(options) => 
                      leaveDetail(options)}
            />

            <Column field="leave_start_date"
                    header="leave_start_date" 
                    body={(options) =>
                      new Date(options?.leave_start_date).toString().substring(0, 15)
                    }
                    editor={(options) => dateTimeEditor(options)}
            />

            <Column 
                    field="leave_end_date" 
                    header="leave_end_date" 
                    body={(options) =>
                      new Date(options?.leave_end_date).toString().substring(0, 15)
                    }
                    editor={(options) => dateTimeEditor(options)}
            />

            <Column 
                    field="approved_person" 
                    header="approved_person"
                    editor={(options) => 
                      textEditor(options)}  
            />

            <Column field="approved_date" 
                    header="approved_date"
                    body={(options) =>
                      new Date(options?.leave_end_date).toString().substring(0, 15)
                    }
                    editor={(options) => dateTimeEditor(options)}
          />

            {/* <Column 
                field="reg_date" 
                header="Reg Date"
                body={(options) =>
                  new Date(options?.reg_date).toString().substring(0, 15)
                }
            /> */}
            {/* <Column
              field="dept_desc"
              header="Department"
              sortField="dept_id"
              // editor={(options) => dropDownEditor(options)}
            /> */}

            <Column rowEditor />
          </DataTable>

        )
      }
      </div>
    </div>
  );
};

export default LeaveReport;
