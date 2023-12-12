import React, { useState, useEffect, useRef } from "react";

import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";

import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { update } from "@/features/transaction/transactionSlice";
import { update as entryUpdate } from "@/features/entry/entrySlice";

import { useEmployeeInsurance,useInsuranceType } from "@/hooks/useInsurance";
import {  useDepartment,useEmployeeDepartment } from "@/hooks/useDepartment";
import {  useEmployeeOvertimePlan,useEmployeeOvertimeActualAttendance,useOTShiftType} from "@/hooks/useOvertime";

import { useEmployeeRank, useRank } from "@/hooks/useRank";

import { useEmployee } from "@/hooks/useEmployee";

import { useQueryClient } from "@tanstack/react-query";
import { getEmployeeInsurance } from "@/pages/api/insurance.api";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";


const DepartmentReport = () => 
  {
    
    const router = useRouter();

    const toastRef = useRef(null);
    const [isDateVisible, setIsDateVisible] = useState(false);

    const searchFilterValue = [
      { name: "Employee ID", code: "id" },
      { name: "date", code: "date" },
    ];

    const [overtimeShift, setOvertimeShift] = 
    useState
    ({
      start_date: undefined,
      end_date: undefined,
      start_time: undefined,
      end_time: undefined,
    });

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [filterDropdown, setFilterDropdown] = useState(searchFilterValue[0]);
    
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

    const { useQueryGetOTShiftType } = useOTShiftType();
    const { data : getOTShiftTypeLists , isSuccess:getOTShiftTypeListsSuccess} = useQueryGetOTShiftType();

    const [filterTime, setFilterTime] = useState({
      "stateDate": '',
      "endDate": '',
      "stateTime": '',
      "endTime": '',
    });
    
    const {useQueryGetOTShiftTypeByTime} = useOTShiftType();

    const { data: GetOTShiftTypeByTime , isSuccess: GetOTShiftTypeByTimeSuccess, isError: GetOTShiftTypeByTimeError} = useQueryGetOTShiftTypeByTime(      
        filterTime.stateDate,
        filterTime.endDate,
        filterTime.stateTime,
        filterTime.endTime,     
    );
    
    useEffect(()=> {

        console.log("filterTime",filterTime.stateDate);

    },[filterTime,setFilterTime])
    

    const [firsts, setFirsts] = useState(0);
    const [rows, setRows] = useState(10);

    // get insurance type

    const [queryFetch, setQueryFetch] = useState({
      field: null,
      data: null,
      datas: [],
      empData: null,
    });

    const { data: getSingleEmployee, isSuccess: getSingleEmployeeSuccess,isError:getSingleEmployeeError } =

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
      useMutationCreateEmployeeOvertimePlan,
      useQueryGetEmployeeOvertimePlan,
      useQueryGetSingleEmployeeOvertimePlan,
      useMutationUpdateEmployeeOvertimePlan,
    } 
    = useEmployeeOvertimePlan(); 

    // const { data: getDepartmentLists, isSuccess: getDepartmentListsSuccess } = useEmployeeInsuranceGetQuery();
    // rank type 

    const 
    {
      useMutationCreateEmployeeActualAtt,
      useQueryGetEmployeeActualAtt,
      useQueryGetSingleEmployeeActualAtt,
      useMutationUpdateEmployeeActualAtt,
    } 
    = useEmployeeOvertimeActualAttendance();
  
    // get evaluation rank
    const [searchAll, setSearchAll] = useState("filter");

    const {
      data: overTimeEmployee,
      isSuccess: overTimeEmployeeSuccess,
      isPreviousData,
      refetch,
      isFetched,
    } 
    = useQueryGetEmployeeOvertimePlan(
        page,
    );

    const dispatch = useDispatch();

    const [record, setRecord] = useState(0);

    const onChangeHandler = (e) => {

      setOvertimeShift((prevState) => {
        return { ...prevState, [e.target.name]: e.target.value };
      });

    };
  

    useEffect(() => 
    {
      if(
          overTimeEmployeeSuccess &&
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
          
          const overTimeEmployeeData = overTimeEmployee.data;

          if(overTimeEmployee?.count)
          {
              setRecord(overTimeEmployee.count);
          }

          if(overTimeEmployeeData){

              const result = overTimeEmployeeData.map((ie) => {

                  queryData.push(ie.emp_id);

                  if(getEmployeeListSuccess && getOTShiftTypeListsSuccess)
                  {
                   
                    const employee = getEmployeeList.find(
                      (emp) => emp.data.employeeID === parseInt(ie.emp_id),
                    );

                      if(getRankTypeSuccess && employee && getDepartmentListsSuccess && getEmployeeListSuccess)
                      {

                        const insurance = getInsuranceType.data.find((insurance) => insurance.iid === ie.insurance_id);

                        const rank = getRankType.data.find(
                          (rank) => rank.rank_id === ie.emp_rank_id,
                        );

                        const OtShiptType =  getOTShiftTypeLists.data.find( 
                          (stl) => stl.rid === ie.shift_type_id
                       );

                        const department = getDepartmentLists.data.find(
                          (dept) => dept.dept_id === ie?.emp_dept_id,
                        );
                            
                        return {
                          rid:ie.rid,
                          // emp_id : employee?.data.employeeID,
                          shift_type_id:OtShiptType.shift_group_name,
                          employee_name : employee?.data.employee_name,
                          emp_rank_id : rank?.rank_desc,
                          emp_dept_id:department?.dept_desc,
                          plan_date : ie.plan_date,
                          substituted: ie.substituted,
                          remark:ie.remark,
                        }
                      }

                  }
              })

              dispatch(
                update({
                  stateProperty: "overtimePlan",
                  data : result,
                }),
              );
          }
        }
    },[
      getEmployeeList,
      getEmployeeListSuccess,
      dispatch,
      overTimeEmployee,
      overTimeEmployeeSuccess,
      globalFilterValue
    ]);


    const overtimePlanList = useSelector(
      (state) => state.transaction.overtimePlan,
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

    const {
      data     : singleOverTimeEmployee,
      isSuccess: singleOverTimeEmployeeSuccess,
      isError : singleOverTimeEmployeeError
    } 
    = useQueryGetSingleEmployeeOvertimePlan(
      queryFetch.data
    );




  // useEffect(() => {

  //     console.log("user overtime shift");

  // },[setOvertimeShift])

  const onDateFilter = () => 
  {

    const formattedStartDate = overtimeShift.start_date.toISOString().split('T')[0];
    const formattedEndDate = overtimeShift.end_date?.toISOString().split('T')[0];
    const formattedStartTime = overtimeShift.start_time?.toLocaleTimeString('en-US', { hour12: false });
    const formattedEndTime = overtimeShift.end_time?.toLocaleTimeString('en-US', { hour12: false });


    setFilterTime({
      "stateDate":formattedStartDate,
      "endDate":formattedEndDate,
      "stateTime": formattedStartTime,
      "endTime": formattedEndTime,
    })

     console.log("GetOTShiftTypeByTime",GetOTShiftTypeByTime);

      if(GetOTShiftTypeByTime !== undefined)
      {

        const result = GetOTShiftTypeByTime.data.map((ie) => {

          const rank = getRankType.data.find(
            (rank) => rank.rank_id === ie.emp_rank_id,
          );

          const department = getDepartmentLists.data.find(
            (dept) => dept.dept_id === ie?.emp_dept_id,
          );


          return{
              rid:ie.rid,
              shift_type_id:ie.shift_group_name,
              employee_name : ie?.emp_id,
              emp_rank_id : rank?.rank_desc,
              emp_dept_id:department?.dept_desc,
              plan_date : ie.plan_date,
              substituted: ie.substituted,
              remark:ie.remark,
          }
      })

      console.log("result",result);

      console.log("result[0].emp_dept_id",result[0].emp_dept_id);
      
      if(result[0].emp_dept_id === undefined)
      {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "This employee not set department.",
        });
      }
      
      else
      {
          dispatch(
            update({
              stateProperty: "overtimePlan",
              data : result,
            }),
          );
      }
      
      

      } 

      else
      {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "This employee not set department.",
        });
      }
      
  }
  
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
        overTimeEmployeeSuccess  
         &&
        getOTShiftTypeListsSuccess
         &&
        singleOverTimeEmployeeSuccess
      ) {

           const { data: employee } = getSingleEmployee;

           const { data: overTimeEmployee } =  singleOverTimeEmployee;


          const department = getDepartmentLists.data.find(
            (dept) => dept.dept_id === singleOverTimeEmployee?.emp_dept_id,
          );

          const OtShiptType =  getOTShiftTypeLists.data.find( 
            (stl) => stl.rid === overTimeEmployee.shift_type_id
         );

         const rank = getRankType.data.find(
          (rank) => rank.rank_id === overTimeEmployee.emp_rank_id,
        );

          dispatch(
            update({
              stateProperty: "overtimePlan",
              data: [
                {
                  rid:overTimeEmployee.rid,
                  shift_type_id:OtShiptType.shift_group_name,
                  employee_name : employee?.employee_name,
                  emp_rank_id : rank?.rank_desc,
                  // emp_dept_id:department?.dept_desc,
                  plan_date : overTimeEmployee.plan_date,
                  substituted: overTimeEmployee.substituted,
                  remark:overTimeEmployee.remark,
                },
              ],
            })
          );

        } 
     else if (getSingleEmployeeError || singleOverTimeEmployeeError) {
       toastRef.current.show({
         severity: "error",
         summary: "Error",
         detail: "This employee not set department.",
       });
     }
    };




    const renderHeader = () => {
      return (
        <div className="flex gap-3">
          <div>
            <Dropdown
              value={filterDropdown}
              onChange={(e) => {

                setFilterDropdown(e.target.value);

                if(e.target.value.name === "date"){
                  setIsDateVisible(true);
                }
                else
                {
                  setIsDateVisible(false);
                }
                // console.log(e.target.value.name);

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

          {

            !isDateVisible 
            && 
            (
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
            )

          }
         

        {isDateVisible && (
            <>
                <Calendar
                  // inputId="leave_start_date"
                  name="start_date"
                  // value={employeeLeave.leave_start_date}
                  onChange={onChangeHandler}
                  placeholder="Choose Start Date"
                  showIcon
                  required
                />

                <Calendar
                  // inputId="leave_start_date"
                  name="end_date"
                  // value={employeeLeave.leave_start_date}
                  onChange={onChangeHandler}
                  placeholder="Choose End Date"
                  showIcon
                  required
                />
              
                <Calendar
                    // inputId="start_time"
                    name="start_time"
                    // value={overtimeShift.start_time}
                    onChange={onChangeHandler}
                    placeholder="စတင်သည့်အချိန်"
                    showIcon
                    timeOnly
                    required
                />


                <Calendar
                    // inputId="end_time"
                    name="end_time"
                    // value={overtimeShift.start_timeoverTimeEmployeee}
                    onChange={onChangeHandler}
                    placeholder="ပြီးဆုံးသွားသည့်အချိန်"
                    showIcon
                    timeOnly
                    required
                />

                <Button
                    label="Search"
                    onClick={() => onDateFilter()}
                  />
            </>
        )}

          <Button label="Clear" severity="danger" onClick={clearFilter} />
        </div>
      );
    };

    // const {
    //   useMutationCreateEmployeeLeave,
    //   useQueryGetEmployeeLeave,
    //   useMutationUpdateEmployeeLeave,
    //   useQueryGetSingleEmployeeLeave,
    // } 
    // = useEmployeeLeave(); 


    const textEditor = (options) => 
    {
      return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };


   const { mutateAsync: updateEmployeeOvertimePlan } = useMutationUpdateEmployeeOvertimePlan();


   const onEditHandler = async (e) => {
   
     try {
       
       const _employeePlan = [...overtimePlanList];
       const { newData, index } = e;


         const newEmployeeProfile = getOverTimePlanList.find(
           (opl) => opl.shift_group_name === newData.shift_type_id
         );


         console.log("newEmployeeProfile",newEmployeeProfile);

        //  console.log("newEmployeeProfile",newEmployeeProfile);

         _employeePlan[index] = {
            ...newData,
            shift_type_id: newEmployeeProfile.shift_group_name,
       };
 

       await updateEmployeeOvertimePlan(
         {
          rid : newData.rid,
          shift_type_id: newEmployeeProfile.rid,
          plan_date : newData.plan_id,
          substituted : newData.substituted,
          remark : newData.remark,
         },
         {
           onSuccess: async () => {
             // try {
               dispatch(
                 update({
                   stateProperty: "overtimePlan",
                   data: _employeePlan,
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

   const dateTimeEditor = (options) => {
    return (
      <Calendar
        name={options.field}
        value={new Date(options.value)}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const substitutedEdit = (options) => {
    return (
        <InputNumber 
            value={options.value} 
            onValueChange={(e) => options.editorCallback(e.value)} 
           />
      );
  };

  const getOverTimePlanList = useSelector(
      (state) => state.entry.overtimeShiftType,
  ); 

  const dropDownEditor = (options) => {

   		const value = getOverTimePlanList.find((ot) => ot.shift_group_name === options.value);
    
      return (
        <Dropdown
          value={value}
          onChange={(e) => {
            options.editorCallback(e.value?.shift_group_name);
          }}
          options={getOverTimePlanList}
          optionLabel="shift_group_name"
          placeholder="ရွေးချယ်ရန်"
        />
      );
	};

  
  useEffect(() => {

    if (getOTShiftTypeListsSuccess) {

        if (!Array.isArray(getOTShiftTypeLists.data))
        {
          

            dispatch(
              entryUpdate({
                stateProperty: "overtimeShiftType",
                data: [getOTShiftTypeLists.data],
              })
            );
        }

        else {
          dispatch(
            entryUpdate({
              stateProperty: "overtimeShiftType",
              data: getOTShiftTypeLists.data,
            })
          );
        }
    }

  }, [dispatch, getOTShiftTypeListsSuccess, getOTShiftTypeLists]);



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
          <h1 className="text-3xl underline">Overtime plan Report</h1>
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
              overtimePlanList
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

            <Column field="rid" header="ID" sortable/>

            <Column field="employee_name" header="Employee Name" />

            <Column field="shift_type_id" 
                    header="Overtime sfift type" 
                    editor={(options) => dropDownEditor(options)}
              />


            <Column field="emp_rank_id" header="Rank type" />

            <Column field="emp_dept_id" header="Department" />

            <Column 
                    field="plan_date"
                    header="plan_date" 
                    body={(options) =>
                      new Date(options?.plan_date).toString().substring(0, 15)
                    }
                    editor={(options) => dateTimeEditor(options)}
            />

            <Column field="substituted"
                    header="substituted" 
                    editor={(options) => 
                      substitutedEdit(options)}  
            />

            <Column field="remark" 
                    header="remark"
                    editor={(options) => 
                      textEditor(options)}  
            />

            {
            /* 
            <Column 
                field="reg_date" 
                header="Reg Date"
                body={(options) =>
                  new Date(options?.reg_date).toString().substring(0, 15)
                }
            /> 
            */
            }

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

export default DepartmentReport;