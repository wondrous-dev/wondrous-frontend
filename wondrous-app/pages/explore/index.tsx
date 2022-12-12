import { withAuth } from 'components/Auth/withAuth';
import React, { useLayoutEffect, useEffect } from 'react';
import { useTour } from '@reactour/tour';
import ExploreComponent from '../../components/Explore';

function Explore({ user }) {
  const { setIsOpen, setCurrentStep } = useTour();

  useLayoutEffect(() => {
    if (user && !user.lastCompletedGuide) {
      setCurrentStep(0);
      setIsOpen(true);
    }
  }, [user]);

  return <ExploreComponent />;
}

export default withAuth(Explore);
