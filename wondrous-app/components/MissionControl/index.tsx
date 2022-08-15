import { TodoIcon, InProgressIcon, InReviewIcon, CompletedIcon } from 'components/Icons/statusIcons';
import {
  MissionControlWrapper,
  MissionControlSidebarWrapper,
  MissionControlWidgetsWrapper,
  MissionControlWidgetCard,
  MissionControlWidgetsContainer,
} from './styles';
import MissionControlWorkspaceCard from './WorkspaceCard';

const CARDS_CONFIG = {
  workspace: [
    {
      label: 'Contributor Workspace',
      labelGradient: 'linear-gradient(88.95deg, #F93701 1.8%, #FFD653 35.94%, #00BAFF 66.57%, #06FFA5 93.68%)',
      img: 'https://images.unsplash.com/photo-1660517955652-43820f5723d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=814&q=80',
      stats: [
        {
          icon: TodoIcon,
          count: 42,
          label: 'To-do',
          countGradient: 'linear-gradient(196.76deg, #FFFFFF -48.71%, #F93701 90.48%)',
        },
        {
          icon: InProgressIcon,
          count: 6,
          label: 'In Progress',
          countGradient: 'linear-gradient(180deg, #FFFFFF 0%, #FFD653 100%)',
        },
        {
          icon: InReviewIcon,
          count: 20,
          label: 'In Review',
          countGradient: 'linear-gradient(180deg, #FFFFFF 0%, #00BAFF 100%)',
        },
        {
          icon: CompletedIcon,
          count: 15,
          label: 'Completed',
          countGradient: 'linear-gradient(180deg, #FFFFFF 0%, #06FFA5 100%)',
        },
      ],
    },
    {
      label: 'Operator Workspace',
      labelGradient: 'linear-gradient(88.95deg, #FF6ED8 1.8%, #BD2FFF 35.94%, #00BAFF 66.57%, #06FFA5 93.68%)',
      img: 'https://images.unsplash.com/photo-1660517955652-43820f5723d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=814&q=80',
      stats: [
        {
          icon: TodoIcon,
          count: 42,
          label: 'To-do',
          countGradient: 'linear-gradient(196.76deg, #FFFFFF -48.71%, #F93701 90.48%)',
          url: '/',
        },
        {
          icon: InProgressIcon,
          count: 6,
          label: 'In Progress',
          countGradient: 'linear-gradient(180deg, #FFFFFF 0%, #FFD653 100%)',
          url: '/',
        },
        {
          icon: InReviewIcon,
          count: 20,
          label: 'In Review',
          countGradient: 'linear-gradient(180deg, #FFFFFF 0%, #00BAFF 100%)',
          url: '/',
        },
        {
          icon: CompletedIcon,
          count: 15,
          label: 'Completed',
          countGradient: 'linear-gradient(180deg, #FFFFFF 0%, #06FFA5 100%)',
          url: '/',
        },
      ],
    },
  ],
};

const MissionControl = () => (
  <MissionControlWrapper>
    <MissionControlWidgetsWrapper>
      {CARDS_CONFIG.workspace.map(({ label, labelGradient, img, stats }, idx) => (
        <MissionControlWorkspaceCard key={idx} label={label} labelGradient={labelGradient} img={img} stats={stats} />
      ))}
      <MissionControlWidgetsContainer>
        <MissionControlWidgetCard />
        <MissionControlWidgetCard />
        <MissionControlWidgetCard />
      </MissionControlWidgetsContainer>
    </MissionControlWidgetsWrapper>
    <MissionControlSidebarWrapper />
  </MissionControlWrapper>
);

export default MissionControl;
