import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useSelector } from 'react-redux';
import {
  loginUser,
  getLoginErrorSelector,
  getIsAuthSelector
} from '../../../slice/userSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../../../services/store';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(getIsAuthSelector);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const error = useSelector(getLoginErrorSelector);

  // Отправление пользователя на страницу профиля после входа/регистрации
  useEffect(() => {
    if (isAuth) {
      navigate('/profile', { replace: true });
    }
  }, [isAuth, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    console.log('Dispatching login...');
    dispatch(
      loginUser({
        email: email,
        password: password
      })
    );
  };

  // Проверка если роут не защищён ProtectedRoute
  if (isAuth) {
    return <Navigate to='/' replace />;
  }

  return (
    <LoginUI
      errorText={error || undefined}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
