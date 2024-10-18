import {useCallback, useRef} from 'react';

const useDebounce = (fn, timeout = 300) => {
  const timeoutRef = useRef(null);
  const handler = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        fn(...args);
      }, timeout);
    },
    [fn, timeout],
  );
  return handler;
};

export default useDebounce;
