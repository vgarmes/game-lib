import { COLOR_MODE } from '../utils/color-mode';
import useColorMode from '../utils/hooks/useColorMode';
import Icon from './icon';

interface Props {
  invertBackground?: boolean;
}
const ColorModeToggle: React.FC<Props> = ({ invertBackground = false }) => {
  const { colorMode, setColorMode } = useColorMode();
  return (
    <button
      className="relative inline-flex items-center justify-between gap-4 rounded-full bg-muted p-2 transition-colors"
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
