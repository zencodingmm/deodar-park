import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";

import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const CreateShiftType = () => {
  const [shitType, setShitType] = useState({
    shiftTypeName: "",
    startTime: "",
    endTime: "",
  });
  const toastRef = useRef(null);

  const onSubmitHandler = () => {};

  const onChangeHandler = () => {};

  return (
    <div className="flex-1">
      <Toast ref={toastRef} />
      <h1 className="text-3xl underline">Shift Type</h1>
      <div className="card mt-6">
        <form className="p-fluid fromgrid grid" onSubmit={onSubmitHandler}>
          <div className="field col-12">
            <label htmlFor="shiftTypeName">Shift Type</label>
            <InputText
              id="shiftTypeName"
              type="text"
              name="shiftTypeName"
              value={shitType.shiftTypeName}
              onChange={onChangeHandler}
            />
          </div>

          <div className="field col-12 md:col-6">
            <label htmlFor="startTime">Start Time</label>
            <InputText
              id="startTime"
              type="text"
              name="startTime"
              value={shitType.startTime}
              onChange={onChangeHandler}
            />
          </div>

          <div className="field col-12 md:col-6">
            <label htmlFor="endTime">End Time</label>
            <InputText
              id="shiftTypeName"
              type="text"
              name="shiftTypeName"
              value={shitType.shiftTypeName}
              onChange={onChangeHandler}
            />
          </div>
        </form>

        <div className="col-12 mt-5">
          <DataTable
            value={loans}
            editMode="row"
            paginator
            rows={10}
            removableSort
            showGridlines
            onRowEditComplete={onEditHandler}
            emptyMessage={"ချေးငွေအမျိုးအစားများ သတ်မှတ်ထားခြင်းမရှိပါ။"}
          >
            <Column field="loan_id" header="ID" sortable />
            <Column
              field="loan_type"
              header="ချေးငွေအမျိုးအစား"
              editor={(options) => loanNameEditor(options)}
              sortable
            />
            <Column rowEditor />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default CreateShiftType;
