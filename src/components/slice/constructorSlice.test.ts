import {
  constructorBurgerSlice,
  addIngredients,
  deleteIngredient,
  moveIngredient,
  resetConstructor
} from './constructorSlice';

const mockIngredient = {
  _id: '123',
  id: 'test-uuid-1',
  name: 'Био-котлета',
  type: 'main',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 500,
  image: 'img',
  image_mobile: 'img',
  image_large: 'img'
};

const mockBun = {
  ...mockIngredient,
  type: 'bun',
  name: 'Булка',
  id: 'test-bun-id'
};

describe('Тесты для constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  test('Должен вернуть начальное состояние', () => {
    const state = constructorBurgerSlice.reducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });
    expect(state).toEqual(initialState);
  });

  test('Должен добавить ингредиент (addIngredients)', () => {
    const state = constructorBurgerSlice.reducer(
      initialState,
      addIngredients(mockIngredient)
    );
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(mockIngredient);
  });

  test('Должен установить булку (setBun)', () => {
    const { setBun } = constructorBurgerSlice.actions;

    const state = constructorBurgerSlice.reducer(initialState, setBun(mockBun));
    expect(state.bun).toEqual(mockBun);
  });

  test('Должен удалить ингредиент (deleteIngredient)', () => {
    const stateWithItem = {
      bun: null,
      ingredients: [mockIngredient]
    };

    const state = constructorBurgerSlice.reducer(
      stateWithItem,
      deleteIngredient(mockIngredient.id)
    );
    expect(state.ingredients).toHaveLength(0);
  });

  test('Должен переместить ингредиент (moveIngredient)', () => {
    const item1 = { ...mockIngredient, id: '1' };
    const item2 = { ...mockIngredient, id: '2' };
    const item3 = { ...mockIngredient, id: '3' };

    const stateWithItems = {
      bun: null,
      ingredients: [item1, item2, item3]
    };

    const state = constructorBurgerSlice.reducer(
      stateWithItems,
      moveIngredient({ from: 0, to: 2 })
    );

    expect(state.ingredients[0].id).toBe('2');
    expect(state.ingredients[1].id).toBe('3');
    expect(state.ingredients[2].id).toBe('1');
  });
});
