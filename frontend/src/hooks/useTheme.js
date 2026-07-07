import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTheme, setTheme } from '@features/ui/uiSlice';

const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('eq_theme', theme);
  }, [theme]);

  const setAppTheme = (newTheme) => {
    dispatch(setTheme(newTheme));
  };

  return { theme, setAppTheme };
};

export default useTheme;
