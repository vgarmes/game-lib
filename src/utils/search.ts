import { useRef, useState } from 'react';
import { useRouter } from 'next/router';

type Timeout = ReturnType<typeof setTimeout>;

export const useSearch = () => {
  const [inputValue, setInputValue] = useState('');
  const [hasParsedInitialQuery, setHasParsedInitialQuery] = useState(false);

  const router = useRouter();
  const isRouterReady = router.isReady;
  const { q } = router.query;

  const timeoutId = useRef<Timeout>();

  const query = typeof q === 'string' ? q : '';

  // sets the initial value of the search bar to the query parameter, if any
  if (!hasParsedInitialQuery && isRouterReady) {
    setHasParsedInitialQuery(true);
    if (query) {
      setInputValue(query);
    }
  }

  const onChangeInputValue = (value: string) => {
    setInputValue(value);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      router.push({
        pathname: router.pathname,
        query: value ? { q: value } : null,
      });
    }, 500);
  };

  return { inputValue, query, isReady: isRouterReady, onChangeInputValue };
};
