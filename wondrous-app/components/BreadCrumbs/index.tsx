import { Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import palette from 'theme/palette';
import { ENTITIES_TYPES } from 'utils/constants';
import { useGlobalContext } from 'utils/hooks';
import { CollabSelector, OrgSelector, PageType, PodSelector } from './Components';
import { PAGE_TYPES } from './Components/PageType';
import { Container } from './styles';

const ORG_DEFAULT_CONFIG = ['org'];
const COLLAB_DEFAULT_CONFIG = ['collab'];

const PATH_TO_COMPONENT = {
  '/organization/[username]/home': PAGE_TYPES.HOMEPAGE,
  '/organization/[username]/members': PAGE_TYPES.MEMBERS,
  '/organization/[username]/analytics': PAGE_TYPES.LEADERBOARD,
  '/organization/[username]/docs': PAGE_TYPES.DOCUMENTATION,
  '/organization/[username]/grants': ENTITIES_TYPES.GRANT,
  '/organization/[username]/pods': ENTITIES_TYPES.POD,
  '/organization/[username]/collaborations': ENTITIES_TYPES.COLLAB,
  '/organization/[uername]/activities': PAGE_TYPES.ACTIVITIES,
  '/organization/settings/[orgId]/general': PAGE_TYPES.SETTINGS,
  '/organization/settings/[orgId]/wallet': PAGE_TYPES.SETTINGS_CONFIGURE_WALLET,
  '/organization/settings/[orgId]/token-gating': PAGE_TYPES.SETTINGS_TOKEN_GATING,
  '/organization/settings/[orgId]/integrations': PAGE_TYPES.SETTINGS_INTEGRATIONS_SETTINGS,
  '/organization/settings/[orgId]/payment-method': PAGE_TYPES.SETTINGS_PAYMENT_METHOD,
  '/organization/settings/[orgId]/payouts': PAGE_TYPES.SETTINGS_PAYMENT_LEDGER,
  '/organization/settings/[orgId]/members': PAGE_TYPES.SETTINGS_MEMBERS,
  '/organization/settings/[orgId]/roles': PAGE_TYPES.SETTINGS_ROLES,
  '/organization/settings/[orgId]/notifications': PAGE_TYPES.SETTINGS_NOTIFICATIONS,
  '/organization/settings/[orgId]/task-import': PAGE_TYPES.SETTINGS_TASK_IMPORT,
  '/pod/[podId]/analytics': PAGE_TYPES.LEADERBOARD,
  '/pod/[podId]/docs': PAGE_TYPES.DOCUMENTATION,
  '/pod/[podId]/grants': ENTITIES_TYPES.GRANT,
  '/pod/[podId]/members': PAGE_TYPES.MEMBERS,
  '/pod/[podId]/activities': PAGE_TYPES.ACTIVITIES,
  '/pod/settings/[podId]/general': PAGE_TYPES.SETTINGS,
  '/pod/settings/[podId]/wallet': PAGE_TYPES.SETTINGS_CONFIGURE_WALLET,
  '/pod/settings/[podId]/github': PAGE_TYPES.SETTINGS_GITHUB,
  '/pod/settings/[podId]/members': PAGE_TYPES.SETTINGS_MEMBERS,
  '/pod/settings/[podId]/notifications': PAGE_TYPES.SETTINGS_NOTIFICATIONS,
  '/pod/settings/[podId]/payouts': PAGE_TYPES.SETTINGS_PAYMENT_LEDGER,
  '/pod/settings/[podId]/roles': PAGE_TYPES.SETTINGS_ROLES,
  '/pod/settings/[podId]/task-import': PAGE_TYPES.SETTINGS_TASK_IMPORT,
  '/collaboration/[username]/analytics': PAGE_TYPES.LEADERBOARD,
  '/collaboration/[username]/docs': PAGE_TYPES.DOCUMENTATION,
  '/collaboration/[username]/members': PAGE_TYPES.MEMBERS,
  '/collaboration/[username]/activities': PAGE_TYPES.ACTIVITIES,
  '/collaboration/settings/[orgId]/general': PAGE_TYPES.SETTINGS,
  '/collaboration/settings/[orgId]/github': PAGE_TYPES.SETTINGS_GITHUB,
  '/collaboration/settings/[orgId]/integrations': PAGE_TYPES.SETTINGS_INTEGRATIONS_SETTINGS,
  '/collaboration/settings/[orgId]/members': PAGE_TYPES.SETTINGS_MEMBERS,
  '/collaboration/settings/[orgId]/notifications': PAGE_TYPES.SETTINGS_NOTIFICATIONS,
  '/collaboration/settings/[orgId]/payouts': PAGE_TYPES.SETTINGS_PAYMENT_LEDGER,
  '/collaboration/settings/[orgId]/roles': PAGE_TYPES.SETTINGS_ROLES,
  '/collaboration/settings/[orgId]/task-import': PAGE_TYPES.SETTINGS_TASK_IMPORT,
  '/collaboration/settings/[orgId]/wallet': PAGE_TYPES.SETTINGS_CONFIGURE_WALLET,
  '/collaboration/settings/[orgId]/token-gating': PAGE_TYPES.SETTINGS_TOKEN_GATING,
  '/collaboration/settings/[orgId]/payment-method': PAGE_TYPES.SETTINGS_PAYMENT_METHOD,
};

const ITEMS_MAP = {
  org: OrgSelector,
  pod: PodSelector,
  collab: CollabSelector,
  pageType: ({ pageType }) => <PageType pageType={pageType} />,
  entityType: () => <PageType />,
  undefined: () => null,
};

const buildConfig = (pageData, router) => {
  let config = [];
  if (pageData?.orgData) {
    const configToAdd = pageData?.orgData?.shared ? COLLAB_DEFAULT_CONFIG : ORG_DEFAULT_CONFIG;
    config = [...configToAdd];
  }
  if (pageData?.pod) {
    const orgConfig = pageData?.pod?.org?.shared ? COLLAB_DEFAULT_CONFIG : ORG_DEFAULT_CONFIG;
    config = [...orgConfig, 'pod'];
  }
  if (pageData?.entityType) {
    config.push('entityType');
  }

  if (PATH_TO_COMPONENT[router.pathname]) {
    config.push('pageType');
  }
  return config;
};
const useConfig = () => {
  const router = useRouter();

  const { pageData } = useGlobalContext();

  const activePodOrg = useMemo(() => pageData?.pod?.org, [pageData?.pod]);

  const activeOrg = pageData?.orgData;

  const orgOrPodExists = !!activeOrg || !!activePodOrg;

  const config = useMemo(() => {
    if (!orgOrPodExists) return [];
    return buildConfig(pageData, router);
  }, [pageData?.orgData, pageData?.pod, router, pageData?.entityType]);

  return { config };
};

const BreadCrumbs = () => {
  const router = useRouter();

  const { config } = useConfig();

  const pageType = PATH_TO_COMPONENT[router.pathname];
  if (!config?.length) return null;

  return (
    <Container>
      {config.map((item: string, idx) => {
        const Component = ITEMS_MAP[item] || null;
        return (
          <>
            <Component key={idx} pageType={pageType} />
            {idx !== config.length - 1 && <Typography color={palette.grey57}>/</Typography>}
          </>
        );
      })}
    </Container>
  );
};

export default BreadCrumbs;
