import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { ProfileMenuUIProps } from '../ui/profile-menu/type';

type TMenuProps = {
  onLogoutClick: () => void;
};

export const ProfileMenu: FC<TMenuProps> = ({ onLogoutClick }) => {
  const { pathname } = useLocation();

  const handleLogout = () => {
    onLogoutClick();
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
