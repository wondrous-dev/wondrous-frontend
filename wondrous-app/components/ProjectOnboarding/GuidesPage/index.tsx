import { Grid } from '@mui/material';
import palette from 'theme/palette';
import { GenericArtPanel, GenericLeftWrapper } from '../Shared';
import { TYPES, CONFIG } from '../Shared/constants';
import useProjectOnboardingContext from '../Shared/context';
import { PageLabel, RightSideWrapper } from '../Shared/styles';
import Card from './Card';

const LeftPanel = () => {
  const { setStep } = useProjectOnboardingContext();
  const CARDS = [
    {
      title: 'Set up Project Basics',
      body: 'Add important information and custom branding.',
      artwork: '/images/project-onboarding/basics-setup.png',
      isDue: false,
      onClick: () => setStep(CONFIG.findIndex((item) => item.type === TYPES.BASICS)),
    },
    {
      title: 'Set up Core Workflow',
      body: 'Import tasks, set up project pods, add milestones',
      artwork: '/images/project-onboarding/workflow-setup.png',
      isDue: true,
      onClick: () => setStep(CONFIG.findIndex((item) => item.type === TYPES.WORKFLOW)),
    },
    {
      title: 'Set up Community',
      body: 'Connect your Discord and invite your collaborators.',
      artwork: '/images/project-onboarding/community-setup.png',
      isDue: false,
      onClick: () => setStep(CONFIG.findIndex((item) => item.type === TYPES.WORKFLOW)),
    },
  ];
  return (
    <GenericLeftWrapper>
      <PageLabel fontSize="24px">Guides</PageLabel>
      {CARDS.map(({ title, body, onClick, isDue, artwork }, idx) => (
        <Card key={idx} index={idx + 1} title={title} body={body} onClick={onClick} isDue={isDue} artwork={artwork} />
      ))}
    </GenericLeftWrapper>
  );
};

const RightPanel = () => <GenericArtPanel img="/images/project-onboarding/guides-artwork.png" />;

const GuidesPage = {
  LeftPanel,
  RightPanel,
};

export default GuidesPage;
