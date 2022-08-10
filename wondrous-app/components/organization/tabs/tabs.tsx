import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { USER_BOARD_PAGE_TYPES, ADMIN_PAGE_TYPES } from 'utils/constants';
import { Container, StyledTab, StyledTabs, ChildrenWrapper } from './styles';

const Tabs = (props) => {
  const { children, page = 'organization', showMembers = false, withQueries = false } = props;

  const router = useRouter();

  const asPath = withQueries ? router.asPath : router.asPath.split('?')[0];
  const { username, podId } = router.query;
  const entityId = username ?? podId;

  const TAB_LINKS_MAP = {
    [USER_BOARD_PAGE_TYPES.CONTRIBUTOR]: [
      {
        href: '/dashboard',
        label: 'Tasks',
      },
      {
        href: '/dashboard/bounties',
        label: 'Bounties',
      },
      {
        href: '/dashboard/proposals',
        label: 'Proposals',
      },
    ],
    [USER_BOARD_PAGE_TYPES.ADMIN]: [
      {
        href: `/dashboard/admin?boardType=${ADMIN_PAGE_TYPES.memberships.query}`,
        label: 'Membership Requests',
      },
      {
        href: `/dashboard/admin?boardType=${ADMIN_PAGE_TYPES.proposals.query}`,
        label: 'Proposals to review',
      },
      {
        href: `/dashboard/admin?boardType=${ADMIN_PAGE_TYPES.submissions.query}`,
        label: 'Submissions to review',
      },
    ],
    organization: [
      {
        href: `/${page}/${entityId}/boards`,
        label: 'Boards',
      },
      {
        href: `/${page}/${entityId}/docs`,
        label: 'Docs',
      },
      {
        href: `/${page}/${entityId}/activities`,
        label: 'Activity',
      },
      {
        href: `/${page}/${entityId}/analytics`,
        label: 'Analytics',
      },
    ],
    pod: [
      {
        href: `/${page}/${entityId}/boards`,
        label: 'Boards',
      },
      {
        href: `/${page}/${entityId}/docs`,
        label: 'Docs',
      },
      {
        href: `/${page}/${entityId}/activities`,
        label: 'Activity',
      },
      {
        href: `/${page}/${entityId}/analytics`,
        label: 'Analytics',
      },
    ],
  };

  const tabsLinks = TAB_LINKS_MAP[page];

  if (showMembers) {
    tabsLinks.splice(2, 0, { href: `/${page}/${entityId}/members`, label: 'Members' });
  }

  return (
    <Container>
      <StyledTabs
        value={asPath}
        variant="fullWidth"
        style={{
          marginTop: '16px',
        }}
      >
        {tabsLinks.map((tab) => (
          <Link
            // @ts-ignore
            value={tab.href}
            key={tab.href}
            href={tab.href}
            passHref
            shallow
          >
            <StyledTab isActive={tab.href === asPath} label={tab.label} />
          </Link>
        ))}
      </StyledTabs>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </Container>
  );
}

export default Tabs;
