import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const TransactionForm = () => {
  const router = useRouter();

  const listOfRecord = [
    {
      label: "Department Reports",
      to: `${router.route}/department`,
    },
    {
      label: "Rank Reports",
      to: `${router.route}/rank`,
    },
    {
      label: "Insurance Reports",
      to: `${router.route}/insurance`,
    },
    {
      label: "Leave Reports",
      to: `${router.route}/leave`,
    },
    {
      label: "Record Reports",
      to: `${router.route}/loan-record`,
    },
    {
      label: "Overtime Plan Reports",
      to: `${router.route}/overtime-plan`,
    },
    {
      label: "Overtime Actual Attendance Reports",
      to: `${router.route}/overtime-actual-attendance`,
    },
    {
      label: "Pay Roll Reports",
      to: `${router.route}/payroll`,
    },
  ];

  useEffect(() => {
    router.prefetch(`${router.route}/[slug]`);
  }, [router]);

  return (
    <div className="flex-1">
      <h1 className="text-3xl underline">Reports</h1>
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
