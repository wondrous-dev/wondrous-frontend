import DiamondIcon from 'components/Icons/DiamondIcon';
import { Polygon } from 'components/Icons/chains';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import { TaskMintStatus } from 'utils/constants';
import {
  TaskMintWrapper,
  TaskMintDetails,
  TaskMintDetailsTitle,
  TaskMintDetailsChain,
  TaskMintButtonWrapper,
} from './styles';

const TASK_MINT_BUTTON_STATUS_CONFIG = {
  [TaskMintStatus.NOT_STARTED]: {
    title: 'Turn this task into a NFT',
    label: 'Mint Task',
    disabled: false,
  },
  [TaskMintStatus.IN_PROGRESS]: {
    title: 'Minting in progress',
    label: 'Minting...',
    disabled: true,
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
      <TaskMintButtonWrapper type="button" onClick={onClick} disabled={config.disabled}>
        <DiamondIcon />
        <span>{config.label}</span>
      </TaskMintButtonWrapper>
    </TaskMintWrapper>
  );
};

export default TaskMintButton;
