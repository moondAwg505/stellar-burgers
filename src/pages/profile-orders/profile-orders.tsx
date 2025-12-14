// src/pages/profile-orders/profile-orders.tsx

import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { logout } from '../../components/slice/userSlice';
import {
  getOrders,
  getOrdersSelector
} from '../../components/slice/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getOrdersSelector);

  useEffect(() => {
    console.log('Запрос истории заказов');
    dispatch(getOrders());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return <ProfileOrdersUI orders={orders} onLogout={handleLogout} />;
};
