import { withAuth } from 'components/Auth/withAuth';
import React, { useLayoutEffect, useEffect } from 'react';
import { useTour } from '@reactour/tour';

import TaskActionsProvider from 'utils/providers/TaskActionsProvider';
import ExploreComponent from '../../components/Explore';

function Explore({ user }) {
  const { setIsOpen, setCurrentStep } = useTour();

  useLayoutEffect(() => {
    if (user && !user.lastCompletedGuide) {
      setCurrentStep(0);
      setIsOpen(true);
    }
  }, [user]);

  return (
    <TaskActionsProvider>
      <ExploreComponent />
    </TaskActionsProvider>
  );
}

export default withAuth(Explore);
