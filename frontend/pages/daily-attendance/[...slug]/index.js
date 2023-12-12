import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { useRouter } from "next/router";
import { FilterMatchMode } from "primereact/api";

const record = [
  {
    id: 1,
    code: "123",
    name: "Mg Mg",
    checkIn: "08-00",
    checkOut: "05-00",
  },
  {
    id: 2,
    code: "234",
    name: "Aung Aung",
    checkIn: "08-00",
    checkOut: "05-00",
  },
  {
    id: 3,
    code: "456",
    name: "Kyaw Kyaw",
    checkIn: "08-00",
    checkOut: "05-00",
  },
  {
    id: 4,
    code: "678",
    name: "Zaw Zaw",
    checkIn: "08-00",
    checkOut: "05-00",
  },
  {
    id: 5,
    code: "123",
    name: "Mg Mg",
    checkIn: "08-00",
    checkOut: "05-00",
  },
  {
    id: 6,
    code: "234",
    name: "Aung Aung",
    checkIn: "08-00",
    checkOut: "05-00",
  },
  {
    id: 7,
    code: "456",
    name: "Kyaw Kyaw",
    checkIn: "08-00",
    checkOut: "05-00",
  },
  {
    id: 8,
    code: "678",
    name: "Zaw Zaw",
    checkIn: "08-00",
    checkOut: "05-00",
  },
  {
    id: 9,
    code: "123",
    name: "Mg Mg",
    checkIn: "08-00",
    checkOut: "05-00",
  },
  {
    id: 10,
    code: "234",
    name: "Aung Aung",
    checkIn: "08-00",
    checkOut: "05-00",
  },
  {
    id: 11,
    code: "456",
    name: "Kyaw Kyaw",
    checkIn: "08-00",
    checkOut: "05-00",
  },
  {
    id: 12,
    code: "678",
    name: "Zaw Zaw",
    checkIn: "09-00",
    checkOut: "05-00",
  },
  {
    id: 13,
    code: "123",
    name: "Mg Mg",
    checkIn: "08-00",
    checkOut: "05-00",
  },
  {
    id: 14,
    code: "234",
    name: "Aung Aung",
    checkIn: "08-00",
    checkOut: "05-00",
  },
  {
    id: 15,
    code: "456",
    name: "Kyaw Kyaw",
    checkIn: "08-00",
    checkOut: "05-00",
  },
  {
    id: 16,
    code: "678",
    name: "Zaw Zaw",
    checkIn: "08-00",
    checkOut: "05-00",
  },
  {
    id: 17,
    code: "123",
    name: "Mg Mg",
    checkIn: "08-00",
    checkOut: "05-00",
  },
  {
    id: 18,
    code: "234",
    name: "Aung Aung",
    checkIn: "08-00",
    checkOut: "05-00",
  },
  {
    id: 19,
    code: "456",
    name: "Kyaw Kyaw",
    checkIn: "08-00",
    checkOut: "05-00",
  },
  {
    id: 20,
    code: "678",
    name: "Zaw Zaw",
    checkIn: "08-00",
    checkOut: "05-00",
  },
];

const PermanentStaffAttendance = () => {
  const router = useRouter();

  const { label } = router.query;
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    code: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    checkIn: { value: null, matchMode: FilterMatchMode.CONTAINS },
    checkOut: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    let _filters = { ...filters };
    _filters["global"].value = e.target.value;

    setFilters(_filters);
    setGlobalFilterValue(e.target.value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            placeholder="Search"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
          />
        </span>
      </div>
    );
  };

  return (
    <div className="flex-1">
      <h1 className="text-3xl underline">{label}</h1>
      <div className="card mt-5">
        <DataTable
          value={record}
          className="p-datatable-gridlines"
          rows={10}
          dataKey="id"
          filterDisplay="menu"
          removableSort
          paginator
          globalFilterFields={["code", "name", "checkIn", "checkOut"]}
          filters={filters}
          emptyMessage="Not found"
          header={renderHeader}
        >
          <Column field="code" header="Code" sortable />
          <Column field="name" header="Name" sortable />
          <Column field="checkIn" header="Check In" sortable />
          <Column field="checkOut" header="Check Out" sortable />
        </DataTable>
      </div>
    </div>
  );
};

export default PermanentStaffAttendance;
