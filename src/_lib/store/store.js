import { configureStore } from '@reduxjs/toolkit';
import userInfoReducer from '@/_lib/store/features/userInfo/userInfoSlice';
import surveyTaskReducer from './features/creator/surveyTask/surveyTaskSlice';

export const makeStore = () => {

  return configureStore({
    reducer: {
      userInfo: userInfoReducer,
      surveyTask: surveyTaskReducer
    },
  });
}
