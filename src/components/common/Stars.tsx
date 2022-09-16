import classNames from 'classnames';
import React, { InputHTMLAttributes, useState } from 'react';

const RATINGS = ['Bad', 'Meh', 'Good', 'Very Good', 'Masterpiece'];

interface StarProps {
  title: string;
  isActive?: boolean;
  onClick?: () => void;
  onHover?: () => void;
}

const Star: React.FC<StarProps> = ({ title, isActive, onClick, onHover }) => {
  const isInteractive = !!onClick;
  return (
    <div
      className={classNames('h-5 w-5 text-gray-300 dark:text-gray-500', {
        'text-yellow-400 dark:text-yellow-500': isActive,
        'cursor-pointer hover:scale-110': isInteractive,
      })}
      onClick={onClick}
      onMouseEnter={onHover}
    >
      <svg
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{title}</title>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    </div>
  );
};

interface StarsProps {
  activeStar?: number | null;
  onClickStar?: (index: number) => void;
  hoverStar?: number | null;
  onHoverStar?: (index: number) => void;
  onMouseLeave?: () => void;
}

export const Stars: React.FC<StarsProps> = ({
  activeStar,
  onClickStar,
  hoverStar,
  onHoverStar,
  onMouseLeave,
}) => {
  return (
    <div className="flex items-center" onMouseLeave={onMouseLeave}>
      {RATINGS.map((text, index) => {
        let isActive = false;
        if (hoverStar || hoverStar === 0) {
          isActive = hoverStar >= index;
        } else if (activeStar || activeStar === 0) {
          isActive = activeStar >= index;
        }

        return (
          <Star
            key={index}
            isActive={isActive}
            title={text}
            onClick={onClickStar && (() => onClickStar(index))}
            onHover={onHoverStar && (() => onHoverStar(index))}
          />
        );
      })}
    </div>
  );
};

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  setRatingValue?: (n: number) => void;
  defaultRating?: number | null;
}

const StarsInput = React.forwardRef<HTMLInputElement, Props>(
  ({ setRatingValue, defaultRating, ...rest }, ref) => {
    const [initialRating, setInitialRating] = useState(defaultRating);
    const [rating, setRating] = useState(defaultRating);
    if (initialRating !== defaultRating) {
      // in case defaultRating has changed
      setInitialRating(defaultRating);
      setRating(defaultRating);
    }

    const [hoveredStar, setHoveredStar] = useState<number | null>(null);
    const onClickHandler = (newRating: number) => {
      setRating(newRating);
      setRatingValue && setRatingValue(newRating);
    };
    return (
      <div className="flex items-center">
        <input ref={ref} type="number" className="sr-only" {...rest} />
        <Stars
          activeStar={rating ? rating - 1 : null}
          onClickStar={(index) => onClickHandler(index + 1)}
          hoverStar={hoveredStar}
          onHoverStar={setHoveredStar}
          onMouseLeave={() => setHoveredStar(null)}
        />
        <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          4.95 out of 5
        </p>
      </div>
    );
  }
);

StarsInput.displayName = 'StarsInput';

export default StarsInput;