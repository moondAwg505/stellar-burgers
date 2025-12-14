import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../components/slice/sliceIngredients';
import feedReducer from '../components/slice/orderSlice';
import constructorReducer from '../components/slice/constructorSlice';
import userSliceReducer from '../components/slice/userSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { useReducer } from 'react';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  burgerConstructor: constructorReducer,
  user: userSliceReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
