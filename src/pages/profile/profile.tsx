import { ProfileUI } from '@ui-pages';
import { TUser } from '@utils-types';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUserSelector, updateUser } from '../../components/slice/userSlice';
import { logout } from '../../components/slice/userSlice';
import { useNavigate } from 'react-router-dom';

type TFormValue = {
  name: string;
  email: string;
  password: string;
};

export const Profile: FC = () => {
  const user = useSelector(getUserSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userBaseData = {
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  };

  const [formValue, setFormValue] = useState<TFormValue>(userBaseData);

  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [user, navigate]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        // Отправляем пароль, только если он был изменен
        ...(formValue.password && { password: formValue.password })
      })
    );
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();

    setFormValue(userBaseData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      handleLogout={handleLogout}
    />
  );
};
