import React, { useState, useEffect, useRef } from "react";

import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { update } from "@/features/transaction/transactionSlice";
import { update as entryUpdate } from "@/features/entry/entrySlice";

import { useEmployeeInsurance,useInsuranceType } from "@/hooks/useInsurance";
import {  useDepartment,useEmployeeDepartment } from "@/hooks/useDepartment";
import {useEmployeeOvertimeActualAttendance,useOTShiftType} from "@/hooks/useOvertime";
import { useEmployeeRank, useRank } from "@/hooks/useRank";

import { useEmployee } from "@/hooks/useEmployee";
import { isError, useQueryClient } from "@tanstack/react-query";
import { getEmployeeInsurance } from "@/pages/api/insurance.api";
import { InputNumber } from "primereact/inputnumber";

const OverTimeActualAttendenceReport = () => 
  {
    
    const router = useRouter();
    const toastRef = useRef(null);

    const searchFilterValue = [
      { name: "Employee ID", code: "id" },
      { name: "date", code: "date" },
    ];
  
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [page, setPage] = useState(0);

    const [filterDropdown, setFilterDropdown] = useState(searchFilterValue[0]);

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

    const [firsts, setFirsts] = useState(0);
    const [rows, setRows] = useState(10);

    const [isDateVisible, setIsDateVisible] = useState(false);

    // get insurance type
    const [queryFetch, setQueryFetch] = useState
    ({
      field: null,
      data: null,
      datas: [],
      empData: null,
    });

    const { data: getSingleEmployee, isSuccess: getSingleEmployeeSuccess , isError : getSingleEmployeeError} =
    useEmployeeProfileSingleGetQuery
    ({
      field: queryFetch.field,
      data: queryFetch.data,
    });

    const { data: getEmployeeList, isSuccess: getEmployeeListSuccess } =
    useEmployeeProfileFilterGetQuery({
      field: queryFetch.field,
      datas: queryFetch.datas,
    });


    const {
      useMutationCreateEmployeeActualAtt,
      useQueryGetEmployeeActualAtt,
      useQueryGetSingleEmployeeActualAtt,
      useMutationUpdateEmployeeActualAtt,
    } 
    = useEmployeeOvertimeActualAttendance(); 

    const { mutateAsync: updateEmployeeActualAttendance } =  useMutationUpdateEmployeeActualAtt();

    const 
    {
      data: getSingleEmployeeActualAtt,
      isSuccess: getSingleEmployeeActualAttSuccess,
      isError: GetSingleEmployeeActualAttError,
    } = useQueryGetSingleEmployeeActualAtt(queryFetch.data)

    // rank type 
    const {
      useMutationUpdateEmployeeRank,
      useQueryGetEmployeeRank,
      useQueryGetSingleEmployeeRank,
    } 
    = useEmployeeRank();

  
  
    // get evaluation rank
    const [searchAll, setSearchAll] = useState("filter");
    const {
      data: getEmployeeRanks,
      isSuccess: getEmployeeRanksSuccess,
      isPreviousRankData,
      refetchRank,
      isFetchedRank,
    } = useQueryGetEmployeeRank({ filter: searchAll, page });
  
    const 
    {
      data: getSingleEmployeeRank,
      isSuccess: getSingleEmployeeRankSuccess,
      isError: getSingleEmployeeRankError,
    } 
    = useQueryGetSingleEmployeeRank({ id: queryFetch.data });


    const {
      data: getOvertimeActualAtt,
      isSuccess: getOvertimeActualAttSuccess,
      isPreviousData,
      refetch,
      isFetched,
    } = useQueryGetEmployeeActualAtt(
        page,
    );


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
        //  &&
        //  getSingleEmployeeActualAttSuccess
          // &&
        // getDepartmentSuccess
      ) {
  
        const { data: employee } = getSingleEmployee;

        const { data: employeeActualAtt } = getSingleEmployeeActualAtt;

        const department = getDepartmentLists.data.find(
          (dept) => dept.dept_id === employeeActualAtt?.emp_dept_id,
        );
  
        const rank = getRankType.data.find(
          (rank) => rank.rank_id === employeeActualAtt.emp_rank_id,
        );


        const OtShiptType =  getOTShiftTypeLists.data.find( 
          (stl) => stl.rid === employeeActualAtt.shift_type_id
      );

  
        dispatch(
          update({
            stateProperty: "overtimeActualAttendance",
            data: [
              {
                rid : employeeActualAtt.rid,
                shift_type_id: OtShiptType.shift_group_name,
                emp_id : employee?.employee_name,
                emp_rank_id : rank?.rank_desc,
                substituted : employeeActualAtt.substituted,
                remark : employeeActualAtt.remark,
                plan_date : employeeActualAtt.plan_date,
                emp_dept_id:department?.dept_desc,

              },
            ],
          })
        );
  
      } 
      else if (getSingleEmployeeError) {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "This employee not set department.",
        });
      }
    };




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
           getOvertimeActualAttSuccess && 
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
          
          const getOvertimeActualAttData = getOvertimeActualAtt.data;

          if(getOvertimeActualAtt?.count)
          {
              setRecord(getOvertimeActualAtt.count);
          }

          if(getOvertimeActualAttData){

              const result = getOvertimeActualAttData.map((ie) => {

                  queryData.push(ie.emp_id);

                  if(getOvertimeActualAttSuccess && getEmployeeListSuccess && getOTShiftTypeListsSuccess)
                  {
                   
                    const employee = getEmployeeList.find(
                      (emp) => emp.data.employeeID === parseInt(ie.emp_id),
                    );

                      if(getRankTypeSuccess && getInsuranceTypeSuccess && employee && getDepartmentListsSuccess && getEmployeeListSuccess)
                      {

                        // const insurance = getInsuranceType.data.find((insurance) => insurance.iid === ie.insurance_id);
                          
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
                            rid : ie.rid,
                            shift_type_id: OtShiptType.shift_group_name,
                            emp_id : employee?.data.employee_name,
                            emp_rank_id : rank?.rank_desc,
                            substituted : ie.substituted,
                            remark : ie.remark,
                            plan_date : ie.plan_date,
                            // emp_dept_id : 

                          // emp_id : employee?.data.employeeID,
                          // employee_name : employee?.data.employee_name,
                             emp_dept_id:department?.dept_desc,
                            //  insurance_id : insurance.insurance_type,
                          // reg_date:ie.reg_date,
                        }

                      
                       }

                  }

                  

              })

              dispatch(
                update({
                  stateProperty: "overtimeActualAttendance",
                  // data: insuranceEmployee.data,
                  data : result,
                }),
              );
          }
        }
    },[
      getEmployeeList,
      getEmployeeListSuccess,
      dispatch,
      getOvertimeActualAtt,
      getOvertimeActualAttSuccess,
      globalFilterValue
    ]);


  const overtimeActualAttendanceList = useSelector(
    (state) => state.transaction.overtimeActualAttendance,
  ); 


  
  const clearFilter = () => 
  {
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


  const onEditHandler = async (e) => {
		try {

        const _overtimeActualAttendance = [...overtimeActualAttendanceList];

        const { newData, index } = e;
      

        // if(getPayRollAccountHeadDataSuccess)
        // {

            let shiftTypeId =newData.shift_type_id.shift_group_name != undefined ? newData.shift_type_id.shift_group_name : newData.shift_type_id;

            const newOverTimeshiftlist = getOTShiftTypeLists.data.find(
              (ah) => ah. shift_group_name === shiftTypeId
            );

            console.log("newOverTimeshiftlist.rid",newOverTimeshiftlist.rid);

            // console.log("newData.shift_type_id",newData.shift_type_id.shift_group_name);

            // console.log("newOverTimeshiftlist",newOverTimeshiftlist.shift_group_name);

            _overtimeActualAttendance[index] = {
              ...newData, 
                shift_type_id : shiftTypeId,
           };

            // console.log("newAccoundHeaded",newData.account_id);

            // console.log(newData);

            //   _payRoll[index] = {
            //     ...newData, 
            //     account_id : newAccoundHeaded.account_head,
            // };

      
  
  			await updateEmployeeActualAttendance(
				{
          rid:newData.rid,
          shift_type_id:newOverTimeshiftlist.rid,
          // emp_id : 1,
          // emp_rank_id : 1,
          // emp_dept_id : 1 ,
          plan_date:newData.plan_date,
          substituted : newData.substituted,
          remark : newData.remark,
				},
				{
					onSuccess: async () => {
						try {
							dispatch(
								update({
									stateProperty: "overtimeActualAttendance",
									data: _overtimeActualAttendance,
								})
							);
						} catch (err) {
							console.error(err);
						}
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


  const [overtimeShift, setOvertimeShift] = 
  useState
  ({
    start_actual_date: undefined,
    end_actual_date: undefined,
    start_actual_time: undefined,
    end_actual_time: undefined,
  });

  const [filterTime, setFilterTime] = useState({
    "start_actual_date": '',
    "end_actual_date": '',
    "start_actual_time": '',
    "end_actual_time": '',
  });


  const {useQueryGetActOTShiftTypeByTime} = useEmployeeOvertimeActualAttendance();

  const { data: GetOTShiftTypeByTime , isSuccess: GetOTShiftTypeByTimeSuccess, isError: GetOTShiftTypeByTimeError} = useQueryGetActOTShiftTypeByTime(      
      filterTime.start_actual_date,
      filterTime.end_actual_date,
      filterTime.start_actual_time,
      filterTime.end_actual_time,     
  );

  const onDateFilter = () => 
  {

      const formattedStartDate = overtimeShift?.start_actual_date?.toISOString()?.split('T')[0];
      const formattedEndDate = overtimeShift.end_actual_date?.toISOString()?.split('T')[0];
      const formattedStartTime = overtimeShift.start_actual_time?.toLocaleTimeString('en-US', { hour12: false });
      const formattedEndTime = overtimeShift?.end_actual_time?.toLocaleTimeString('en-US', { hour12: false });

    
      setFilterTime({
        "start_actual_date":formattedStartDate,
        "end_actual_date":formattedEndDate,
        "start_actual_time": formattedStartTime,
        "end_actual_time": formattedEndTime,
      })


      console.log("GetOTShiftTypeByTime",GetOTShiftTypeByTime);



  }


  useEffect(() => {
    if (getOTShiftTypeListsSuccess) {
      if (!Array.isArray(getOTShiftTypeLists.data)) {
        dispatch(
          entryUpdate({
            stateProperty: "overtimeShiftType",
            data: [getOTShiftTypeLists.data],
          })
        );
      } else {
        dispatch(
          entryUpdate({
            stateProperty: "overtimeShiftType",
            data: getOTShiftTypeLists.data,
          })
        );
      }
    }
  }, [dispatch, getOTShiftTypeListsSuccess, getOTShiftTypeLists]);




  // header for datatable
  const renderHeader = () => {
    return (
      <div className="flex gap-3">
        <div>
            <Dropdown
              value={filterDropdown}
              onChange={(e) => {
                setFilterDropdown(e.target.value);

                if(e.target.value.name === "date")
                {
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
                  name="start_actual_date"
                  placeholder="Choose Start Date"
                  onChange={onChangeHandler}
                  showIcon
                  required
                />

                <Calendar
                  name="end_actual_date"
                  onChange={onChangeHandler}
                  placeholder="Choose End Date"
                  showIcon
                  required
                />
              
                <Calendar
                    // inputId="start_time"
                    name="start_actual_time"
                    // value={overtimeShift.start_time}
                    onChange={onChangeHandler}
                    placeholder="စတင်သည့်အချိန်"
                    showIcon
                    timeOnly
                    required
                />


                <Calendar
                    // inputId="end_time"
                    name="end_actual_time"
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



  const substituted = (options) => {
    return (
        <InputNumber 
            value={options.value} 
            onValueChange={(e) => options.editorCallback(e.value)} 
           />
      );
  };
  const overtimeShiftType = useSelector((state) => state.entry.overtimeShiftType);

  const dropdownEditor = (options) => {
    console.log(options.value);
    return (
      <Dropdown
          value={options.value}
          valueTemplate={() => {
            return options.value?.shift_group_name 
          }}
          onChange={(e) => {
            
            options.editorCallback(e.value);
          }}
          options={overtimeShiftType}
          optionLabel="shift_group_name"
          placeholder="ရွေးချယ်ရန်"
       />
    );
  };


  const textEditor = (options) => {
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
          <h1 className="text-3xl underline">OvertimeActual Attendence Reports</h1>
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

            // console.log("list",employeeInsuranceList)

          <DataTable
            value={
              overtimeActualAttendanceList
              || undefined}
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

            <Column field="shift_type_id" 
                    header="Shift Type"
                    editor={(options) => dropdownEditor(options)}
              />

            <Column field="emp_id" header="နာမည်"/>

            <Column field="emp_rank_id" header="emp_rank_id"/>

            <Column field="emp_dept_id" 
                    header="Insurance_Id"
             />
            
            <Column field="plan_date" header="plan_date" 
                    body={(options) =>
                      new Date(options?.plan_date).toString().substring(0, 15)
                    }
                    editor={(options) => dateTimeEditor(options)}
            />

            <Column field="substituted" 
                    header="substituted" 
                    editor={(options) => substituted(options)}
            />

            <Column field="remark" 
                    header="remark"
                    editor={(options) => textEditor(options)}
            />

            <Column rowEditor />
          </DataTable>
        )
      }
      </div>
    </div>
  );
};

export default OverTimeActualAttendenceReport;
