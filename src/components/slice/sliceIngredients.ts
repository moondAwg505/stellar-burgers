import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types';
import { RootState } from '../../services/store';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

// Асинхронная функция для получения данных
export const getIngredients = createAsyncThunk(
  'ngredients/getIngredients',
  async () => {
    const response = await getIngredientsApi();
    console.log('Ответ API в Thunk:', response);
    return response;
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  // selectors: {
  //   getIngredientsSelector: (state) => state.ingredients,
  //   getIngredientsLoadingSelector: (state) => state.isLoading
  // },
  extraReducers: (builder) => {
    builder

      // Отправка запроса на сврвер
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      // Если запрос прошёл успешно
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload; // Получение даных с сервера и отправка их в стор
        console.log('Данные записаны в State:', action.payload);
      })

      // если не прошёл успешно
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
        console.error('Ошибка в слайсе:', state.error);
      });
  }
});

export const getIngredientsSelector = (state: RootState) =>
  state.ingredients.ingredients;

export const getIngredientsLoadingSelector = (state: RootState) =>
  state.ingredients.isLoading;

export default ingredientsSlice.reducer;
