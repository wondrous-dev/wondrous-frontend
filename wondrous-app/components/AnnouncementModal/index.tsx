import Modal from 'components/Modal';
import ReactPlayer from 'react-player';
import { useMe } from 'components/Auth/withAuth';
import { useWonderWeb3 } from 'services/web3';
import { useMutation } from '@apollo/client';
import { CLOSE_MAIN_BANNER } from 'graphql/mutations';
import { GET_LOGGED_IN_USER } from 'graphql/queries';
import { PlayerWrapper } from 'components/Onboarding/VerifyTweet/styles';
import Button from 'components/Button';
import Link from 'next/link';
import { ModalDescriptionText } from './styles';

export default function AnnouncementModal({ open, onClose }) {
  const user = useMe();
  const wonderWeb3 = useWonderWeb3();
  const [closeMainBanner] = useMutation(CLOSE_MAIN_BANNER, {
    onCompleted: () => {
      onClose();
    },
    refetchQueries: [GET_LOGGED_IN_USER],
  });
  const generateTweetInfo = () => {
    if (user?.activeEthAddress) {
      if (wonderWeb3.ensName) {
        // && wonderWeb3.address === user?.activeEthAddress ?
        return `https://twitter.com/intent/tweet?text=gm%20-%20I%E2%80%99m%20reserving%20my%20Orbit%201%20NFT%20as%20a%20contributor%20%40wonderverse_xyz%20%E2%9C%A8%0AENS%3A%20${wonderWeb3.ensName}&in_reply_to=1603833807081066496`;
      }
      return `https://twitter.com/intent/tweet?text=gm%20-%20I%E2%80%99m%20reserving%20my%20Orbit%201%20NFT%20as%20a%20contributor%20%40wonderverse_xyz%20%E2%9C%A8%0A${user?.activeEthAddress}&in_reply_to=1603833807081066496`;
    }
    return `https://twitter.com/intent/tweet?text=gm%20-%20I%E2%80%99m%20reserving%20my%20Orbit%201%20NFT%20as%20a%20contributor%20%40wonderverse_xyz%20%E2%9C%A8%0A&in_reply_to=1603833807081066496`;
  };

  const closeModal = () => {
    closeMainBanner();
    onClose();
  };

  return (
    <Modal
      title="Tweet to get your Orbit 1 NFTT"
      open={open}
      onClose={closeModal}
      maxWidth={500}
      footerLeft={
        <Button color="grey" onClick={closeModal}>
          Close
        </Button>
      }
      footerRight={
        <Link href={generateTweetInfo()} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
          <Button color="primary">Tweet</Button>
        </Link>
      }
    >
      {!user?.activeEthAddress && (
        <ModalDescriptionText>
          If you haven&apos;t connected your wallet, add your address or ENS to the tweet
        </ModalDescriptionText>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <PlayerWrapper>
          <ReactPlayer
            style={{
              height: '100%',
              width: '100%',
            }}
            muted
            playing
            loop
            controls={false}
            url="https://stream.mux.com/TrJJODUH400xzbi00R1t2Pq5ik00zA7MwQ9y59NyU2Ailo.m3u8"
          />
        </PlayerWrapper>
      </div>
    </Modal>
  );
}
