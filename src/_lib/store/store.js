import { configureStore } from '@reduxjs/toolkit';
import userInfoReducer from '@/_lib/store/features/userInfo/userInfoSlice'; // Adjust the path according to your project structure

export const makeStore = () => {

  return configureStore({
    reducer: {
      userInfo: userInfoReducer,
    },
  });
}
