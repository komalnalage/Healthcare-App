import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, Middleware } from "redux";
import userData from "../Reducers/userData";
import userNewData from '../Reducers/UserNewData'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";

const reducers = combineReducers({
  userData,
  userNewData
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["userData"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
    return middlewares;
  },
});
store.subscribe(() => {
  // console.log("Store", store.getState())
});
const persistor = persistStore(store);
export { store, persistor };
