import { COLOR_MODE } from '../utils/color-mode';
import useColorMode from '../utils/hooks/useColorMode';
import Icon from './icon';

const ColorModeToggle = () => {
  const { colorMode, setColorMode } = useColorMode();
  return (
    <button
      className="relative inline-flex w-12 items-center justify-between rounded-full bg-gray-50 p-1 dark:bg-gray-700"
      onClick={() =>
        setColorMode(
          colorMode === COLOR_MODE.DARK ? COLOR_MODE.LIGHT : COLOR_MODE.DARK
        )
      }
    >
      <Icon
        name="sun"
        className={
          colorMode === COLOR_MODE.LIGHT ? 'text-orange-500' : 'text-inherit'
        }
      />
      <Icon
        name="moon"
        className={
          colorMode === COLOR_MODE.DARK ? 'text-yellow-300' : 'text-inherit'
        }
      />
    </button>
  );
};

export default ColorModeToggle;
