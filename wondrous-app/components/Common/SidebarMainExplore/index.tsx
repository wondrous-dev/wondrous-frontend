import { ExploreButton, ExploreIconWrapper } from 'components/Common/SidebarMainExplore/styles';
import SidebarTooltip from 'components/Common/SidebarMainTooltip';
import ExploreIcon from 'components/Icons/Sidebar/explore.svg';
import Link from 'next/link';
import React from 'react';
import { Badge } from '@mui/material';
import { useHotkey, useHotKeysListener } from 'utils/hooks';
import { HOTKEYS } from 'utils/hotkeyHelper';
import { useRouter } from 'next/router';

const ExploreIconButton = ({ isActive = false }) => {
  const showBadge = useHotkey();
  const router = useRouter();
  useHotKeysListener(HOTKEYS.OPEN_EXPLORE, () => {
    router.push('/explore');
  });
  return (
    <SidebarTooltip title="Explore">
      <Link href="/explore" passHref>
        <ExploreButton id="tour-sidebar-explore-top" isActive={isActive}>
          <Badge badgeContent={HOTKEYS.OPEN_EXPLORE} color="primary" invisible={!showBadge} style={{ zIndex: 999 }}>
            <ExploreIconWrapper isActive={isActive}>
              <ExploreIcon />
            </ExploreIconWrapper>
          </Badge>
        </ExploreButton>
      </Link>
    </SidebarTooltip>
  );
};

export default ExploreIconButton;
