import orderReducer, { orderBurger, getFeed } from './orderSlice';
import { initialState } from './orderSlice';

describe('Тесты для orderSlice', () => {
  // const initialState = {
  //   orders: [],
  //   total: 0,
  //   totalToday: 0,
  //   currentOrder: null,
  //   isLoading: false,
  //   error: null,
  //   orderRequest: false,
  //   orderError: null
  // };
  it('должен вернуть начальное состояние', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  // Тесты создания заказа

  test('orderBurger.pending: должен включить orderRequest', () => {
    const action = { type: orderBurger.pending.type };
    const state = orderReducer(initialState, action);
    expect(state.orderRequest).toBe(true);
    expect(state.orderError).toBeNull();
  });

  test('orderBurger.fulfilled: должен сохранить currentOrder', () => {
    const mockOrder = { number: 12345, name: 'Бургер' };
    const action = {
      type: orderBurger.fulfilled.type,
      payload: mockOrder
    };
    const state = orderReducer(initialState, action);

    expect(state.orderRequest).toBe(false);
    expect(state.currentOrder).toEqual(mockOrder);
  });

  test('orderBurger.rejected: должен записать ошибку', () => {
    const action = {
      type: orderBurger.rejected.type,
      error: { message: 'Failed' }
    };
    const state = orderReducer(initialState, action);

    expect(state.orderRequest).toBe(false);
    expect(state.orderError).toBe('Failed');
  });

  // Тесты ленты заказов

  test('getFeed.fulfilled: должен записать orders, total, totalToday', () => {
    const mockFeed = {
      orders: [{ number: 1 }, { number: 2 }],
      total: 100,
      totalToday: 10,
      success: true
    };

    const action = {
      type: getFeed.fulfilled.type,
      payload: mockFeed
    };

    const state = orderReducer(initialState, action);

    expect(state.orders).toEqual(mockFeed.orders);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
    expect(state.isLoading).toBe(false);
  });
});
