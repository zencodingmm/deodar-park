import { configureStore } from "@reduxjs/toolkit";
import entryReducer from "@/features/entry/entrySlice";
import transactionReducer from "@/features/transaction/transactionSlice";
import employeeReducer from "@/features/employee/employeeSlice";
import evaluationReducer from "@/features/evaluation/evaluationSlice";

export const globalState = configureStore({
  reducer: {
    entry: entryReducer,
    evaluation: evaluationReducer,
    transaction: transactionReducer,
    employee: employeeReducer,
  },
});
