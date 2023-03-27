import { useOrgBoard } from 'utils/hooks';
import { Container, GenericArtPanel, GenericLeftWrapper } from '../Shared';
import { CONFIG, TYPES } from '../Shared/constants';
import { PageLabel } from '../Shared/styles';
import Card from './Card';

const LeftPanel = () => {
  const { setStep } = useOrgBoard();
  const CARDS = [
    {
      title: 'Set up Project Basics',
      body: 'Add important information and custom branding.',
      artwork: '/images/project-onboarding/basics-setup.png',
      onClick: () => setStep(CONFIG.findIndex((item) => item.type === TYPES.BASICS)),
    },
    {
      title: 'Set up Core Workflow',
      body: 'Import tasks, set up project pods, add milestones',
      artwork: '/images/project-onboarding/workflow-setup.png',
      onClick: () => setStep(CONFIG.findIndex((item) => item.type === TYPES.WORKFLOW)),
    },
    {
      title: 'Set up Community',
      body: 'Connect your Discord and invite your collaborators.',
      artwork: '/images/project-onboarding/community-setup.png',
      onClick: () => setStep(CONFIG.findIndex((item) => item.type === TYPES.COMMUNITY)),
    },
  ];
  return (
    <GenericLeftWrapper>
      <PageLabel fontSize="24px">Guides</PageLabel>
      {CARDS.map(({ title, body, onClick, artwork }, idx) => (
        <Card key={idx} index={idx + 1} title={title} body={body} onClick={onClick} artwork={artwork} />
      ))}
    </GenericLeftWrapper>
  );
};

const RightPanel = () => <GenericArtPanel url="/images/project-onboarding/guides-gif.gif" />;

const GuidesPage = () => (
  <Container>
    <LeftPanel />
    <RightPanel />
  </Container>
);

export default GuidesPage;
