import { createContext, useContext } from 'react';

export const ProjectOnboardingContext = createContext<any>({});

const useProjectOnboardingContext = () => useContext(ProjectOnboardingContext);

export default useProjectOnboardingContext;
