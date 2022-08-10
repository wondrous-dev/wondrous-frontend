import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Container, StyledTab, StyledTabs, ChildrenWrapper } from './styles';

function Tabs(props) {
  const { children, page = 'organization', showMembers = false } = props;

  const router = useRouter();

  const asPathWithoutQueries = router.asPath.split('?')[0];
  const { username, podId } = router.query;
  const entityId = username ?? podId;
  const tabsLinks = [
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
  ];

  if (showMembers) {
    tabsLinks.splice(2, 0, { href: `/${page}/${entityId}/members`, label: 'Members' });
  }

  return (
    <Container>
      <StyledTabs
        value={asPathWithoutQueries}
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
          >
            <StyledTab isActive={tab.href === asPathWithoutQueries} label={tab.label} />
          </Link>
        ))}
      </StyledTabs>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </Container>
  );
}

export default Tabs;
