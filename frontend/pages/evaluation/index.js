import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

import { useEmployee } from "@/hooks/useEmployee";
import { useDepartment, useEmployeeDepartment } from "@/hooks/useDepartment";
import { useEmployeeRank, useRank } from "@/hooks/useRank";
import { useEvaluation } from "@/hooks/useEvaluation";

import { create } from "@/features/evaluation/evaluationSlice";
import { useDispatch } from "react-redux";

const EmployeeEvaluation = () => {
  const [evaluation, setEvaluation] = useState({
    emp_id: "",
    emp_name: "",
    emp_rank_id: "",
    emp_rank_desc: "",
    emp_dept_id: "",
    emp_dept_desc: "",
    employment_date: new Date(),
    education: "",
    evaluation_desc: "",
    effort_in_work: "",
    professional_skills: "",
    compliance: "",
    obedience_to_orders: "",
    effort_in_work_mark: "",
    professional_skills_mark: "",
    compliance_mark: "",
    obedience_to_orders_mark: "",
    interest_in_work: null,
    teach_again: null,
    other_evaluation_remark: "",
    approved_person_one_name: "",
    approved_person_one_rank: "",
    approved_person_two_name: "",
    approved_person_two_rank: "",
    approved_person_three_name: "",
    approved_person_three_rank: "",
    eval_reg_date: new Date(),
  });
  const [interestDropdown, setInterestDropdown] = useState(null);
  const [techAgainDropdown, setTechAgainDropdown] = useState(null);
  const toastRef = useRef(null);
  const [queryFetch, setQueryFetch] = useState({ field: null, data: null });

  const dropdownItems = [
    { name: "ရှိ", code: true },
    { name: "မရှိ", code: false },
  ];

  const chooseOneItems = [
    { name: "ရှိ", code: true },
    { name: "မရှိ", code: false },
  ];

  const dispatch = useDispatch();

  // tanstack-query
  const { useEvaluationCreateMutation } = useEvaluation();
  // create
  const { mutateAsync: createEvaluation } = useEvaluationCreateMutation();

  // Employee List
  const { useEmployeeProfileSingleGetQuery } = useEmployee();
  const {
    data: getEmployees,
    isSuccess: getEmployeesSuccess,
    isError: getEmployeesError,
  } = useEmployeeProfileSingleGetQuery({
    field: queryFetch.field,
    data: queryFetch.data,
  });

  // Employee Department
  const { useSingleEmployeeDepartmentGetQuery } = useEmployeeDepartment();
  const {
    data: getEmployeeDepartment,
    isSuccess: getEmployeeDepartmentSuccess,
    isError: getEmployeeDepartmentError,
  } = useSingleEmployeeDepartmentGetQuery({ id: queryFetch.data });

  const { useQueryGetSingleEmployeeRank } = useEmployeeRank();
  const {
    data: getEmployeeRank,
    isSuccess: getEmployeeRankSuccess,
    isError: getEmployeeRankError,
  } = useQueryGetSingleEmployeeRank({ id: queryFetch.data });

  // Department List
  const { useDepartmentGetQuery } = useDepartment();
  const { data: getDepartmentLists, isSuccess: getDepartmentListsSuccess } =
    useDepartmentGetQuery();

  // Rank List
  const { useQueryGetRank } = useRank();
  const { data: getRankLists, isSuccess: getRankListsSuccess } =
    useQueryGetRank();

  const onChangeHandler = (e) => {
    setEvaluation((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const restoreDeaultState = (data) => {
    if (data) {
      setEvaluation({
        emp_id: "",
        emp_name: "",
        emp_rank_id: "",
        emp_rank_desc: "",
        emp_dept_id: "",
        emp_dept_desc: "",
        employment_date: new Date(),
        education: "",
        evaluation_desc: "",
        effort_in_work: "",
        professional_skills: "",
        compliance: "",
        obedience_to_orders: "",
        effort_in_work_mark: "",
        professional_skills_mark: "",
        compliance_mark: "",
        obedience_to_orders_mark: "",
        interest_in_work: null,
        teach_again: null,
        other_evaluation_remark: "",
        approved_person_one_name: "",
        approved_person_one_rank: "",
        approved_person_two_name: "",
        approved_person_two_rank: "",
        approved_person_three_name: "",
        approved_person_three_rank: "",
        eval_reg_date: new Date(),
      });
    } else {
      setEvaluation({
        emp_name: "",
        emp_rank_id: "",
        emp_rank_desc: "",
        emp_dept_id: "",
        emp_dept_desc: "",
        employment_date: new Date(),
        education: "",
        evaluation_desc: "",
        effort_in_work: "",
        professional_skills: "",
        compliance: "",
        obedience_to_orders: "",
        effort_in_work_mark: "",
        professional_skills_mark: "",
        compliance_mark: "",
        obedience_to_orders_mark: "",
        interest_in_work: null,
        teach_again: null,
        other_evaluation_remark: "",
        approved_person_one_name: "",
        approved_person_one_rank: "",
        approved_person_two_name: "",
        approved_person_two_rank: "",
        approved_person_three_name: "",
        approved_person_three_rank: "",
        eval_reg_date: new Date(),
      });
    }
  };

  const onSearchHandler = (id) => {
    setQueryFetch({ field: "id", data: id });
  };

  useEffect(() => {
    if (getEmployeesSuccess) {
      const employee = getEmployees.data;

      if (employee) {
        if (getEmployeeDepartmentSuccess) {
          const employeeDepartment = getEmployeeDepartment.data;

          if (employeeDepartment) {
            if (getDepartmentListsSuccess) {
              const department = getDepartmentLists.data.find(
                (dept) => dept.dept_id === employeeDepartment.dept_id,
              );

              if (getEmployeeRankSuccess) {
                const employeeRank = getEmployeeRank.data;

                if (employeeRank) {
                  if (getRankListsSuccess) {
                    const rank = getRankLists.data.find(
                      (rank) => rank.rank_id === employeeRank.rank_id,
                    );

                    setEvaluation((prevState) => ({
                      ...prevState,
                      emp_id: employee.employeeID,
                      emp_name: employee.employee_name,
                      emp_rank_id: employeeRank.emp_rank_id,
                      emp_rank_desc: rank.rank_desc,
                      emp_dept_id: employeeDepartment.dept_id,
                      emp_dept_desc: department?.dept_desc,
                      education: employee.education,
                      employment_date: new Date(employee.employment_date),
                    }));
                  }
                }
              } else if (getEmployeeRankError) {
                toastRef.current.show({
                  severity: "error",
                  summary: "Error",
                  detail: "This employee have not set rank",
                });
                restoreDeaultState();
              }
            }
          } else {
            toastRef.current.show({
              severity: "error",
              summary: "Error",
              detail: "This employee have not set Department",
            });
            restoreDeaultState();
          }
        } else if (getEmployeeDepartmentError) {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: "This employee have not set Department",
          });
          restoreDeaultState();
        }
      }
    } else if (getEmployeesError) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Employee not found",
      });
    }
  }, [
    getDepartmentLists,
    getEmployeeDepartmentError,
    getEmployeeRankError,
    getEmployeesError,
    getDepartmentListsSuccess,
    getEmployeeDepartment,
    getEmployeeDepartmentSuccess,
    getEmployeeRank,
    getEmployeeRankSuccess,
    getEmployees,
    getEmployeesSuccess,
    getRankLists,
    getRankListsSuccess,
  ]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createEvaluation(
        {
          emp_id: evaluation.emp_id,
          emp_rank_id: evaluation.emp_rank_id,
          evaluation_desc: evaluation.evaluation_desc,
          effort_in_work: evaluation.effort_in_work,
          professional_skills: evaluation.professional_skills,
          compliance: evaluation.compliance,
          obedience_to_orders: evaluation.obedience_to_orders,
          interest_in_work: evaluation.interest_in_work,
          teach_again: evaluation.teach_again,
          other_evaluation_remark: evaluation.other_evaluation_remark,
          approved_person_one_name: evaluation.approved_person_one_name,
          approved_person_one_rank: evaluation.approved_person_one_rank,
          approved_person_two_name: evaluation.approved_person_two_name,
          approved_person_two_rank: evaluation.approved_person_two_rank,
          approved_person_three_name: evaluation.approved_person_three_name,
          approved_person_three_rank: evaluation.approved_person_three_rank,
          eval_reg_date: evaluation.eval_reg_date,
          emp_dept_id: evaluation.emp_dept_id,
          effort_in_work_mark: evaluation.effort_in_work_mark,
          professional_skills_mark: evaluation.professional_skills_mark,
          compliance_mark: evaluation.compliance_mark,
          obedience_to_orders_mark: evaluation.obedience_to_orders_mark,
        },
        {
          onSuccess: () => {
            dispatch(
              create({
                stateProperty: "evaluation",
                data: {
                  ...evaluation,
                  eval_reg_date: evaluation.eval_reg_date.toString(),
                  employment_date: evaluation.employment_date.toString(),
                },
              }),
            );
            restoreDeaultState("submit");
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex-1">
      <Toast ref={toastRef} />
      <h1 className="text-3xl underline">ဝန်ထမ်းအကဲဖြတ်မှု မှတ်တမ်း</h1>
      <div className="col-12">
        <form className="card" onSubmit={submitHandler}>
          <div className="p-fluid formgrid grid">
            <div className="field col-12 lg:col-6">
              <label htmlFor="emp_id">အလုပ်သမားကိုယ်ပိုင်နံပါတ်</label>
              <div className="p-inputgroup">
                <InputText
                  id="emp_id"
                  name="emp_id"
                  value={evaluation.emp_id}
                  type="text"
                  onChange={onChangeHandler}
                />
                <Button
                  className="p-inputgroup-addon"
                  label="Search"
                  type="button"
                  onClick={() => onSearchHandler(evaluation.emp_id)}
                />
              </div>
            </div>
            <div className="field col-12 lg:col-6">
              <label htmlFor="emp_name">အမည်</label>
              <InputText
                id="emp_name"
                name="emp_name"
                value={evaluation.emp_name}
                type="text"
                onChange={onChangeHandler}
              />
            </div>
            <div className="field col-12">
              <label htmlFor="emp_rank_desc">ရာထူး</label>
              <InputText
                id="emp_rank_desc"
                name="emp_rank_desc"
                value={evaluation.emp_rank_desc}
                type="text"
                onChange={onChangeHandler}
              />
            </div>
            <div className="field col-12">
              <label htmlFor="emp_dept_desc">ဌာန</label>
              <InputText
                id="emp_dept_desc"
                name="emp_dept_desc"
                value={evaluation.emp_dept_desc}
                type="text"
                onChange={onChangeHandler}
              />
            </div>
            <div className="field col-12">
              <label htmlFor="employment_date">အလုပ်စတင်ဝင်ရောက်သည့်နေ့</label>
              <Calendar
                showIcon
                inputId="employment_date"
                showButtonBar
                value={evaluation.employment_date}
                onChange={onChangeHandler}
              />
            </div>
            <div className="field col-12">
              <label htmlFor="education">ပညာအရည်အချင်း</label>
              <InputText
                id="education"
                name="education"
                value={evaluation.education}
                type="text"
                onChange={onChangeHandler}
              />
            </div>
            <div className="field col-12">
              <label htmlFor="evaluation_desc">အကဲဖြတ်မှု</label>
              <InputText
                id="evaluation_desc"
                name="evaluation_desc"
                type="text"
                onChange={onChangeHandler}
              />
            </div>

            <div className="field col-12 grid gap-3 md:gap-0">
              <div className="col-12 md:col-3">
                <span>လုပ်ငန်းခွင်ကြိုးစားမှု</span>
              </div>

              <div className="col-12 md:col-2">
                <div className="flex align-items-center gap-3">
                  <RadioButton
                    inputId="effort_in_work1"
                    name="effort_in_work"
                    value="ကောင်း"
                    checked={evaluation.effort_in_work === "ကောင်း"}
                    onChange={onChangeHandler}
                  />
                  <label htmlFor="effort_in_work1">ကောင်း</label>
                </div>
              </div>
              <div className="col-12 md:col-2">
                <div className="flex align-items-center gap-3">
                  <RadioButton
                    inputId="effort_in_work2"
                    name="effort_in_work"
                    value="သင့်"
                    checked={evaluation.effort_in_work === "သင့်"}
                    onChange={onChangeHandler}
                  />
                  <label htmlFor="effort_in_work2">သင့်</label>
                </div>
              </div>
              <div className="col-12 md:col-2">
                <div className="flex align-items-center gap-3">
                  <RadioButton
                    inputId="effort_in_work3"
                    name="effort_in_work"
                    value="ညံ့"
                    checked={evaluation.effort_in_work === "ညံ့"}
                    onChange={onChangeHandler}
                  />
                  <label htmlFor="effort_in_work3">ညံ့</label>
                </div>
              </div>

              <div className="col-12 md:col-3">
                <div className="flex align-items-center gap-3">
                  <InputText
                    type="text"
                    id="effort_in_work_mark"
                    name="effort_in_work_mark"
                    onChange={onChangeHandler}
                  />
                  <label htmlFor="effort_in_work_mark">မှတ်</label>
                </div>
              </div>
            </div>

            <div className="field col-12 grid gap-3 md:gap-0">
              <div className="col-12 md:col-3">
                <span>လုပ်ငန်းခွင်ကျွမ်းကျင်မှု</span>
              </div>

              <div className="col-12 md:col-2">
                <div className="flex align-items-center gap-3">
                  <RadioButton
                    inputId="professional_skills1"
                    name="professional_skills"
                    value="ကောင်း"
                    checked={evaluation.professional_skills === "ကောင်း"}
                    onChange={onChangeHandler}
                  />
                  <label htmlFor="professional_skills1">ကောင်း</label>
                </div>
              </div>
              <div className="col-12 md:col-2">
                <div className="flex align-items-center gap-3">
                  <RadioButton
                    inputId="professional_skills2"
                    name="professional_skills"
                    value="သင့်"
                    checked={evaluation.professional_skills === "သင့်"}
                    onChange={onChangeHandler}
                  />
                  <label htmlFor="professional_skills2">သင့်</label>
                </div>
              </div>
              <div className="col-12 md:col-2">
                <div className="flex align-items-center gap-3">
                  <RadioButton
                    inputId="professional_skills3"
                    name="professional_skills"
                    value="ညံ့"
                    checked={evaluation.professional_skills === "ညံ့"}
                    onChange={onChangeHandler}
                  />
                  <label htmlFor="professional_skills3">ညံ့</label>
                </div>
              </div>

              <div className="col-12 md:col-3">
                <div className="flex align-items-center gap-3">
                  <InputText
                    type="text"
                    id="professional_skills_mark"
                    name="professional_skills_mark"
                    onChange={onChangeHandler}
                  />
                  <label htmlFor="professional_skills_mark">မှတ်</label>
                </div>
              </div>
            </div>

            <div className="field col-12 grid gap-3 md:gap-0">
              <div className="col-12 md:col-3">
                <span>စည်းကမ်းလိုက်နာမှု</span>
              </div>

              <div className="col-12 md:col-2">
                <div className="flex align-items-center gap-3">
                  <RadioButton
                    inputId="compliance1"
                    name="compliance"
                    value="ကောင်း"
                    checked={evaluation.compliance === "ကောင်း"}
                    onChange={onChangeHandler}
                  />
                  <label htmlFor="compliance1">ကောင်း</label>
                </div>
              </div>
              <div className="col-12 md:col-2">
                <div className="flex align-items-center gap-3">
                  <RadioButton
                    inputId="compliance2"
                    name="compliance"
                    value="သင့်"
                    checked={evaluation.compliance === "သင့်"}
                    onChange={onChangeHandler}
                  />
                  <label htmlFor="compliance2">သင့်</label>
                </div>
              </div>
              <div className="col-12 md:col-2">
                <div className="flex align-items-center gap-3">
                  <RadioButton
                    inputId="compliance3"
                    name="compliance"
                    value="ညံ့"
                    checked={evaluation.compliance === "ညံ့"}
                    onChange={onChangeHandler}
                  />
                  <label htmlFor="compliance3">ညံ့</label>
                </div>
              </div>

              <div className="col-12 md:col-3">
                <div className="flex align-items-center gap-3">
                  <InputText
                    id="compliance_mark"
                    name="compliance_mark"
                    type="text"
                    onChange={onChangeHandler}
                  />
                  <label htmlFor="compliance_mark">မှတ်</label>
                </div>
              </div>
            </div>

            <div className="field col-12 grid gap-3 md:gap-0">
              <div className="col-12 md:col-3">
                <span>အမိန့်နာခံမှု</span>
              </div>

              <div className="col-12 md:col-2">
                <div className="flex align-items-center gap-3">
                  <RadioButton
                    inputId="obedience_to_orders1"
                    name="obedience_to_orders"
                    value="ကောင်း"
                    checked={evaluation.obedience_to_orders === "ကောင်း"}
                    onChange={onChangeHandler}
                  />
                  <label htmlFor="obedience_to_orders1">ကောင်း</label>
                </div>
              </div>
              <div className="col-12 md:col-2">
                <div className="flex align-items-center gap-3">
                  <RadioButton
                    inputId="obedience_to_orders2"
                    name="obedience_to_orders"
                    value="သင့်"
                    checked={evaluation.obedience_to_orders === "သင့်"}
                    onChange={onChangeHandler}
                  />
                  <label htmlFor="obedience_to_orders2">သင့်</label>
                </div>
              </div>
              <div className="col-12 md:col-2">
                <div className="flex align-items-center gap-3">
                  <RadioButton
                    inputId="obedience_to_orders3"
                    name="obedience_to_orders"
                    value="ညံ့"
                    checked={evaluation.obedience_to_orders === "ညံ့"}
                    onChange={onChangeHandler}
                  />
                  <label htmlFor="obedience_to_orders3">ညံ့</label>
                </div>
              </div>

              <div className="col-12 md:col-3">
                <div className="flex align-items-center gap-3">
                  <InputText
                    type="text"
                    id="obedience_to_orders_mark"
                    name="obedience_to_orders_mark"
                    onChange={onChangeHandler}
                  />
                  <label htmlFor="obedience_to_orders_mark">မှတ်</label>
                </div>
              </div>
            </div>

            <div className="field col-12">
              <label htmlFor="interest_in_work">
                လုပ်ငန်းအပေါ် စိတ်ဝင်စားမှု ရှိ/မရှိ
              </label>
              <Dropdown
                inputId="interest_in_work"
                name="interest_in_work"
                value={interestDropdown}
                onChange={(e) => {
                  setInterestDropdown(e.value);
                  setEvaluation((prevState) => ({
                    ...prevState,
                    interest_in_work: e.value.code,
                  }));
                }}
                options={dropdownItems}
                optionLabel="name"
                placeholder="ရွေးချယ်ရန်"
              />
            </div>

            <div className="field col-12">
              <label htmlFor="tech_again">
                အလုပ်နှင့်ပတ်သတ်၍ ထပ်မံသင်ကြားပေးရခြင်း ရှိ/မရှိ
              </label>
              <Dropdown
                inputId="tech_again"
                name="tech_again"
                value={techAgainDropdown}
                onChange={(e) => {
                  setTechAgainDropdown(e.value);
                  setEvaluation((prevState) => ({
                    ...prevState,
                    teach_again: e.value.code,
                  }));
                }}
                options={chooseOneItems}
                optionLabel="name"
                placeholder="ရွေးချယ်ရန်"
              />
            </div>

            <div className="field col-12 md:col-12">
              <label htmlFor="other_evaluation_remark">
                အခြားဖြည့်စွက်လိုသည့် အကြောင်းအရာများရှိပါက ဖြည့်စွက်ဖော်ပြရန်။
              </label>
              <InputTextarea
                id="other_evaluation_remark"
                name="other_evaluation_remark"
                rows="4"
                autoResize
                onChange={onChangeHandler}
              />
            </div>

            <div className="field col-12 card py-3">
              <span>အာမခံပေးသောသူ - ၁</span>

              <div className="md:flex">
                <div className="field col-12 md:col-6">
                  <label htmlFor="approved_person_one_name">အမည်</label>
                  <InputText
                    id="approved_person_one_name"
                    name="approved_person_one_name"
                    value={evaluation.approved_person_one_name}
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="field col-12 md:col-6">
                  <label htmlFor="approved_person_one_rank">ရာထူး</label>
                  <InputText
                    id="approved_person_one_rank"
                    name="approved_person_one_rank"
                    value={evaluation.approved_person_one_rank}
                    onChange={onChangeHandler}
                  />
                </div>
              </div>
            </div>

            <div className="field col-12 card py-3">
              <span>အာမခံပေးသောသူ - ၂</span>

              <div className="md:flex">
                <div className="field col-12 md:col-6">
                  <label htmlFor="approved_person_two_name">အမည်</label>
                  <InputText
                    id="approved_person_two_name"
                    name="approved_person_two_name"
                    value={evaluation.approved_person_two_name}
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="field col-12 md:col-6">
                  <label htmlFor="approved_person_two_rank">ရာထူး</label>
                  <InputText
                    id="approved_person_two_rank"
                    name="approved_person_two_rank"
                    value={evaluation.approved_person_two_rank}
                    onChange={onChangeHandler}
                  />
                </div>
              </div>
            </div>

            <div className="field col-12 card py-3">
              <span>အာမခံပေးသောသူ - ၃</span>

              <div className="md:flex">
                <div className="field col-12 md:col-6">
                  <label htmlFor="approved_person_three_name">အမည်</label>
                  <InputText
                    id="approved_person_three_name"
                    name="approved_person_three_name"
                    value={evaluation.approved_person_three_name}
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="field col-12 md:col-6">
                  <label htmlFor="approved_person_three_rank">ရာထူး</label>
                  <InputText
                    id="approved_person_three_rank"
                    name="approved_person_three_rank"
                    value={evaluation.approved_person_three_rank}
                    onChange={onChangeHandler}
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex justify-content-end px-8 my-5">
              <div>
                <Button label="Submit" type="submit" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EmployeeEvaluation;
