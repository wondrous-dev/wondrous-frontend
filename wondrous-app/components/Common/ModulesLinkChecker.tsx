import { Box, Typography } from '@mui/material';
import LinkBrokenIcon from 'components/Icons/linkBroken.svg';
import useQueryModules from 'hooks/modules/useQueryModules';
import { useRouter } from 'next/router';
import React from 'react';
import palette from 'theme/palette';
import { ENTITIES_TYPES } from 'utils/constants';
import { useGlobalContext } from 'utils/hooks';

const ModulesChecker = ({ children }) => {
  const router = useRouter();
  const { query, pathname } = useRouter();
  const { pageData } = useGlobalContext();
  const { org, pod } = pageData || {};
  const orgId = org?.id || pod?.orgId;
  const podId = pod?.id;
  const entity = query?.entity as string;
  const orgUsername = (query?.username as string) || pod?.org?.username;
  const modules = useQueryModules({ orgUsername, orgId, podId });
  const routerPathnameEntity = {
    '/organization/[username]/pods': ENTITIES_TYPES.POD,
    '/organization/[username]/boards': ENTITIES_TYPES.TASK,
    '/organization/[username]/docs': 'document',
    '/organization/[username]/analytics': 'leaderboard',
    '/pod/[podId]/boards': ENTITIES_TYPES.TASK,
    '/pod/[podId]/docs': 'document',
    '/pod/[podId]/analytics': 'leaderboard',
  };
  const pageEntity = entity || routerPathnameEntity[pathname];
  const blockPodAccess = podId && modules?.parentOrgPodModuleStatus === false;
  const shouldSkip = modules?.[pageEntity] === false || blockPodAccess;

  const handleOnClickHome = () => {
    const homeLink = () => {
      if (blockPodAccess) {
        return `/organization/${orgUsername}/home`;
      }
      if (podId) {
        return `/pod/${podId}/home`;
      }
      return `/organization/${orgUsername}/home`;
    };
    router.push(homeLink()).then(() => {
      if (blockPodAccess) {
        router.reload();
      }
    });
  };

  if (modules && shouldSkip) {
    return (
      <Box width="100%" display="flex" justifyContent="center">
        <Box
          marginTop="108px"
          width="480px"
          height="416px"
          bgcolor={palette.grey87}
          borderRadius="12px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          padding="100px"
          gap="18px"
        >
          <Box
            bgcolor={palette.grey940}
            padding="10px"
            borderRadius="16px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="88px"
            height="88px"
          >
            <LinkBrokenIcon />
          </Box>
          <Typography fontSize="20px" fontWeight="700" color={palette.white} textAlign="center">
            This link is no longer active.
          </Typography>
          <Typography color={palette.grey250} fontSize="15px" textAlign="center">
            Please contact your workspace admin if you have any questions.
          </Typography>
          <Box
            onClick={handleOnClickHome}
            sx={{
              cursor: 'pointer',
              bgcolor: palette.highlightPurple,
              color: palette.white,
              padding: '8px 24px',
              borderRadius: '32px',
              fontWeight: '600',
              marginTop: '20px',
            }}
          >
            Project Home
          </Box>
        </Box>
      </Box>
    );
  }

  return children;
};

const ModulesCheckerMemoized = React.memo(ModulesChecker);

export default ModulesCheckerMemoized;
