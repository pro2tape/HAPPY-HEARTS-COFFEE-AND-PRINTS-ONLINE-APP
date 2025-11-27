import { MenuData, MenuItem } from '../types';
import { menuData as defaultMenuData } from '../data/menuData';

const STORAGE_KEY = 'happyHeartsMenuData';

export const getMenuData = (): MenuData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load menu data", e);
  }
  // Return default data if nothing in storage
  return defaultMenuData;
};

export const saveMenuData = (data: MenuData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Dispatch a custom event so hooks can update state
    window.dispatchEvent(new Event('menuDataChanged'));
  } catch (e) {
    console.error("Failed to save menu data (quota likely exceeded)", e);
    alert("Failed to save. Storage might be full, especially if using many high-res images.");
  }
};

export const resetMenuData = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new Event('menuDataChanged'));
    } catch (e) {
        console.error("Failed to reset menu data", e);
    }
}
