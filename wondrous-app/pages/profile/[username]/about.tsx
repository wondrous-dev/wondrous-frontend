import React from 'react';
import { withAuth } from '../../../components/Auth/withAuth';
import About from '../../../components/profile/about/about';

const AboutPage = () => {
  return <About />;
};

export default withAuth(AboutPage);
