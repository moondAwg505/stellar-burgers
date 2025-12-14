import ingredientsReducer, { getIngredients } from './sliceIngredients'; // Проверь путь импорта
import { initialState } from './sliceIngredients';

describe('Тесты для ingredientsSlice', () => {
  // const initialState = {
  //   ingredients: [],
  //   isLoading: false,
  //   error: null
  // };
  it('должен вернуть начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  test('Должен менять isLoading на true при getIngredients.pending', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Должен записать данные при getIngredients.fulfilled', () => {
    const mockData = [{ _id: '1', name: 'Булка' }];
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockData
    };

    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockData);
  });

  test('Должен записать ошибку при getIngredients.rejected', () => {
    const errorMsg = 'Ошибка сети';
    const action = {
      type: getIngredients.rejected.type,
      error: { message: errorMsg }
    };

    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });
});
