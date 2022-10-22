import DiamondIcon from 'components/Icons/DiamondIcon';
import { Polygon } from 'components/Icons/chains';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import {
  MintTaskWrapper,
  MintTaskDetails,
  MintTaskDetailsTitle,
  MintTaskDetailsChain,
  MintTaskButtonWrapper,
} from './styles';

const MintTaskButton = ({ onClick }) => (
  <MintTaskWrapper>
    <MintTaskDetails>
      <MintTaskDetailsTitle>Turn this task into a NFT</MintTaskDetailsTitle>
      <MintTaskDetailsChain>
        <ItemButtonIcon>
          <Polygon />
        </ItemButtonIcon>
        Minted on Polygon
      </MintTaskDetailsChain>
    </MintTaskDetails>
    <MintTaskButtonWrapper type="button" onClick={onClick}>
      <DiamondIcon />
      <span>Mint Task</span>
    </MintTaskButtonWrapper>
  </MintTaskWrapper>
);

export default MintTaskButton;
