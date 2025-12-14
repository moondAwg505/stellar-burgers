import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { RootState } from '../../services/store';

type TContructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};
const initialState: TContructorState = {
  bun: null,
  ingredients: []
};

export const constructorBurgerSlice = createSlice({
  name: 'createburger',
  initialState,
  reducers: {
    addIngredients: (state, action: PayloadAction<TConstructorIngredient>) => {
      const newIngreient = action.payload;
      state.ingredients.push(newIngreient);
    },

    setBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.bun = action.payload;
    },

    // Удаление ингредиента
    deleteIngredient: (state, action: PayloadAction<string>) => {
      action.payload;
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },

    // Перемещение ингредиента с помомщью стрелчек
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;

      const ingredients = [...state.ingredients];

      const [moveItem] = ingredients.splice(from, 1);
      ingredients.splice(to, 0, moveItem);
      state.ingredients = ingredients;
    },

    // Сброс ингредиентов после заказа
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }

  //   selectors: {
  //     getConstructorItemsSelector: (state, RootState) => state.burgerConstructor
  //   }
});

export const {
  addIngredients,
  setBun,
  deleteIngredient,
  moveIngredient,
  resetConstructor
} = constructorBurgerSlice.actions;
export const getConstructorItemsSelector = (state: RootState) =>
  state.burgerConstructor;

// Подсчёт игрнедиентов
export const getIngredientCounts = (
  state: RootState
): Record<string, number> => {
  const counts: Record<string, number> = {};
  const { bun, ingredients } = state.burgerConstructor;

  ingredients.forEach((item) => {
    counts[item._id] = (counts[item._id] || 0) + 1;
  });

  if (bun) {
    counts[bun._id] = 2;
  }

  return counts;
};

export default constructorBurgerSlice.reducer;
