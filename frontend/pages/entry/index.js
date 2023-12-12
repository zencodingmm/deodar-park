import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const EntryForm = () => {
  const router = useRouter();

  const listOfRecord = [
    {
      label: "ဌာနများသတ်မှတ်ခြင်း",
      to: `${router.route}/create-department`,
    },
    {
      label: "အာမခံအမျိုးအစားသတ်မှတ်ခြင်း",
      to: `${router.route}/create-insurance-type`,
    },
    {
      label: "ခွင့်အမျိုးအစားသတ်မှတ်ခြင်း",
      to: `${router.route}/create-leave-type`,
    },
    {
      label: "ချေးငွေအမျိုးအစားသတ်မှတ်ခြင်း",
      to: `${router.route}/create-loan-type`,
    },
    {
      label: "ရာထူး/တာဝန်သတ်မှတ်ခြင်း",
      to: `${router.route}/create-rank`,
    },
    {
      label: "Pay Roll Account Head",
      to: `${router.route}/create-payroll-account-head`,
    },
    {
      label: "ရုံးတက်/ရုံးဆင်းချိိန်သတ်မှတ်ခြင်း",
      to: `${router.route}/create-attendance`,
    },
    {
      label: "Overtime Shift Type",
      to: `${router.route}/create-overtime-shift-type`,
    },
    // {
    //   label: "Shift Type",
    //   to: `${router.route}/create-shift-type`,
    // },
  ];

  useEffect(() => {
    router.prefetch(`${router.route}/[slug]`).catch((err) => console.log(err));
  }, [router]);

  return (
    <div className="flex-1">
      <h1 className="text-3xl underline">Entry Forms</h1>
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

export default EntryForm;
