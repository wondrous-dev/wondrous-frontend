import { useBoards } from 'utils/hooks';

import SidebarEntityAboutMemo from './SidebarEntityAboutMemoized';

const AboutEntity = () => {
  const { board } = useBoards();
  const { id, name, thumbnailPicture, profilePicture } = board.orgData || board.pod || {};

  return (
    <SidebarEntityAboutMemo
      id={id}
      board={board}
      name={name}
      thumbnailPicture={thumbnailPicture}
      profilePicture={profilePicture}
    />
  );
};

export default AboutEntity;
