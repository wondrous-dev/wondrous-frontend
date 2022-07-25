import { createContext, useContext } from 'react';

const OnboardingCreateDaoContext = createContext(null);

export const OnboardingCreateDaoProvider = ({ children, value }) => {
  return <OnboardingCreateDaoContext.Provider value={value}>{children}</OnboardingCreateDaoContext.Provider>;
};

export const useOnboardingCreateDaoContext = () => {
  const context = useContext(OnboardingCreateDaoContext);

  if (!context) {
    throw new Error('useOnboardingCreateDaoContext must be used within an OnboardingCreateDaoProvider');
  }

  return context;
};
