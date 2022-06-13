import { withAuth } from 'components/Auth/withAuth';
import React, { useState } from 'react';
import ExploreComponent from '../../components/Explore';

const Explore = () => {
  return (
    <>
      <ExploreComponent />
    </>
  );
};

export default withAuth(Explore);
