import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import NavigationProgressMemo from './NavigationProgressMemo';

const NavigationProgress = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((prevState) => !prevState);
  };

  useEffect(() => {
    router.events.on('routeChangeStart', toggleVisibility);
    router.events.on('routeChangeComplete', toggleVisibility);
    router.events.on('routeChangeError', toggleVisibility);
    return () => {
      router.events.off('routeChangeStart', toggleVisibility);
      router.events.off('routeChangeError', toggleVisibility);
      router.events.off('routeChangeComplete', toggleVisibility);
    };
  }, []);

  return <NavigationProgressMemo isVisible={isVisible} />;
};

export default NavigationProgress;
