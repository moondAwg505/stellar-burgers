import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { NavLink, useLocation } from 'react-router-dom';
import React from 'react';
import styles from '../ui/app-header/app-header.module.css';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeader: FC = () => {
  const location = useLocation();
  const userName = 'Космичекский гость';

  // Определение активна ли иконка
  const getIconType = (path: string): 'primary' | 'secondary' =>
    location.pathname === path ? 'primary' : 'secondary';

  // Был взят компонент AppHeaderUI и обёрнут в <NavLink/>
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {/* Конструктор */}
          <NavLink to='/' end className={styles.link}>
            <BurgerIcon type={getIconType('/')} />
            <p
              className={`text text_type_main-default ml-2 mr-10 ${getIconType('/') === 'secondary' ? 'text_color_inactive' : ''}`}
            >
              Конструктор
            </p>
          </NavLink>

          {/* Лента заказов */}
          <NavLink to='/feed' end className={styles.link}>
            <ListIcon type={getIconType('/feed')} />
            <p
              className={`text text_type_main-default ml-2 ${getIconType('/feed') === 'secondary' ? 'text_color_inactive' : ''}`}
            >
              Лента заказов
            </p>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <Logo className={''} />
        </div>

        {/* Профиль */}
        <NavLink to='/profile' end className={styles.link_position_last}>
          <ProfileIcon type={getIconType('/profile')} />
          <p
            className={`text text_type_main-default ml-2 ${getIconType('/profile') === 'secondary' ? 'text_color_inactive' : ''}`}
          >
            {userName || 'Личный кабинет'}
          </p>
        </NavLink>
      </nav>
    </header>
  );
};
