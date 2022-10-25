import { useLazyQuery } from '@apollo/client';
import GitHubIcon from '@mui/icons-material/GitHub';
import { logout, useMe } from 'components/Auth/withAuth';
import BackButton from 'components/Common/SidebarBackButton';
import CollapseExpandButton from 'components/Common/SidebarCollapseButton';
import Item from 'components/Common/SidebarItem';
import {
  ArchivedPodIndicatorText,
  SettingsChildrenWrapper,
  SettingsDaoPodIndicator,
  SettingsDaoPodIndicatorIconWrapper,
  SettingsDaoPodIndicatorOrgProfile,
  SettingsDaoPodIndicatorText,
} from 'components/Common/SidebarSettings/styles';
import {
  ChildrenWrapper,
  Label,
  ListWrapper,
  SidebarContent,
  SidebarWrapper,
  Wrapper,
} from 'components/Common/SidebarStyles';
import ChooseEntityToCreate from 'components/CreateEntity';
import ExitIcon from 'components/Icons/exit';
import RolesIcon from 'components/Icons/roles';
import FileDownloadIcon from 'components/Icons/Sidebar/fileDownload.svg';
import GroupIcon from 'components/Icons/Sidebar/group.svg';
import HexagonIcon from 'components/Icons/Sidebar/hexagon.svg';
import LoginIcon from 'components/Icons/Sidebar/loginIcon.svg';
import NotificationsIcon from 'components/Icons/Sidebar/notifications.svg';
import PodIcon from 'components/Icons/Sidebar/pods.svg';
import ReceiptIcon from 'components/Icons/Sidebar/receipt.svg';
import { LockIconOutline } from 'components/Icons/userpass';
import WrenchIcon from 'components/Icons/wrench';
import { GET_ORG_BY_ID } from 'graphql/queries/org';
import { GET_POD_BY_ID } from 'graphql/queries/pod';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { SettingsPage } from 'types/common';
import { PERMISSIONS } from 'utils/constants';
import { SettingsBoardContext } from 'utils/contexts';
import { parseUserPermissionContext } from 'utils/helpers';
import { useGlobalContext, useSideBar } from 'utils/hooks';

const createListItems = ({ orgId, podId, mainPath }) => [
  {
    Icon: HexagonIcon,
    label: 'Profile Page Settings',
    value: 'general',
    href: `/profile/settings`,
    page: [SettingsPage.Profile],
  },
  {
    Icon: HexagonIcon,
    label: 'General Settings',
    value: 'general',
    href: orgId ? `/${mainPath}/settings/${orgId}/general` : `/pod/settings/${podId}/general`,
    page: [SettingsPage.Org, SettingsPage.Pod],
  },
  {
    Icon: LoginIcon,
    label: 'Log in Methods',
    value: 'log-in-methods',
    href: `/profile/login-methods`,
    page: [SettingsPage.Profile],
  },
  {
    Icon: WrenchIcon,
    label: 'Configure Wallet',
    value: 'wallet',
    href: orgId ? `/${mainPath}/settings/${orgId}/wallet` : `/pod/settings/${podId}/wallet`,
    page: [SettingsPage.Org, SettingsPage.Pod],
  },
  {
    Icon: LockIconOutline,
    label: 'Token Gating',
    value: 'token-gating',
    href: `/${mainPath}/settings/${orgId}/token-gating`,
    page: [SettingsPage.Org],
  },
  {
    Icon: HexagonIcon, // need icon
    label: 'Integrations Settings',
    value: 'integrations',
    href: orgId ? `/${mainPath}/settings/${orgId}/integrations` : `/pod/settings/${podId}/integrations`,
    page: [SettingsPage.Org],
  },
  {
    Icon: ReceiptIcon,
    label: 'Payments Ledger',
    value: 'payouts',
    href: orgId ? `/${mainPath}/settings/${orgId}/payouts` : `/pod/settings/${podId}/payouts`,
    page: [SettingsPage.Org, SettingsPage.Pod],
  },
  {
    Icon: ReceiptIcon,
    label: 'Payment Method',
    value: 'payment-method',
    href: `/${mainPath}/settings/${orgId}/payment-method`,
    page: [SettingsPage.Org],
  },
  {
    Icon: GroupIcon,
    label: 'Members',
    value: 'members',
    href: orgId ? `/${mainPath}/settings/${orgId}/members` : `/pod/settings/${podId}/members`,
    page: [SettingsPage.Org, SettingsPage.Pod],
  },
  {
    Icon: RolesIcon,
    label: 'Roles',
    value: 'roles',
    href: orgId ? `/${mainPath}/settings/${orgId}/roles` : `/pod/settings/${podId}/roles`,
    page: [SettingsPage.Org, SettingsPage.Pod],
  },
  {
    Icon: NotificationsIcon,
    label: 'Notifications',
    value: 'notifications',
    href: orgId ? `/${mainPath}/settings/${orgId}/notifications` : `/pod/settings/${podId}/notifications`,
    page: [SettingsPage.Org, SettingsPage.Pod],
  },
  {
    Icon: FileDownloadIcon,
    label: 'Task Import',
    value: 'import',
    href: `/${mainPath}/settings/${orgId}/task-import`,
    page: [SettingsPage.Org],
  },
  {
    Icon: NotificationsIcon,
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
    href: orgId ? `/${mainPath}/settings/${orgId}/github` : `/pod/settings/${podId}/github`,
    page: [SettingsPage.Pod],
  },
];

function SettingsWrapper(props) {
  const { children, showPodIcon = true } = props;

  const router = useRouter();
  const user = useMe();
  const { minimized } = useSideBar();
  const { userPermissionsContext } = useGlobalContext();

  const { pathname } = router;
  const { orgId, podId } = router.query;

  const [getOrgById, { data: orgData }] = useLazyQuery(GET_ORG_BY_ID);
  const [getPodById, { data: podData }] = useLazyQuery(GET_POD_BY_ID);

  const org = orgData?.getOrgById;
  const pod = podData?.getPodById;

  const mainPath = org?.shared ? 'collaboration' : 'organization';

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

  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: orgId || pod?.orgId,
    podId,
  });

  // if (
  //   permissions &&
  //   !(
  //     permissions.includes(PERMISSIONS.MANAGE_MEMBER) ||
  //     permissions.includes(PERMISSIONS.FULL_ACCESS) ||
  //     permissions.includes(PERMISSIONS.APPROVE_PAYMENT)
  //   )
  // ) {
  //   if (podId && pod) {
  //     router.push(`/pod/${podId}/boards`, undefined, {
  //       shallow: true,
  //     });
  //   } else if (org) {
  //     router.push(`/${mainPath}/${org?.username}/boards`, undefined, {
  //       shallow: true,
  //     });
  //   }
  // }

  const settingsPageConfig = {
    [String(orgId)]: {
      page: SettingsPage.Org,
      path: `/${mainPath}/${org?.username}/boards`,
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
        userPermissionsContext,
        org,
        pod,
      }}
    >
      <ChooseEntityToCreate />
      <Wrapper>
        <SidebarWrapper minimized={minimized}>
          <SidebarContent>
            <BackButton href={activeSettingsPage?.path} />
            <ListWrapper>
              <Label>{activeSettingsPage.label} Settings</Label>
              <ListWrapper>
                {createListItems({ orgId, podId, mainPath }).map((item) => {
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
                <Item Icon={ExitIcon} onClick={() => logout()}>
                  Log out
                </Item>
              </ListWrapper>
            </ListWrapper>
          </SidebarContent>
          <CollapseExpandButton />
        </SidebarWrapper>

        <ChildrenWrapper minimized={minimized}>
          <SettingsChildrenWrapper>
            <div>
              {showPodIcon ? (
                <SettingsDaoPodIndicator pod={podData?.getPodById?.name}>
                  <SettingsDaoPodIndicatorOrgProfile src={orgData?.getOrgById?.profilePicture} />
                  <SettingsDaoPodIndicatorIconWrapper color={podData?.getPodById.color}>
                    <PodIcon />
                  </SettingsDaoPodIndicatorIconWrapper>
                  <SettingsDaoPodIndicatorText>{podData?.getPodById?.name} Pod</SettingsDaoPodIndicatorText>
                  {podIsArchived && <ArchivedPodIndicatorText>ARCHIVED</ArchivedPodIndicatorText>}
                </SettingsDaoPodIndicator>
              ) : null}
              {children}
            </div>
          </SettingsChildrenWrapper>
        </ChildrenWrapper>
      </Wrapper>
    </SettingsBoardContext.Provider>
  );
}

export default SettingsWrapper;
