import { useLazyQuery, useQuery } from '@apollo/client';
import GitHubIcon from '@mui/icons-material/GitHub';
import { logout, useMe } from 'components/Auth/withAuth';
import ChooseEntityToCreate from 'components/CreateEntity';
import CardIcon from 'components/Icons/card';
import ExitIcon from 'components/Icons/exit';
import GeneralSettingsIcon from 'components/Icons/generalSettings';
import LeftArrowIcon from 'components/Icons/leftArrow';
import MembersIcon from 'components/Icons/members';
import { NotificationOutlineSettings } from 'components/Icons/notifications';
import PodIcon from 'components/Icons/podIcon';
import RolesIcon from 'components/Icons/roles';
import { TaskImportIcon } from 'components/Icons/taskImporticon';
import TokenGatingIcon from 'components/Icons/tokenGating.svg';
import WrenchIcon from 'components/Icons/wrench';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { GET_ORG_BY_ID } from 'graphql/queries/org';
import { GET_POD_BY_ID } from 'graphql/queries/pod';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { SettingsPage } from 'types/common';
import { PERMISSIONS } from 'utils/constants';
import { SettingsBoardContext } from 'utils/contexts';
import { parseUserPermissionContext } from 'utils/helpers';

import Item from '../Common/Item';
import {
  ArchivedPodIndicatorText,
  SettingsContainer,
  SettingsContentBlock,
  SettingsDaoPodIndicator,
  SettingsDaoPodIndicatorIconWrapper,
  SettingsDaoPodIndicatorOrgProfile,
  SettingsDaoPodIndicatorText,
  SettingsSidebar,
  SettingsSidebarContainer,
  SettingsSidebarHeader,
  SettingsSidebarTabsListContainer,
  SettingsSidebarTabsSection,
  SettingsSidebarTabsSectionLabel,
} from './styles';

const createListItems = ({ orgId, podId }) => [
  {
    Icon: () => <GeneralSettingsIcon width={12} height={12} />,
    label: 'Profile Page Settings',
    value: 'general',
    href: `/profile/settings`,
    page: [SettingsPage.Profile],
  },
  {
    Icon: () => <GeneralSettingsIcon width={12} height={12} />,
    label: 'General Settings',
    value: 'general',
    href: orgId ? `/organization/settings/${orgId}/general` : `/pod/settings/${podId}/general`,
    page: [SettingsPage.Org, SettingsPage.Pod],
  },
  {
    Icon: () => <WrenchIcon width={12} height={12} />,
    label: 'Configure Wallet',
    value: 'wallet',
    href: orgId ? `/organization/settings/${orgId}/wallet` : `/pod/settings/${podId}/wallet`,
    page: [SettingsPage.Org, SettingsPage.Pod],
  },
  {
    Icon: TokenGatingIcon,
    label: 'Token Gating',
    value: 'token-gating',
    href: `/organization/settings/${orgId}/token-gating`,
    page: [SettingsPage.Org],
  },
  {
    Icon: () => <GeneralSettingsIcon width={12} height={12} />,
    label: 'Integrations Settings',
    value: 'integrations',
    href: orgId ? `/organization/settings/${orgId}/integrations` : `/pod/settings/${podId}/integrations`,
    page: [SettingsPage.Org],
  },
  {
    Icon: () => <CardIcon width={12} height={12} />,
    label: 'Payments Ledger',
    value: 'payouts',
    href: orgId ? `/organization/settings/${orgId}/payouts` : `/pod/settings/${podId}/payouts`,
    page: [SettingsPage.Org, SettingsPage.Pod],
  },
  {
    Icon: () => <CardIcon width={12} height={12} />,
    label: 'Payment Method',
    value: 'payment-method',
    href: `/organization/settings/${orgId}/payment-method`,
    page: [SettingsPage.Org],
  },
  {
    Icon: () => <MembersIcon />,
    label: 'Members',
    value: 'members',
    href: orgId ? `/organization/settings/${orgId}/members` : `/pod/settings/${podId}/members`,
    page: [SettingsPage.Org, SettingsPage.Pod],
  },
  {
    Icon: () => <RolesIcon />,
    label: 'Roles',
    value: 'roles',
    href: orgId ? `/organization/settings/${orgId}/roles` : `/pod/settings/${podId}/roles`,
    page: [SettingsPage.Org, SettingsPage.Pod],
  },
  {
    Icon: () => <NotificationOutlineSettings />,
    label: 'Notifications',
    value: 'notifications',
    href: orgId ? `/organization/settings/${orgId}/notifications` : `/pod/settings/${podId}/notifications`,
    page: [SettingsPage.Org, SettingsPage.Pod],
  },
  {
    Icon: TaskImportIcon, // need a another icon
    label: 'Task Import',
    value: 'import',
    href: `/organization/settings/${orgId}/task-import`,
    page: [SettingsPage.Org],
  },
  {
    Icon: () => <NotificationOutlineSettings />,
    label: 'Notifications',
    value: 'notifications',
    href: `/profile/notifications`,
    page: [SettingsPage.Profile],
  },
  {
    Icon: () => (
      <GitHubIcon
        style={{
          color: '#525252',
        }}
      />
    ),
    label: 'Github',
    value: 'github',
    href: orgId ? `/organization/settings/${orgId}/github` : `/pod/settings/${podId}/github`,
    page: [SettingsPage.Pod],
  },
];

function SettingsWrapper(props) {
  const { children, showPodIcon = true } = props;

  const router = useRouter();
  const user = useMe();

  const { pathname } = router;
  const { orgId, podId } = router.query;
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const [getOrgById, { data: orgData }] = useLazyQuery(GET_ORG_BY_ID);
  const [getPodById, { data: podData }] = useLazyQuery(GET_POD_BY_ID);

  const org = orgData?.getOrgById;
  const pod = podData?.getPodById;

  const parsedUserPermissionsContext = userPermissionsContext?.getUserPermissionContext
    ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
    : null;

  useEffect(() => {
    if (orgId || org) {
      getOrgById({
        variables: {
          orgId: orgId ?? org,
        },
      });
    }
    if (podId) {
      getPodById({
        variables: {
          podId,
        },
      });
    }
  }, [getOrgById, getPodById, org, orgId, podId]);

  const signOut = () => {
    logout();
  };

  const permissions = parseUserPermissionContext({
    userPermissionsContext: parsedUserPermissionsContext,
    orgId: orgId || pod?.orgId,
    podId,
  });

  if (
    permissions &&
    !(
      permissions.includes(PERMISSIONS.MANAGE_MEMBER) ||
      permissions.includes(PERMISSIONS.FULL_ACCESS) ||
      permissions.includes(PERMISSIONS.APPROVE_PAYMENT)
    )
  ) {
    if (podId && pod) {
      router.push(`/pod/${podId}/boards`, undefined, {
        shallow: true,
      });
    } else if (org) {
      router.push(`/organization/${org?.username}/boards`, undefined, {
        shallow: true,
      });
    }
  }

  const settingsPageConfig = {
    [String(orgId)]: {
      page: SettingsPage.Org,
      path: `/organization/${org?.username}/boards`,
      label: 'DAO',
    },
    [String(podId)]: {
      page: SettingsPage.Pod,
      path: `/pod/${podId}/boards`,
      label: 'Pod',
    },
    '': {
      page: SettingsPage.Profile,
      path: `/profile/${user?.username}/about`,
      label: 'Profile',
    },
  };
  const activeSettingsPage = settingsPageConfig?.[String(podId ?? orgId ?? '')];
  const podIsArchived = !!podData?.getPodById?.archivedAt;
  return (
    <SettingsBoardContext.Provider
      value={{
        userPermissionsContext: parsedUserPermissionsContext,
        org,
        pod,
      }}
    >
      <ChooseEntityToCreate />
      <SettingsContainer>
        <SettingsSidebar>
          <SettingsSidebarContainer>
            <SettingsSidebarHeader>
              <Link href={activeSettingsPage?.path} passHref>
                <Item Icon={LeftArrowIcon}>Back to {activeSettingsPage.label}</Item>
              </Link>
            </SettingsSidebarHeader>
            <SettingsSidebarTabsSection>
              <SettingsSidebarTabsSectionLabel>{activeSettingsPage.label} Settings</SettingsSidebarTabsSectionLabel>
              <SettingsSidebarTabsListContainer>
                {createListItems({ orgId, podId }).map((item) => {
                  if (!item.page?.includes(activeSettingsPage.page)) return null;
                  const { href, Icon, label } = item;
                  const pathnameSplit = pathname.split('/');
                  const hrefSplit = href.split('/');
                  const endPathName = pathnameSplit[pathnameSplit.length - 1];
                  const endHref = hrefSplit[hrefSplit.length - 1];
                  const active = endHref === endPathName;
                  return (
                    <Link key={href} href={href} passHref>
                      <Item key={label} Icon={Icon} isActive={active}>
                        {label}
                      </Item>
                    </Link>
                  );
                })}
                <Item Icon={ExitIcon} onClick={signOut}>
                  Log out
                </Item>
              </SettingsSidebarTabsListContainer>
            </SettingsSidebarTabsSection>
          </SettingsSidebarContainer>
        </SettingsSidebar>

        <SettingsContentBlock>
          {showPodIcon ? (
            <SettingsDaoPodIndicator pod={podData?.getPodById?.name}>
              <SettingsDaoPodIndicatorOrgProfile src={orgData?.getOrgById?.profilePicture} />
              {podData?.getPodById?.profilePicture ? (
                <SettingsDaoPodIndicatorOrgProfile src={podData?.getPodById?.profilePicture} />
              ) : (
                <SettingsDaoPodIndicatorIconWrapper color={podData?.getPodById.color}>
                  <PodIcon />
                </SettingsDaoPodIndicatorIconWrapper>
              )}
              <SettingsDaoPodIndicatorText>{podData?.getPodById?.name} Pod</SettingsDaoPodIndicatorText>
              {podIsArchived && <ArchivedPodIndicatorText>ARCHIVED</ArchivedPodIndicatorText>}
            </SettingsDaoPodIndicator>
          ) : null}
          {children}
        </SettingsContentBlock>
      </SettingsContainer>
    </SettingsBoardContext.Provider>
  );
}

export default SettingsWrapper;
