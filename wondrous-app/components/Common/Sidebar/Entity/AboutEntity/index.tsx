import { ButtonBase } from '@mui/material';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useBoards } from 'utils/hooks';

import EntityMenu from './EntityMenu';
import InviteButton from './InviteButton';
import PrivacyIcon from './PrivacyIcon';
import TokenGatingIcon from './TokenGatingIcon';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 12px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Settings = styled(ButtonBase)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px;
    width: 70px;
    height: 28px;
    background: #313131;
    border-radius: 6px;
    font-family: 'Space Grotesk';
    font-weight: 500;
    font-size: 14px;
    color: #ffffff;
    :hover {
      background: #707070;
      filter: drop-shadow(0px 6px 14px rgba(0, 0, 0, 0.5));
    }
  }
`;

const AboutEntity = () => {
  const router = useRouter();
  const { board } = useBoards();
  if (!(board?.orgData || board?.pod)) return null;
  const { privacyLevel, id, name, thumbnailPicture, profilePicture } = board.orgData || board.pod;
  const handleOnClickSettings = () =>
    router.push(board.orgData ? `/organization/settings/${id}/general` : `/pod/settings/${id}/general`);
  return (
    <Wrapper>
      <EntityMenu
        name={name}
        id={id}
        router={router}
        thumbnailPicture={thumbnailPicture}
        profilePicture={profilePicture}
      />
      <ButtonWrapper>
        <Settings onClick={handleOnClickSettings}>Settings</Settings>
        <PrivacyIcon privacyLevel={privacyLevel} />
        <TokenGatingIcon orgId={id} />
        <InviteButton id={id} />
      </ButtonWrapper>
    </Wrapper>
  );
};

export default AboutEntity;
