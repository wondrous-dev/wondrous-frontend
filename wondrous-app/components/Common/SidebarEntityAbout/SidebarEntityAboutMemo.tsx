import { memo, useEffect } from 'react';

import { ButtonWrapper, Wrapper } from 'components/Common/SidebarEntityAbout/styles';
import InviteButton from 'components/Common/SidebarEntityInviteButton';
import EntityMenu from 'components/Common/SidebarEntityMenu';
import SettingsButton from 'components/Common/SidebarEntitySettingsButton';

type Props = {
  name: string;
  id: string;
  thumbnailPicture: string;
  profilePicture: string;
  board: any;
};

const SidebarEntityAboutMemo = ({ name, id, thumbnailPicture, profilePicture, board }: Props) => {
  console.log('-----SidebarEntityAboutMemo:render');

  useEffect(() => {
    console.log('-----SidebarEntityAboutMemo:---->mounted');
    return () => console.log('-----SidebarEntityAboutMemo:<-----unmounted');
  }, []);

  return (
    <Wrapper>
      <EntityMenu name={name} id={id} thumbnailPicture={thumbnailPicture} profilePicture={profilePicture} />
      <ButtonWrapper>
        <SettingsButton board={board} id={id} />
        <InviteButton id={id} />
      </ButtonWrapper>
    </Wrapper>
  );
};

export default memo(SidebarEntityAboutMemo, (prevProps, nextProps) => {
  const areEqual =
    prevProps.name === nextProps.name &&
    prevProps.id === nextProps.id &&
    prevProps.thumbnailPicture === nextProps.thumbnailPicture &&
    prevProps.profilePicture === nextProps.profilePicture &&
    prevProps.board.orgId === nextProps.board.orgId;

  return areEqual;
});
