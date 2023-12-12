import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    department: [],
    insuranceType: [],
    leaveType: [],
    loanType: [],
    payRollAccountHead: [],
    rankType: [],
    attendance: [],
    overtimeShiftType: [],
};

export const entrySlice = createSlice({
    name: 'entry',
    initialState,
    reducers: {
        create: (state, actions) => {
            return {
                ...state,
                [actions.payload.stateProperty]: [...state[actions.payload.stateProperty], actions.payload.data],
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

export const { create, update } = entrySlice.actions;

export default entrySlice.reducer;
