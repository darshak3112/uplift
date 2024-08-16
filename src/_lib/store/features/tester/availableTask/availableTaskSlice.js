import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    surveys: [],
    isTaskAvailable: false
};

export const availableTaskSlice = createSlice({
    name: 'availableTask',
    initialState,
    reducers: {
        addAvailableTasks: (state, action) => {
            const existingSurveyIds = new Set(state.surveys.map(survey => survey._id));
            const uniqueSurveys = action.payload.filter(survey => !existingSurveyIds.has(survey._id));
            state.surveys = [...state.surveys, ...uniqueSurveys];
            state.isTaskAvailable = state.surveys.length > 0;
        },
        clearAvailableTask: () => {
            return initialState;
        },
    },
});

export const { addAvailableTasks, clearAvailableTask } = availableTaskSlice.actions;

export default availableTaskSlice.reducer;
