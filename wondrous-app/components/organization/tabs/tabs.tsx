import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  USER_BOARD_PAGE_TYPES,
  ORG_MEMBERSHIP_REQUESTS,
  POD_MEMBERSHIP_REQUESTS,
  TASK_STATUS_SUBMISSION_REQUEST,
  TASK_STATUS_PROPOSAL_REQUEST,
  MERIT_CIRCLE_ID,
} from 'utils/constants';
import { useQuery } from '@apollo/client';
import { GET_USER_ORGS } from 'graphql/queries';
import { Container, StyledTab, StyledTabs, ChildrenWrapper } from './styles';

const Tabs = (props) => {
  const { children, page = 'organization', showMembers = false, withQueries = false } = props;

  const router = useRouter();
  const { data: userOrgs } = useQuery(GET_USER_ORGS);

  const onlyHasMeritCircle = userOrgs?.getUserOrgs?.length === 1 && userOrgs?.getUserOrgs[0]?.id === MERIT_CIRCLE_ID;
  const asPath = withQueries ? router.asPath : router.asPath.split('?')[0];
  const { username, podId } = router.query;
  const entityId = username ?? podId;

  const TAB_LINKS_MAP = {
    [USER_BOARD_PAGE_TYPES.CONTRIBUTOR]: onlyHasMeritCircle
      ? [
          {
            href: '/dashboard/proposals',
            label: 'Proposals',
          },
        ]
      : [
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
        href: `/dashboard/admin?boardType=${ORG_MEMBERSHIP_REQUESTS}`,
        label: 'Org member requests',
      },
      {
        href: `/dashboard/admin?boardType=${POD_MEMBERSHIP_REQUESTS}`,
        label: 'Pod member requests',
      },
      {
        href: `/dashboard/admin?boardType=${TASK_STATUS_PROPOSAL_REQUEST}`,
        label: 'Proposals to review',
      },
      {
        href: `/dashboard/admin?boardType=${TASK_STATUS_SUBMISSION_REQUEST}`,
        label: 'Submissions to review',
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
            as={tab.href}
            passHref
            legacyBehavior
            shallow
          >
            <StyledTab isActive={tab.href.includes(asPath)} label={tab.label} />
          </Link>
        ))}
      </StyledTabs>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </Container>
  );
};

export default Tabs;
