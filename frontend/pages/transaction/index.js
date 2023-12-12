import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const TransactionForm = () => {
  const router = useRouter();

  const listOfRecord = [
    {
      label: "Employee Department",
      to: `${router.route}/employee-department`,
    },
    {
      label: "Employee Rank",
      to: `${router.route}/employee-rank`,
    },
    {
      label: "Employee Insurance",
      to: `${router.route}/employee-insurance`,
    },
    {
      label: "Employee Leave",
      to: `${router.route}/employee-leave`,
    },
    {
      label: "Loan Record",
      to: `${router.route}/loan-record`,
    },
    {
      label: "Overtime Plan",
      to: `${router.route}/overtime-plan`,
    },
    {
      label: "Overtime Actual Attendance",
      to: `${router.route}/overtime-actual-attendance`,
    },
    {
      label: "Pay Roll",
      to: `${router.route}/payroll`,
    },
  ];

  useEffect(() => {
    router.prefetch(`${router.route}/[slug]`);
  }, [router]);

  return (
    <div className="flex-1">
      <h1 className="text-3xl underline">Transaction Forms</h1>
      <div className="w-full grid gap-4 md:column-gap-8 md:gap-6 mt-5">
        {listOfRecord.map((item, index) => {
          return (
            <Link
              href={item.to}
              className="col-12 md:col-5 lg:col-3 p-card p-5 cursor-pointer hover:surface-200 flex justify-content-center align-items-center shadow-4"
              key={index}
            >
              <span className="text-lg text-center text-900">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionForm;
