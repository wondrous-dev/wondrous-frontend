import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Container, StyledTab, StyledTabs, ChildrenWrapper } from './styles';

const Tabs = (props) => {
  const { children, page = 'organization', showMembers = false } = props;

  const router = useRouter();

  const asPathWithoutQueries = router.asPath.split('?')[0];
  const { username, podId } = router.query;
  const entityId = username ?? podId;

  const TAB_LINKS_MAP = {
    dashboard: [
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

  let tabsLinks = TAB_LINKS_MAP[page];

  if (showMembers) {
    tabsLinks.splice(2, 0, { href: `/${page}/${entityId}/members`, label: 'Members' });
  }

  return (
    <Container>
      <StyledTabs
        value={asPathWithoutQueries}
        variant={'fullWidth'}
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
          >
            <StyledTab isActive={tab.href === asPathWithoutQueries} label={tab.label} />
          </Link>
        ))}
      </StyledTabs>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </Container>
  );
};

export default Tabs;
