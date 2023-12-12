import React from "react";
import AppMenuitem from "./AppMenuitem";

import { MenuProvider } from "./context/menucontext";

const AppMenu = () => {
	const model = [
		{
			label: "Home",
			items: [
				{
					label: "Dashboard",
					icon: require("@/public/appmenu-images/dashboard.svg"),
					to: "/",
				},
			],
		},
		{
			label: "အချက်အလက်များထည့်သွင်းရန်",
			items: [
				{
					label: "Entry Forms",
					icon: require("@/public/appmenu-images/pos-entry.svg"),
					to: "/entry",
				},
				{
					label: "Transaction Forms",
					icon: require("@/public/appmenu-images/transaction.svg"),
					to: "/transaction",
				},
				{
					label: "အလုပ်သမားကိုယ်ရေးမှတ်တမ်း",
					icon: require("@/public/appmenu-images/personal-data.svg"),
					to: "/profile",
				},
				{
					label: "ဝန်ထမ်းအကဲဖြတ်မှုမှတ်တမ်း",
					icon: require("@/public/appmenu-images/evaluation.svg"),
					to: "/evaluation",
				},
			],
		},
		{
			label: "တင်ပြလွှာများ",
			items: [
				{
					label: "Reports",
					icon: require("@/public/appmenu-images/report.svg"),
					to: "/reports",
				},
				{
					label: "နေ့စဉ်ရုံးတက်ဆင်းမှတ်တမ်း",
					icon: require("@/public/appmenu-images/attendance-management.svg"),
					to: "/daily-attendance",
				},
				{
					label: "အချိန်ပိုဆင်းရန်အုပ်စုများသတ်မှတ်ခြင်း",
					icon: require("@/public/appmenu-images/overtime.svg"),
				},
				{
					label: "အချိန်ပိုဆင်းမှတ်တမ်း",
					icon: require("@/public/appmenu-images/record.svg"),
				},
				{
					label: "ဝန်ထမ်းများ၏အကြွေးစာရင်းမှတ်တမ်း",
					icon: require("@/public/appmenu-images/bill.svg"),
				},
				{
					label: "အမြဲတမ်းဝန်ထမ်းလစာပေးမှုမှတ်တမ်း",
					icon: require("@/public/appmenu-images/salary-expectation.svg"),
				},
				{
					label: "နေ့စားဝန်ထမ်းလစာပေးမှုမှတ်တမ်း",
					icon: require("@/public/appmenu-images/employee-salary.svg"),
				},
				{
					label: "Pay Slip",
					icon: require("@/public/appmenu-images/sales-slip.svg"),
				},
				{
					label: "Setting",
					icon: require("@/public/appmenu-images/settings.svg"),
				},
			],
		},
	];

	return (
		<MenuProvider>
			<ul className="layout-menu">
				{model.map((item, i) => {
					return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={i} /> : <li className="menu-separator"></li>;
				})}
			</ul>
		</MenuProvider>
	);
};

export default AppMenu;
