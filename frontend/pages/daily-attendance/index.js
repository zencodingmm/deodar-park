import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const DailyAttendance = () => {
  const router = useRouter();

  const listOfRecord = [
    {
      label: "အမြဲတမ်းဝန်ထမ်းရုံးတက်ဆင်း မှတ်တမ်း",
      to: `${router.route}/permanent-staff-attendance`,
    },
    {
      label: "နေ့စားဝန်ထမ်းရုံးတက်ဆင်း မှတ်တမ်း",
      to: `${router.route}/daily-staff-attendance`,
    },
    { label: "ဌာနအလိုက်ရုံးတက်ဆင်း မှတ်တမ်း", to: "/" },
    { label: "ပျက်ကွက်သူများ မှတ်တမ်း", to: "/" },
    { label: "ပျက်ကွက်သည့်အကြောင်းအရာ မှတ်တမ်း", to: "/" },
    { label: "ကြိုတင်ခွင့်တိုင်သူများ စာရင်း", to: "/" },
    { label: "အကြောင်းမဲ့ပျက်ကွက်သူများ စာရင်း", to: "/" },
    { label: "တာဝန်ဖြင့်ပျက်ကွက်သူများ စာရင်း", to: "/" },
    { label: "တလအတွင်း ရုံးတက်မှန်သူများ စာရင်း", to: "/" },
    { label: "တလအတွင်း ပျက်ကွက်များသူများ စာရင်း", to: "/" },
  ];

  useEffect(() => {
    router.prefetch(`${router.route}/[id]`).catch(err => console.log(err));
  }, [router]);

  return (
    <div className="flex-1">
      <h1 className="text-3xl underline">နေ့စဉ်ရုံးတက်ဆင်းမှတ်တမ်း</h1>
      <div className="w-full grid gap-4 md:column-gap-8 md:gap-6 mt-5">
        {listOfRecord.map((item, index) => {
          return (
            <Link
              href={{ pathname: item.to, query: { label: item.label } }}
              className="col-12 md:col-5 lg:col-3 p-card p-4 cursor-pointer hover:surface-200 flex justify-content-center align-items-center shadow-4"
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

export default DailyAttendance;
