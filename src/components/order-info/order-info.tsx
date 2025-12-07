import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { useParams } from 'react-router-dom';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useSelector, useDispatch } from '../../services/store';
import { getIngredientsSelector } from '../slice/sliceIngredients';
import {
  getOrderDataSelector,
  getOrder,
  getOrderRequestSelector
} from '../slice/orderSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const orderData = useSelector(getOrderDataSelector);
  const allIngredients = useSelector(getIngredientsSelector);
  const isOrderLoading = useSelector(getOrderRequestSelector);

  // Запрос на сервер при загрузке компонента
  useEffect(() => {
    if (number) {
      dispatch(getOrder(Number(number)));
    }
  }, [dispatch, number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    // Блокируем отображение если нет данных заказа или каталога интгредиентов
    if (!orderData || !allIngredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = allIngredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, allIngredients]);

  if (isOrderLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
