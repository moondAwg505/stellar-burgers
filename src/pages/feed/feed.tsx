import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getFeed,
  getOrdersSelector,
  getOrderRequestSelector
} from '../../components/slice/orderSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispath = useDispatch();
  const orders: TOrder[] = useSelector(getOrdersSelector);
  const lodaing = useSelector(getOrderRequestSelector);

  useEffect(() => {
    if (orders.length === 0) {
      dispath(getFeed());
    }
  }, [dispath]);

  if (lodaing || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => {}} />;
};
