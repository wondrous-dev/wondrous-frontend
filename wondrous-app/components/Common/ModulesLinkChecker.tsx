import { Box, Typography } from '@mui/material';
import LinkBrokenIcon from 'components/Icons/linkBroken.svg';
import useQueryModules from 'hooks/modules/useQueryModules';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import palette from 'theme/palette';
import { ENTITIES_TYPES } from 'utils/constants';
import { useGetOrgFromUsername } from 'utils/hooks';

const ModulesChecker = ({ children }) => {
  const { query, pathname } = useRouter();
  const { username, entity } = query;
  const org = useGetOrgFromUsername(username);
  const modules = useQueryModules({ orgId: org?.id });
  const routerPathnameToCheck = {
    [`/organization/[username]/boards?entity=${entity}`]: entity as string,
    '/organization/[username]/pods': ENTITIES_TYPES.POD,
    '/organization/[username]/boards': ENTITIES_TYPES.TASK,
    '/organization/[username]/docs': 'document',
    '/organization/[username]/analytics': 'leaderboard',
  };
  const routerPathnameLink = entity ? `${pathname}?entity=${entity}` : pathname;
  const routerPathnameEntity = routerPathnameToCheck[routerPathnameLink];
  const shouldSkip = modules?.[routerPathnameEntity] === false;

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
          <Link
            href={`/organization/${username}/home`}
            passHref
            style={{
              textDecoration: 'none',
            }}
          >
            <Box
              sx={{
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
          </Link>
        </Box>
      </Box>
    );
  }

  return children;
};

const ModulesCheckerMemoized = React.memo(ModulesChecker);

export default ModulesCheckerMemoized;
