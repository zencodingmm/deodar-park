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
import {  useLoanType,useEmployeeLoanRecord } from "@/hooks/useLoan";
import { useEmployeeRank, useRank } from "@/hooks/useRank";
import { useEmployee } from "@/hooks/useEmployee";

import { isError, useQueryClient } from "@tanstack/react-query";
import { getEmployeeInsurance } from "@/pages/api/insurance.api";
import { updateEmployeeLoanRecord } from "@/pages/api/loan.api";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";


const DepartmentReport = () => 
  {
    
    const router = useRouter();
    const toastRef = useRef(null);
    const searchFilterValue = [
      { name: "Employee ID", code: "id" },
    ];
  
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
    
    // get insurance type
    const [firsts, setFirsts] = useState(0);
    const [rows, setRows] = useState(10);

    const [queryFetch, setQueryFetch] = useState({
      field: null,
      data: null,
      datas: [],
      empData: null,
    });

    const { data: getSingleEmployee, isSuccess: getSingleEmployeeSuccess, isError: getSingleEmployeeError} =
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
        useMutationCreateEmployeeLoanRecord,
        useQueryGetEmployeeLoanRecord,
        useQueryGetSingleEmployeeLoanRecord,
        useMutationUpdateEmployeeLoanRecord,
    } 
    = useEmployeeLoanRecord(); 

    const {
        useMutationCreateLoanType,
        useQueryGetLoanType,
        useMutationUpdateLoanType,
    } 
    = useLoanType();
    const { data: getLoanType, isSuccess: getLoanTypeSuccess } = useQueryGetLoanType();

  
    // get evaluation rank
    const [searchAll, setSearchAll] = useState("filter");

    const { mutateAsync: updateEmployeeLoanRecord } = useMutationUpdateEmployeeLoanRecord();

    const {
      data: employeeLoanRecord,
      isSuccess: employeeLoanRecordSuccess,
      isPreviousData,
      refetch,
      isFetched,
    } =
    useQueryGetEmployeeLoanRecord(
        page,
    );


    const dispatch = useDispatch();
    const [record, setRecord] = useState(0);

    useEffect(() => 
    {
      if(
          employeeLoanRecordSuccess &&
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
          
          const employeeLoanRecordData = employeeLoanRecord.data;

          if(employeeLoanRecord?.count)
          {
              setRecord(employeeLoanRecord.count);
          }

          if(employeeLoanRecord)
          {

              const result = employeeLoanRecordData.map((ie) => {

                  queryData.push(ie.emp_id);
                  
                  if(getRankTypeSuccess && getEmployeeListSuccess && getInsuranceTypeSuccess){


                    const employee = getEmployeeList.find(
                      (emp) => emp.data.employeeID === parseInt(ie.emp_id),
                    );

                    const rank = getRankType.data.find(
                      (rank) => rank.rank_id === ie.emp_rank_id,
                    );

                    const department = getDepartmentLists.data.find(
                      (dept) => dept.dept_id === ie?.emp_dept_id,
                    );


                    const loan = getLoanType.data.find(lt => lt.loan_id === ie.loan_id);

                    if(employee && rank && department && loan)
                    {
                        return {
                          emp_loan_id:ie.emp_loan_id,
                          emp_id :employee.data.employee_name,
                          emp_rank_id:rank.rank_desc,
                          emp_dept_id:department?.dept_desc,
                          loan_id : loan.loan_type,
                          loan_amount:ie.loan_amount,
                          loan_request_date:ie.loan_request_date,
                          loan_submittion_date:ie.loan_submittion_date,
                          loan_insurance_person:ie.loan_insurance_person,
                          loan_submited_detail:ie.loan_submited_detail,
                          loan_issued_person:ie.loan_issued_person,
                          reg_date:ie.reg_date,
                          repayment_start_date:ie.repayment_start_date,
                          repayment_end_date:ie.repayment_end_date,
                        }
                    }
                    
                  }
                  
              })

              dispatch(
                update({
                  stateProperty: "loanRecord",
                  data : result,
                }),
              );
          }
        }
    },[
      getEmployeeList,
      getEmployeeListSuccess,
      dispatch,
      employeeLoanRecord,
      employeeLoanRecordSuccess,
      globalFilterValue
    ]);


    const loanRecordList = useSelector(
      (state) => state.transaction.loanRecord,
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
         employeeLoanRecordSuccess
          &&
         getRankTypeSuccess
      ) {
  
        const { data: employee } = getSingleEmployee;
      
        const filterResult = employeeLoanRecord.data.filter(ep => ep.emp_id == employee.employeeID);
        // console.log(employeePayroll);
        const result = filterResult.map((ie) => {

          const rank = getRankType.data.find(
            (rank) => rank.rank_id === ie.emp_rank_id,
          );

          const department = getDepartmentLists.data.find(
            (dept) => dept.dept_id === ie?.emp_dept_id,
          );

          const loan = getLoanType.data.find(lt => lt.loan_id === ie.loan_id);

          // const payRollAccountHead = getPayRollAccountHeadData.data.find((p) => p.account_id === ie.account_id);

          return {
              emp_loan_id:ie.emp_loan_id,
              emp_id :employee.employee_name,
              emp_rank_id:rank.rank_desc,
              emp_dept_id:department?.dept_desc,
              loan_id : loan.loan_type,
              loan_amount:ie.loan_amount,
              loan_request_date:ie.loan_request_date,
              loan_submittion_date:ie.loan_submittion_date,
              loan_insurance_person:ie.loan_insurance_person,
              loan_submited_detail:ie.loan_submited_detail,
              loan_issued_person:ie.loan_issued_person,
              reg_date:ie.reg_date,
              repayment_start_date:ie.repayment_start_date,
              repayment_end_date:ie.repayment_end_date,
            }
        })

        dispatch(
          update({
            stateProperty: "loanRecord",
            data : result,
          }),
        );
      } 
      else if (getSingleEmployeeError) 
      {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "This employee not set department.",
        });
      }

      
    };

    const loanType = useSelector((state) => state.entry.loanType);

    useEffect(() => {
      if (getLoanTypeSuccess) {
        if (!Array.isArray(getLoanType.data)) {
          dispatch(
            entryUpdate({
              stateProperty: "loanType",
              data: [getLoanType.data],
            })
          );
        } else {
          dispatch(
            entryUpdate({
              stateProperty: "loanType",
              data: getLoanType.data,
            })
          );
        }
      }
    }, [dispatch, getLoanTypeSuccess, getLoanType]);



    const dropDownEditor = (options) => {

      // const value = getLeaveType.data.find((lt) => lt.lev_type === options.value);
      const loan = getLoanType.data.find(lt => lt.loan_type === options.value);

      return (
        <Dropdown
          value={loan}
          onChange={(e) => {
            options.editorCallback(e.value?.loan_type);
          }}
          options={loanType}
          optionLabel="loan_type"
          placeholder="ရွေးချယ်ရန်"
        />
      );
    };


    
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

    const allowanceAmount = (options) => {
      return (
          <InputNumber 
              value={options.value} 
              onValueChange={(e) => options.editorCallback(e.value)} 
             />
        );
    };

    // Datatable edit handler
	const onEditHandler = async (e) => {
		
		try {

			const _employeeLoanRecordList = [...loanRecordList];
      console.log("_employeeLoanRecordList",_employeeLoanRecordList);


			const { newData, index } = e;
			console.log("newData",newData);

			const newLoanRecord = loanRecordList.find(
				(dept) => dept.loan_id === newData.loan_id
			);

      console.log("LoanRecord",newLoanRecord);

        
      _employeeLoanRecordList[index] = {
				...newData,
        loan_id : newLoanRecord.loan_id,
				// dept_id: departmentNewData.dept_id,
			};

			await updateEmployeeLoanRecord(
				{
         
          loan_id : newLoanRecord.emp_loan_id,
          emp_loan_id : newData.emp_loan_id,
          loan_amount : newData.loan_amount,
          loan_request_date : newData.loan_request_date,
          loan_submittion_date : newData.loan_submittion_date,
          loan_insurance_person : newData.loan_insurance_person,
          loan_submited_detail : newData.loan_submited_detail,
          loan_issued_person : newData.loan_issued_person,
          reg_date : newData.reg_date,
          repayment_start_date : newData.repayment_start_date,
          repayment_end_date : newData.repayment_end_date,
				},
				{
					onSuccess: async () => {
						try {
							dispatch(
								update({
									stateProperty: "loanRecord",
									data: _employeeLoanRecordList,
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
          <h1 className="text-3xl underline">Record Reports</h1>
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

            // console.log("list",loanRecordList)

          <DataTable
            value={
              loanRecordList
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
            <Column field="emp_loan_id" header="Id" sortable/>

            <Column field="emp_id" header="အမည်" />

            <Column field="emp_rank_id" header="Rank Type" />

            <Column field="emp_dept_id" header="Department" />

            <Column field="loan_id" 
                    header="loan_id"
                    editor={(options) => dropDownEditor(options)}
            />

            <Column field="loan_amount" 
                    header="loan_amount"
                    editor={(options) => 
                      allowanceAmount(options)}  
            />

            <Column field="loan_request_date" 
                    header="loan_request_date"
                    editor={(options) => dateTimeEditor(options)}
            />

            <Column field="loan_submittion_date"
                    header="loan_submittion_date"
                    editor={(options) => dateTimeEditor(options)}
            />

            <Column field="loan_insurance_person" 
                    header="loan_insurance_person" 
                    editor={(options) => 
                      textEditor(options)}  
            />

            <Column field="loan_submited_detail" 
                    header="loan_submited_detail"
                    editor={(options) => 
                      textEditor(options)}  
            />

            <Column field="loan_issued_person" 
                    header="loan_issued_person" 
                    editor={(options) => 
                      textEditor(options)}  
            />

            <Column field="reg_date" 
                    header="reg_date" 
                    editor={(options) => dateTimeEditor(options)}
            />

            <Column field="repayment_start_date" 
                    header="repayment_start_date"
                    editor={(options) => dateTimeEditor(options)}
                    body={(options) =>
                      new Date(options?.repayment_start_date).toString().substring(0, 15)
                    }
            />

            <Column field="repayment_end_date" 
                    header="repayment_end_date"
                    editor={(options) => dateTimeEditor(options)}
                    body={(options) =>
                      new Date(options?.repayment_end_date).toString().substring(0, 15)
                    }
            />
            
             <Column 
                field="reg_date" 
                header="Reg Date"
                editor={(options) => dateTimeEditor(options)}
                body={(options) =>
                  new Date(options?.reg_date).toString().substring(0, 15)
                }
            />
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
