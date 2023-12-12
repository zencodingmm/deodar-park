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
import {  useDepartment,useEmployeeDepartment } from "@/hooks/useDepartment";
import { useEmployeeRank, useRank } from "@/hooks/useRank";
import {useEmployeePayRoll,usePayRollAccountHead} from "@/hooks/usePayroll";

import { useEmployee } from "@/hooks/useEmployee";
import { getEmployeePayroll } from "@/pages/api/payroll.api";
import { Calendar } from "primereact/calendar";
import { useQueryClient } from "@tanstack/react-query";
import { InputNumber } from "primereact/inputnumber";

const DepartmentReport = () => 
  {
    
    const router = useRouter();
    const toastRef = useRef(null);
    const searchFilterValue = [
      { name: "Employee ID", code: "id" },
    ];

    const [filterDropdown, setFilterDropdown] = useState(searchFilterValue[0]);
    const [globalFilterValue, setGlobalFilterValue] = useState("");

    const [page, setPage] = useState(0);
    const [firsts, setFirsts] = useState(0);
  	const [rows, setRows] = useState(10);

    const queryClient = useQueryClient();

    // for employeee
    const { useEmployeeProfileFilterGetQuery, useEmployeeProfileSingleGetQuery } =
    useEmployee();

    //get rank type
    const { useQueryGetRank } = useRank();
    const { data: getRankType, isSuccess: getRankTypeSuccess } = useQueryGetRank();

    // const {useInsurance}
    const {useInsuranceTypeGetQuery} = useInsuranceType();
    const {data: getInsuranceType, isSuccess: getInsuranceTypeSuccess} = useInsuranceTypeGetQuery();

    const { useQueryGetPayRollAccountHead } = usePayRollAccountHead();
    const {data: getPayRollAccountHeadData, isSuccess: getPayRollAccountHeadDataSuccess} = useQueryGetPayRollAccountHead();

      // get department type
    const { useDepartmentGetQuery } = useDepartment();
    const { data: getDepartmentLists, isSuccess: getDepartmentListsSuccess } = useDepartmentGetQuery();
  

    // const {
    //   data: getSingleEmployeeDepartment,
    //   isSuccess: getSingleEmployeeDepartmentSuccess,
    //   isError: getSingleEmployeeDepartmentError,
    // } = useSingleEmployeeDepartmentGetQuery({ id: queryFetch.empData });


    // get insurance type
    const [queryFetch, setQueryFetch] = useState({
      field: null,
      data: null,
      datas: [],
      empData: null,
    });

    const { data: getSingleEmployee
      , isSuccess: getSingleEmployeeSuccess
      ,isError : getSingleEmployeeError,

    } =
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
        useMutationCreateEmployeePayroll,
        useQueryGetEmployeePayroll,
        useMutationUpdateEmployeePayroll,
        useMutationDeleteEmployeePayroll,
    } 
    = useEmployeePayRoll(); 


    // rank type 
    const 
    {
      useMutationUpdateEmployeeRank,
      useQueryGetEmployeeRank,
      useQueryGetSingleEmployeeRank,
    } 
    = useEmployeeRank();
  
    const {
      useMutationCreatePayRollAccountHead,
      useMutationUpdatePayRollAccountHead,
    } = usePayRollAccountHead();
  
    // get evaluation rank
    const [searchAll, setSearchAll] = useState("filter");
  

    const 
    {
      data: getSingleEmployeeRank,
      isSuccess: getSingleEmployeeRankSuccess,
      isError: getSingleEmployeeRankError,
    } 
    = useQueryGetSingleEmployeeRank({ id: queryFetch.data });

   

    const {
      data: employeePayroll,
      isSuccess: employeePayrollSuccess,
      isPreviousData,
      refetch,
      isFetched,
    } = useQueryGetEmployeePayroll(
        page,
    );

    const dispatch = useDispatch();
    const [record, setRecord] = useState(0);

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
        getSingleEmployeeSuccess &&
        employeePayrollSuccess &&
        getPayRollAccountHeadDataSuccess
      ) {

            const { data: employee } = getSingleEmployee;

            const filterResult = employeePayroll.data.filter(ep => ep.emp_id == employee.employeeID);

            const result = filterResult.map((ie) => {

              const rank = getRankType.data.find(
                (rank) => rank.rank_id === ie.emp_rank_id,
              );

              const department = getDepartmentLists.data.find(
                (dept) => dept.dept_id === ie?.emp_dept_id,
              );

              const payRollAccountHead = getPayRollAccountHeadData.data.find((p) => p.account_id === ie.account_id);

              return {
                  transaction_id : ie.transaction_id,
                  emp_id : employee?.employee_name,
                  emp_rank_id : rank?.rank_desc,
                  emp_dept_id : department?.dept_desc,
                  account_id   : payRollAccountHead.account_head,
                  allowance_amount : ie.allowance_amount,
                  detection_amount : ie.detection_amount,
                  transaction_start_date : ie.transaction_start_date,
                  closed : ie.closed,
                  closed_date : ie.closed_date,
                  transaction_end_date : ie.transaction_end_date
                }
            })

            dispatch(
              update({
                stateProperty: "payRoll",
                data : result,
              }),
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

    
    useEffect(() => {
      if (employeePayrollSuccess) {
        if (!Array.isArray(employeePayroll.data)) {
          dispatch(
            entryUpdate({
              stateProperty: "payRollAccountHead",
              data: [employeePayroll.data],
            })
          );
        } else {
          dispatch(
            entryUpdate({
              stateProperty: "payRollAccountHead",
              data: employeePayroll.data,
            })
          );
        }
      }
    }, [dispatch, employeePayrollSuccess, employeePayroll]);



    useEffect(() => 
    {
      if(
           employeePayrollSuccess
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
          
          const employeePayrollData = employeePayroll.data;

          if(employeePayroll?.count)
          {    
              setRecord(employeePayroll.count);
          }

          if(employeePayrollData){

              const result = employeePayrollData.map((ie) => {

                  queryData.push(ie.emp_id);

                  if(getEmployeeListSuccess)
                  {
                   
                    const employee = getEmployeeList.find(
                      (emp) => emp.data.employeeID === parseInt(ie.emp_id),
                    );

                      if(getRankTypeSuccess && employee && getDepartmentListsSuccess && getEmployeeListSuccess && getPayRollAccountHeadDataSuccess)
                      {
                                                
                        const payRollAccountHead = getPayRollAccountHeadData.data.find((p) => p.account_id === ie.account_id);
                       
                        const insurance = getInsuranceType.data.find((insurance) => insurance.iid === ie.insurance_id); 

                        const rank = getRankType.data.find(
                          (rank) => rank.rank_id === ie.emp_rank_id,
                        );

                        const department = getDepartmentLists.data.find(
                          (dept) => dept.dept_id === ie?.emp_dept_id,
                        );
                            
                        return {
                          transaction_id : ie.transaction_id,
                          emp_id : employee?.data.employee_name,
                          emp_rank_id : rank?.rank_desc,
                          emp_dept_id : department?.dept_desc,
                          account_id   : payRollAccountHead.account_head,
                          allowance_amount : ie.allowance_amount,
                          detection_amount : ie.detection_amount,
                          transaction_start_date : ie.transaction_start_date,
                          closed : ie.closed,
                          closed_date : ie.closed_date,
                          transaction_end_date : ie.transaction_end_date
                        }
                       }

                  }

                  

              })

              dispatch(
                update({
                  stateProperty: "payRoll",
                  // data: insuranceEmployee.data,
                  data : result,
                }),
              );
          }
        }
    },[
      globalFilterValue,
      getEmployeeList,
      getEmployeeListSuccess,
      dispatch,
      employeePayroll,
      employeePayrollSuccess,
    ]);

   

    const payRollList = useSelector(
      (state) => state.transaction.payRoll,
    ); 


    useEffect(() =>
    {
      if (!isPreviousData) 
      {
        console.log("is not previous data");
        queryClient
          .prefetchQuery({
            queryKey: ["get", "payRoll", page],
            queryFn: () => getEmployeePayroll({ page }),
          })
          .catch((err) => console.log(err));
      }
    }, [employeePayroll, isPreviousData, page, queryClient]);


    const clearFilter = () => {
      setGlobalFilterValue("");
      refetch().catch((err) => console.log(err));
    };

  const { mutateAsync: updateEmployeePayroll } = useMutationUpdateEmployeePayroll();

  const onEditHandler = async (e) => {
		try {

        const _payRoll = [...payRollList];

        const { newData, index } = e;
        console.log("newData",newData);


        // if(getPayRollAccountHeadDataSuccess)
        // {

            let accId = newData.account_id.account_head != undefined ? newData.account_id.account_head : newData.account_id;

            const newAccoundHeaded = getPayRollAccountHeadData.data.find(
              (ah) => ah.account_head === accId
            );

            console.log("newAccoundHeaded",newData.account_id);

            console.log(newData);

              _payRoll[index] = {
                ...newData, 
                account_id : newAccoundHeaded.account_head,
            };

      
  
  			await updateEmployeePayroll(
				{
            transaction_id : newData.transaction_id,
            account_id   :   newAccoundHeaded.account_id,
            allowance_amount : newData.allowance_amount,
            detection_amount : newData.detection_amount,
            transaction_start_date : newData.transaction_start_date,
            closed : newData.closed,
            closed_date : newData.closed_date,
            transaction_end_date : newData.transaction_end_date
				},
				{
					onSuccess: async () => {
						try {
							dispatch(
								update({
									stateProperty: "payRoll",
									data: _payRoll,
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

  
  useEffect(() => {
    if (getPayRollAccountHeadDataSuccess) 
    {
      dispatch(
        entryUpdate({ stateProperty: "payRollAccountHead", data: getPayRollAccountHeadData.data }),
      );
    }
  }, [dispatch, getPayRollAccountHeadData, getPayRollAccountHeadDataSuccess]);
  

  const payrollAcc = useSelector((state) => state.entry.payRollAccountHead);


  const dropdownEditor = (options) => {
    return (
      <Dropdown
          value={options.value}
          valueTemplate={() => {
            return options.value?.account_head || options.value;
          }}
          onChange={(e) => {
            options.editorCallback(e.value);
          }}
          options={payrollAcc}
          optionLabel="account_id"
          placeholder="ရွေးချယ်ရန်"
       />
    );
  };

  const detectionAmount = (options) => {
    return (
        <InputNumber 
            value={options.value} 
            onValueChange={(e) => options.editorCallback(e.value)} 
           />
      );
  };


  const closed = (options) => {
    return (
        <InputNumber 
            value={options.value} 
            onValueChange={(e) => options.editorCallback(e.value)} 
           />
      );
  };


  const allowanceAmount = (options) => {
    return (
        <InputNumber 
            value={options.value} 
            onValueChange={(e) => options.editorCallback(e.value)} 
           />
      );
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
          <h1 className="text-3xl underline">Pay Roll Reports</h1>
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
              payRollList
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

            <Column field="transaction_id" header="Employee ID" sortable/>

            <Column field="emp_id" header="အမည်" />

            <Column field="emp_rank_id" header="Rank Type" />

            <Column field="emp_dept_id" header="emp_dept_id" />

            <Column field="account_id"
                    header="account Type" 
                    editor={(options) => dropdownEditor(options)}
            />

            <Column field="allowance_amount"
                    header="allowance_amount" 
                    editor={(options) => 
                      allowanceAmount(options)}  
            />

            <Column field="detection_amount" 
                    header="detection_amount" 
                    editor={(options) => 
                    detectionAmount(options)}        
            />

            <Column field="transaction_start_date" 
                    header="transaction_start_date" 
                    editor={(options) => dateTimeEditor(options)}
                    body={(options) =>
                      new Date(options?.transaction_start_date).toString().substring(0, 15)
                    }
            />

            <Column field="closed" 
                    header="closed"
                    editor={(options) => 
                      closed(options)
                    }      
            />

            <Column field="closed_date" 
                    header="closed_date" 
                    editor={(options) => dateTimeEditor(options)}
                    body={(options) =>
                      new Date(options?.closed_date).toString().substring(0, 15)
                    }
            />

            <Column field="transaction_end_date" 
                    header="transaction_end_date" 
                    editor={(options) => dateTimeEditor(options)}
                    body={(options) =>
                      new Date(options?.transaction_end_date).toString().substring(0, 15)
                    }
            />

            
            {
            /* <Column
              field="dept_desc"
              header="Department"
              sortField="dept_id"
              // editor={(options) => dropDownEditor(options)}
            /> */
            }

            <Column rowEditor />
          </DataTable>

        )
      }
      </div>
    </div>
  );
};

export default DepartmentReport;
