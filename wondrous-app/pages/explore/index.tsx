import { withAuth } from 'components/Auth/withAuth';
import React, { useLayoutEffect } from 'react';
import ExploreComponent from '../../components/Explore';
import { useTour } from '@reactour/tour';
const Explore = ({ user }) => {
  const { setIsOpen, setCurrentStep } = useTour();
  useLayoutEffect(() => {
    if (user && !user?.lastCompletedGuide) {
      setCurrentStep(0);
      setIsOpen(true);
    }
  }, [user]);
  return (
    <>
      <ExploreComponent />
    </>
  );
};

export default withAuth(Explore);
