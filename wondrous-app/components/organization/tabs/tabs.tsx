import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Container, StyledTab, StyledTabs } from './styles';

const Tabs = (props) => {
  const { children, page = 'organization' } = props;

  const router = useRouter();

  const { asPath } = router;
  const { username, podId } = router.query;
  const user = username ?? podId;
  let tabsLinks = [];
  if (page === 'organization') {
    tabsLinks = [
      {
        href: `/${page}/${user}/boards`,
        label: 'Boards',
      },
      {
        href: `/${page}/${user}/docs`,
        label: 'Docs',
      },
      {
        href: `/${page}/${user}/activities`,
        label: 'Activity',
      },
      // {
      //   href: `/${page}/${user}/about`,
      //   label: 'About',
      // },
    ];
  } else if (page === 'pod') {
    tabsLinks = [
      {
        href: `/${page}/${user}/boards`,
        label: 'Boards',
      },
      {
        href: `/${page}/${user}/activities`,
        label: 'Activity',
      },
      // {
      //   href: `/${page}/${user}/about`,
      //   label: 'About',
      // },
    ];
  }

  return (
    <Container>
      <StyledTabs value={asPath} variant={'fullWidth'}>
        {tabsLinks.map((tab) => (
          <Link
            // @ts-ignore
            value={tab.href}
            key={tab.href}
            href={tab.href}
            passHref={true}
          >
            <StyledTab label={tab.label} />
          </Link>
        ))}
      </StyledTabs>
      <div>{children}</div>
    </Container>
  );
};

export default Tabs;
