import { useState } from 'react';
import { useSteps } from 'utils/hooks';
import { GenericArtPanel, GenericSetupLeftWrapper } from '../Shared';
import Category from './Category';
import ProjectLogo from './ProjectLogo';
import Twitter from './Twitter';

const CONFIG = [
  {
    label: 'Project Type',
    title: 'Select your Project Category',
    component: Category,
  },
  {
    label: 'Twitter',
    title: 'Connect your Project Twitter',
    component: Twitter,
  },
  {
    label: 'Logo & Header',
    title: 'Add your Project Logo and Cover Photo',
    component: ProjectLogo,
  },
];

const RightPanel = () => <GenericArtPanel img="/images/project-onboarding/guides-artwork.png" />;

const LeftPanel = () => {
  const { step, nextStep, prevStep } = useSteps();
  const [data, setData] = useState({
    category: '',
    headerPicture: '',
    profilePicture: '',
    description: '',
  });

  const { component: Component, title } = CONFIG[step];

  const STEPS = CONFIG.map(({ label }) => ({ label }));

  return (
    <GenericSetupLeftWrapper handleBackwards={prevStep} steps={STEPS} currentStep={step} index={1} title={title}>
      <Component onClick={nextStep} updateData={setData} data={data} />
    </GenericSetupLeftWrapper>
  );
};

const BasicsSetup = {
  LeftPanel,
  RightPanel,
};

export default BasicsSetup;
