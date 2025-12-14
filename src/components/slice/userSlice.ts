import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  TLoginData,
  TRegisterData,
  loginUserApi,
  registerUserApi,
  getUserApi,
  logoutApi,
  updateUserApi
} from '../../utils/burger-api';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';
import { RootState } from '../../services/store';

type TUserState = {
  isAuthChecked: boolean;
  user: TUser | null;
  loginError: string | null;
  registerError: string | null;
};

const initialState: TUserState = {
  isAuthChecked: false,
  user: null,
  loginError: null,
  registerError: null
};

// --- THUNKS ---

// Регистрация
export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

// Логин
export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

// Получение пользователя
export const getUser = createAsyncThunk<TUser, void>(
  'user/getUser',
  async () => {
    const res = await getUserApi();
    return res.user;
  }
);

// Обновление пользователя
export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

// Выход
export const logout = createAsyncThunk<void, void>('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

// Проверка авторизации
export const checkUserAuth = createAsyncThunk<void, void>(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      try {
        await dispatch(getUser()).unwrap();
      } catch (e) {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  }
);

// --- SLICE ---
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authCheck: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerError = action.error.message!;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.loginError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginError = action.error.message!;
        state.isAuthChecked = true;
      })

      // GET USER
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })

      // UPDATE USER
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })

      // CHECK AUTH (Обязательно завершаем проверку в любом случае)
      .addCase(checkUserAuth.fulfilled, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
      });
  }
});

export const { authCheck } = userSlice.actions;

// --- СЕЛЕКТОРЫ ---
export const getUserSelector = (state: RootState) => state.user.user;

export const getIsAuthSelector = (state: RootState) => !!state.user.user;

export const getIsAuthCheckedSelector = (state: RootState) =>
  state.user.isAuthChecked;

export const getLoginErrorSelector = (state: RootState) =>
  state.user.loginError;

export const getRegisterErrorSelector = (state: RootState) =>
  state.user.registerError;

export default userSlice.reducer;
