import { useState, useEffect } from 'react';
import { MenuData } from '../types';
import { getMenuData } from '../utils/menuStorage';

export const useMenuData = () => {
  const [menu, setMenu] = useState<MenuData>(getMenuData());

  useEffect(() => {
    const handleStorageChange = () => {
      setMenu(getMenuData());
    };

    // Listen for our custom event
    window.addEventListener('menuDataChanged', handleStorageChange);
    
    // Also listen for storage events (cross-tab sync)
    window.addEventListener('storage', (e) => {
        if (e.key === 'happyHeartsMenuData') {
            handleStorageChange();
        }
    });

    return () => {
      window.removeEventListener('menuDataChanged', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return menu;
};
