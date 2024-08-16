import { configureStore } from '@reduxjs/toolkit';
import userInfoReducer from '@/_lib/store/features/userInfo/userInfoSlice';
import surveyTaskReducer from './features/creator/surveyTask/surveyTaskSlice';
import availableTaskReducer from './features/tester/availableTask/availableTaskSlice';
import responseTaskReducer from './features/tester/responseTask/responseTaskSlice';
import historyUserReducer from './features/tester/history/historyTesterSlice';

export const makeStore = () => {

  return configureStore({
    reducer: {
      userInfo: userInfoReducer,
      surveyTask: surveyTaskReducer,
      availableTask: availableTaskReducer,
      responseTask: responseTaskReducer,
      historyUser: historyUserReducer
    },
  });
}
