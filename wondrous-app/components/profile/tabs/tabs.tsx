import { Tab } from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { StyledTabs } from './styles';

const Tabs = (props) => {
  const { children } = props;

  const router = useRouter();

  const { pathname } = router;
  const { username } = router.query;
  const tabsLinks = [
    {
      href: `/profile/${username}/boards`,
      label: 'Boards',
    },
    {
      href: `/profile/${username}/activities`,
      label: 'Activity',
    },
    {
      href: `/profile/${username}/about`,
      label: 'About',
    },
  ];

  return (
    <div>
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
    </div>
  );
};

export default Tabs;
