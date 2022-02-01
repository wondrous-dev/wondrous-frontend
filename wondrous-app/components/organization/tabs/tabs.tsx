import React from 'react';
import { Tab } from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import Boards from '../boards/boards';
import About from '../about/about';

import { StyledTabs } from './styles';

const Container = styled.div`
  width: 100%;
`;

const Tabs = (props) => {
  const { children } = props;

  const router = useRouter();

  const { pathname } = router;
  const { username } = router.query;

  const tabsLinks = [
    {
      href: `/organization/${username}/boards`,
      label: 'Boards',
    },
    {
      href: `/organization/${username}/activities`,
      label: 'Activity',
    },
    {
      href: `/organization/${username}/about`,
      label: 'About',
    },
  ];
  return (
    <Container>
      {/* <StyledTabs value={pathname}>
        {tabsLinks.map((tab) => (
          <Link
            // @ts-ignore
            value={tab.href}
            key={tab.href}
            href={tab.href}
          >
            <a>
              <Tab label={tab.label} />
            </a>
          </Link>
        ))}
      </StyledTabs> */}
      <div>{children}</div>
    </Container>
  );
};

export default Tabs;
