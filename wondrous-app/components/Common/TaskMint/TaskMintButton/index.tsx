import DiamondIcon from 'components/Icons/DiamondIcon';
import { Polygon } from 'components/Icons/chains';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import {
  TaskMintWrapper,
  TaskMintDetails,
  TaskMintDetailsTitle,
  TaskMintDetailsChain,
  TaskMintButtonWrapper,
} from './styles';

const TaskMintButton = ({ onClick }) => (
  <TaskMintWrapper>
    <TaskMintDetails>
      <TaskMintDetailsTitle>Turn this task into a NFT</TaskMintDetailsTitle>
      <TaskMintDetailsChain>
        <ItemButtonIcon>
          <Polygon />
        </ItemButtonIcon>
        Minted on Polygon
      </TaskMintDetailsChain>
    </TaskMintDetails>
    <TaskMintButtonWrapper type="button" onClick={onClick}>
      <DiamondIcon />
      <span>Mint Task</span>
    </TaskMintButtonWrapper>
  </TaskMintWrapper>
);

export default TaskMintButton;
