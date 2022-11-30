import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import { Polygon } from 'components/Icons/chains';
import DiamondIcon, { GreenDiamondIcon } from 'components/Icons/DiamondIcon';
import palette from 'theme/palette';
import { TaskMintStatus } from 'utils/constants';
import {
  TaskMintButtonWrapper,
  TaskMintDetails,
  TaskMintDetailsChain,
  TaskMintDetailsTitle,
  TaskMintWrapper,
} from './styles';

const TASK_MINT_BUTTON_STATUS_CONFIG = {
  [TaskMintStatus.NOT_STARTED]: {
    title: 'Turn this task into a NFT',
    label: 'Mint Task',
    disabled: false,
    icon: DiamondIcon,
    hoverColor: 'linear-gradient(180deg, #7427FF 0%, #F2C678 100%)',
  },
  [TaskMintStatus.IN_PROGRESS]: {
    title: 'Minting in progress',
    label: 'Minting...',
    disabled: true,
    icon: DiamondIcon,
    hoverColor: 'linear-gradient(180deg, #7427FF 0%, #F2C678 100%)',
  },
  [TaskMintStatus.COMPLETED]: {
    title: 'This task is on chain',
    label: 'View NFT',
    disabled: false,
    icon: GreenDiamondIcon,
    hoverColor: palette.green30,
    labelColor: palette.green30,
  },
};

const TaskMintButton = ({ onClick, status }) => {
  const config = TASK_MINT_BUTTON_STATUS_CONFIG[status];
  return (
    <TaskMintWrapper>
      <TaskMintDetails>
        <TaskMintDetailsTitle>{config.title}</TaskMintDetailsTitle>
        <TaskMintDetailsChain>
          <ItemButtonIcon>
            <Polygon />
          </ItemButtonIcon>
          Minted on Polygon
        </TaskMintDetailsChain>
      </TaskMintDetails>
      <TaskMintButtonWrapper
        hoverColor={config.hoverColor}
        type="button"
        onClick={onClick}
        disabled={config.disabled}
        labelColor={config.labelColor}
      >
        <config.icon />
        <span>{config.label}</span>
      </TaskMintButtonWrapper>
    </TaskMintWrapper>
  );
};

export default TaskMintButton;
