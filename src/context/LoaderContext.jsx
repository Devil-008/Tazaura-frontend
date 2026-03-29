import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const LoaderContext = createContext();

export function LoaderProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const countRef = useRef(0); // track concurrent requests

  const showLoader = useCallback(() => {
    countRef.current += 1;
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    countRef.current = Math.max(0, countRef.current - 1);
    if (countRef.current === 0) setIsLoading(false);
  }, []);

  // Listen global events dispatched by Axios interceptor
  useEffect(() => {
    const handler = (e) => {
      if (e.detail) showLoader();
      else          hideLoader();
    };
    window.addEventListener('api:loading', handler);
    return () => window.removeEventListener('api:loading', handler);
  }, [showLoader, hideLoader]);

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
}

export const useLoader = () => useContext(LoaderContext);
