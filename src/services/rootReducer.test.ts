import { rootReducer } from './store'; // Импортируем rootReducer (теперь это сработает)
import { initialState as ingredientsInitialState } from '../components/slice/sliceIngredients'; // Проверь пути к слайсам!
import { initialState as feedInitialState } from '../components/slice/orderSlice';
import { initialState as constructorInitialState } from '../components/slice/constructorSlice';
import { initialState as userInitialState } from '../components/slice/userSlice';

describe('Тест rootReducer', () => {
  it('должен вернуть правильное начальное состояние хранилища', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: ingredientsInitialState,
      feed: feedInitialState,
      burgerConstructor: constructorInitialState,
      user: userInitialState
    });
  });
});
