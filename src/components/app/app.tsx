import React, { FC, useEffect } from 'react';
import {
  BrowserRouter,
  Router,
  Route,
  Routes,
  useNavigate,
  Navigate,
  Outlet,
  useLocation
} from 'react-router-dom';
import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { TModalProps } from '../modal/type';
import { useDispatch } from '../../services/store';

import { Feed } from '@pages';
import { Login } from '@pages';
import { Register } from '@pages';
import { ForgotPassword } from '@pages';
import { ResetPassword } from '@pages';
import { Profile } from '@pages';
import { ProfileOrders } from '@pages';
import { NotFound404 } from '@pages';

import { Modal, OrderInfo } from '@components';
import { IngredientDetails } from '@components';

import { AppHeader } from '@components';
import { getIngredientsApi } from '@api';
import { getIngredients } from '../slice/sliceIngredients';
import { getCookie } from '../../utils/cookie';
import { checkUserAuth } from '../slice/userSlice';
import {
  getIsAuthCheckedSelector,
  getIsAuthSelector
} from '../slice/userSlice';
import { useSelector } from 'react-redux';
import { Preloader } from '@ui';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: TProtectedRouteProps) => {
  const isAuthChecked = useSelector(getIsAuthCheckedSelector);
  const isAuth = useSelector(getIsAuthSelector);
  const location = useLocation();

  // Проверка токена Редуксом
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если пользователь хочет открыть профиль, но не автаризован, оправляем его на /login
  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuth) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  // Если пользователь авторизован, рендерим вес сайт
  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const background = location.state?.background;

  const close = () => {
    navigate(-1);
  };

  useEffect(() => {
    console.log('App загрузился, отправляю запрос за ингредиентами...');
    dispatch(getIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);
  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Блок рендерится если тольк оотрыта модалка*/}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={close}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={close}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='' onClose={close}>
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};
export default App;
