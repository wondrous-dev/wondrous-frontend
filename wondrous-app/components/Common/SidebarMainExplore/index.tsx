import { ExploreButton, ExploreIconWrapper } from 'components/Common/SidebarMainExplore/styles';
import SidebarTooltip from 'components/Common/SidebarMainTooltip';
import ExploreIcon from 'components/Icons/Sidebar/explore.svg';
import Link from 'next/link';
import React from 'react';

const ExploreIconButton = ({ isActive = false }) => (
  <SidebarTooltip title="Explore">
    <Link href="/explore" passHref>
      <ExploreButton id="tour-sidebar-explore-top" isActive={isActive}>
        <ExploreIconWrapper isActive={isActive}>
          <ExploreIcon />
        </ExploreIconWrapper>
      </ExploreButton>
    </Link>
  </SidebarTooltip>
);

export default ExploreIconButton;
