import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    taskName: "",
    noOfTester: "",
    noOfQuestions: "",
    age: "",
    gender: "",
    country: "",
    startDate: "",
    endingDate: "",
    instructuions: "",
};

export const surveyTaskSlice = createSlice({
    name: 'surveyTask',
    initialState,
    reducers: {
        addSurveyTask: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { addSurveyTask } = surveyTaskSlice.actions;

export default surveyTaskSlice.reducer;
