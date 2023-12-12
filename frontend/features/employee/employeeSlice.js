import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employeeLists: [],
};

export const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    create: (state, actions) => {
      return {
        ...state,
        [actions.payload.stateProperty]: [
          ...state[actions.payload.stateProperty],
          actions.payload.data,
        ],
      };
    },
    update: (state, actions) => {
      return {
        ...state,
        [actions.payload.stateProperty]: actions.payload.data,
      };
    },
  },
});

export const { create, update } = employeeSlice.actions;

export default employeeSlice.reducer;
