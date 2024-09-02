import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    history: [],
    isHistoryAvailable: false
};

export const historyUserSlice = createSlice({
    name: 'historyUser',
    initialState,
    reducers: {
        addHistoryUser: (state, action) => {
            action.payload.forEach(newTask => {
                const existingTaskIndex = state.history.findIndex(
                    task => task.heading === newTask.heading
                );

                if (existingTaskIndex !== -1) {
                    // Update the existing task if found
                    state.history[existingTaskIndex] = newTask;
                } else {
                    // Add the new task if it doesn't exist
                    state.history.push(newTask);
                }
            });
            state.isHistoryAvailable = true
        },
        clearHistoryUser: () => {
            return initialState
        },
    },
});

export const { addHistoryUser, clearHistoryUser } = historyUserSlice.actions;

export default historyUserSlice.reducer;
