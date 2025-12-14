import userReducer, { loginUser, logout } from './userSlice';

describe('Тесты для userSlice', () => {
  const initialState = {
    isAuthChecked: false,
    user: null,
    loginError: null,
    registerError: null
  };

  test('loginUser.fulfilled: должен записать пользователя', () => {
    const mockUser = { email: 'test@test.ru', name: 'Test' };
    const action = {
      type: loginUser.fulfilled.type,
      payload: mockUser
    };

    const state = userReducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  test('loginUser.rejected: должен записать ошибку', () => {
    const action = {
      type: loginUser.rejected.type,
      error: { message: 'Invalid credentials' }
    };

    const state = userReducer(initialState, action);
    expect(state.loginError).toBe('Invalid credentials');
    expect(state.isAuthChecked).toBe(true);
  });

  test('logout.fulfilled: должен удалить пользователя', () => {
    const loggedInState = {
      ...initialState,
      user: { email: 'test', name: 'test' }
    };

    const action = { type: logout.fulfilled.type };
    const state = userReducer(loggedInState, action);

    expect(state.user).toBeNull();
  });
});
