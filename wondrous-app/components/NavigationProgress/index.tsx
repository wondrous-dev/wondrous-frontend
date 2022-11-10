import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ProgressBarWrapper, ProgressBarInner } from './styles';

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

  return (
    <ProgressBarWrapper key={`progress-nav-${isVisible}`}>
      <ProgressBarInner isVisible={isVisible} />
    </ProgressBarWrapper>
  );
};

export default NavigationProgress;
