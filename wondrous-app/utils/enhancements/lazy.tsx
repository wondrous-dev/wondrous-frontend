import React, { useState, useEffect } from 'react';

interface Load {
  canLoad: boolean;
  onLoad: () => void;
}

const lazy =
  (importFn: () => Promise<any>, Fallback?: any) =>
  ({ canLoad = true, onLoad, ...props }: Load) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [{ Component }, setComponent] = useState<any>({});

    useEffect(() => {
      if (canLoad && !isLoaded) {
        importFn().then(({ default: comp }) => {
          setIsLoaded(true);
          setComponent({ Component: comp });
        });
      }
    }, [canLoad]);

    useEffect(() => {
      if (isLoaded) {
        setTimeout(onLoad);
      }
    }, [isLoaded]);

    if (!Component && Fallback) {
      return <Fallback />;
    }

    return Component ? <Component {...props} /> : null;
  };

export default lazy;
