import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    employeeDepartment: [],
    employeeInsurance: [],
    employeeRank: [],
    employeeLeave: [],
    loanRecord: [],
    overtimeActualAttendance: [],
    overtimePlan: [],
    payRoll: [],
};

export const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        create: (state, actions) => {
            return {
                ...state,
                [actions.payload.stateProperty]: [...state[actions.payload.stateProperty], actions.payload.data],
            };
        },

        update: (state, actions) => {
            // if (actions.payload.stateProperty == "employeeDepartment") {

            // Use filter to create a new array with defined elements only
            actions.payload.data = actions.payload.data.filter(element => element !== undefined);

            return {
                ...state,
                [actions.payload.stateProperty]: actions.payload.data,
            };
        },
    },
});

export const { create, update } = transactionSlice.actions;
export default transactionSlice.reducer;
