import palette from 'theme/palette';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import { Polygon } from 'components/Icons/chains';
import Divider from 'components/Divider';
import { TaskMintDetailsChain } from '../TaskMintButton/styles';
import MintStepContent from './MintStepContent';

const StartMint = () => (
  <MintStepContent
    title="Mint your task for free"
    img="/images/taskmint/startmint.png"
    body="Carry your proof of work wherever you go"
    description={
      <>
        The minting will only take a moment. We’ll send you a <br /> notification when your NFT hits your wallet.
      </>
    }
  >
    <Divider />
    <TaskMintDetailsChain>
      <ItemButtonIcon bgColor={palette.highlightPurple}>
        <Polygon />
      </ItemButtonIcon>
      Minted on Polygon via Mint Kudos - (Zero gas fees)
    </TaskMintDetailsChain>
  </MintStepContent>
);

export default StartMint;
