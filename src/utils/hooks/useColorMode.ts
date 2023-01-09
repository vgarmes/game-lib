import { useState, useEffect } from 'react';
import { COLOR_MODE_KEY } from '../../constants';
import { COLOR_MODE } from '../color-mode';

function useColorMode() {
  const [colorMode, rawSetColorMode] = useState<COLOR_MODE>();

  useEffect(() => {
    const initialColorValue = document.body.className as COLOR_MODE;

    rawSetColorMode(initialColorValue);
  }, []);

  function setColorMode(newValue: COLOR_MODE) {
    // Update localStorage
    localStorage.setItem(COLOR_MODE_KEY, newValue);

    // Update properties
    document.body.className = newValue;

    // Update React color-mode state
    rawSetColorMode(newValue);
  }

  return { colorMode, setColorMode };
}

export default useColorMode;
