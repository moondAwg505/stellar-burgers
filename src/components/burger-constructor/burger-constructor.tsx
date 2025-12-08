import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  getConstructorItemsSelector,
  resetConstructor
} from '../slice/constructorSlice';
import {
  clearOrderModalData,
  getOrderModalDataSelector,
  getOrderRequestSelector,
  getOrders,
  orderBurger
} from '../slice/orderSlice';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/cookie';
import { getIsAuthSelector } from '../slice/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = useSelector(getConstructorItemsSelector);
  const orderRequest = useSelector(getOrderRequestSelector);
  const orderModalData = useSelector(getOrderModalDataSelector);
  const isAuth = useSelector(getIsAuthSelector);

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  const onOrderClick = async () => {
    if (!bun || orderRequest) return;
    // Проверка на авторизацию пользовтеля. Пользователь может собрать бургер, но при оформлении заказа его кидает на старницу логина/регистрации
    // const accessToken = getCookie('accessToken');

    if (!isAuth) {
      navigate('/login');
      return;
    }

    if (ingredients.length === 0) {
      console.error('Добавьте хотя бы одну начинку');
      return;
    }

    const ingredientsIds = [bun._id, ...ingredients.map((i) => i._id), bun._id];

    // try {
    //   await dispatch(orderBurger(ingredientsIds)).unwrap();
    //   console.log(
    //     '[BurgerConstructor] Заказ оформлен успешно. Обновляю историю заказов...'
    //   );
    //   dispatch(getOrders());
    // } catch (error) {
    //   console.error(
    //     '[BurgerConstructor Error] Ошибка при оформлении заказа:',
    //     error
    //   );
    // }

    console.log('[Order Dispatch] Отправка заказа с ID:', ingredients);
    dispatch(orderBurger(ingredientsIds));
  };

  const buttonOrderDisable = useMemo(
    () => !bun || ingredients.length === 0,
    [bun, ingredients]
  );

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
    dispatch(resetConstructor());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
