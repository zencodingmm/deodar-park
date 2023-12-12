import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  evaluation: [],
};

export const evaluationSlice = createSlice({
  name: "evaluation",
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

export const { create, update } = evaluationSlice.actions;

export default evaluationSlice.reducer;
