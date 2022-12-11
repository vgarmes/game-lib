import classNames from 'classnames';

interface Props {
  text?: string;
  color?: 'red' | 'green' | 'blue' | 'pink';
}
const Badge: React.FC<Props> = ({ text, color = 'red' }) => {
  return (
    <div
      className={classNames(
        'whitespace-nowrap rounded-xl px-3 py-1 text-xs font-bold',
        {
          'bg-red-400 text-red-900': color === 'red',
          'bg-blue-700 text-blue-100': color === 'blue',
          'bg-green-700 text-green-100': color === 'green',
          'bg-pink-700 text-pink-100': color === 'pink',
        }
      )}
    >
      {text?.toUpperCase()}
    </div>
  );
};

export default Badge;
