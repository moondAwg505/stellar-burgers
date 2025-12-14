import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { TIngredient } from '@utils-types';
import { nanoid } from '@reduxjs/toolkit';
import { addIngredients, setBun } from '../slice/constructorSlice';
import { useDispatch } from 'react-redux';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();

    const dispatch = useDispatch();
    const handleAdd = () => {
      if (!ingredient) return;

      const igredientGeneraidId = {
        ...ingredient,
        id: nanoid()
      };
      if (ingredient.type === 'bun') {
        dispatch(setBun(igredientGeneraidId));
      } else {
        dispatch(addIngredients(igredientGeneraidId));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
