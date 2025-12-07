import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { getIngredientsSelector } from '../slice/sliceIngredients';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const allIngredients = useSelector(getIngredientsSelector);

  const ingredientData = useMemo(
    () => allIngredients.find((ing) => ing._id === id) || null,
    [allIngredients, id]
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
