import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi, getOrdersApi, TOrder } from '@api';
import { RootState } from 'src/services/store';
import { orderBurgerApi } from '@api';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  currentOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  currentOrder: null,
  isLoading: false,
  error: null
};

// Thunk для получения истроии заказов пользователя
export const getOrders = createAsyncThunk('order/getOrders', async () => {
  const orders = await getOrdersApi();
  return orders;
});

// Thunk для создания нового заказа
export const orderBurger = createAsyncThunk<TOrder, string[]>(
  'order/orderBurger',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

// Thunk используется для получения заказа по номеру
export const getOrder = createAsyncThunk(
  'feed/getOrder',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    }

    //     clearOrderModelData: (state) => {
    //   state.currentOrder = null;
    //   state.orderRequest = false;
    //   state.orderError = null
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentOrder = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload; // Запись данных заказа
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
      })
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload; // Запись массивов заказво в стейт
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Отбка при загрузки истории';
      });
  }
});

// Селекторы
export const getOrdersSelector = (state: RootState) => state.feed.orders;
export const getOrderDataSelector = (state: RootState) =>
  state.feed.currentOrder;
export const { setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;

export const getOrderRequestSelector = (state: RootState) =>
  state.feed.isLoading;
export const getOrderModalDataSelector = (state: RootState) =>
  state.feed.currentOrder;
