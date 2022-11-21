import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import { Typography, CircularProgress } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';
import { CONNECT_NOTION_TO_ORG } from 'graphql/mutations/org';
import { useLazyQuery, useMutation } from '@apollo/client';
import { CallbackBackground, CallbackHeading, CallbackWrapper } from 'components/Common/CallbackWrapper';
import { LINK } from 'utils/constants';
import { CONNECT_NOTION_TO_POD } from 'graphql/mutations';

export default function NotionCallbackPage() {
  const router = useRouter();
  const { code } = router.query;
  const state = router?.query?.state as string;

  const [connectNotionToOrg] = useMutation(CONNECT_NOTION_TO_ORG);
  const [connectNotionToPod] = useMutation(CONNECT_NOTION_TO_POD);

  useEffect(() => {
    if (code && state) {
      const parsedState = JSON.parse(state);
      const orgId = parsedState?.orgId;
      const podId = parsedState?.podId;
      if (podId) {
        connectNotionToPod({
          variables: {
            podId,
            authorizationCode: code,
          },
        }).then(() => {
          const redirectUrl = `${LINK}/pod/settings/${podId}/task-import?notion_connected=true`;
          window.location.href = redirectUrl;
        });
      } else if (orgId) {
        connectNotionToOrg({
          variables: {
            orgId,
            authorizationCode: code,
          },
        }).then(() => {
          const redirectUrl = `${LINK}/organization/settings/${orgId}/task-import?notion_connected=true`;
          window.location.href = redirectUrl;
        });
      }
    }
  }, [code, state]);

  return (
    <>
      <CallbackBackground />
      <CallbackWrapper>
        <CallbackHeading>Connecting Notion Workspace</CallbackHeading>
        <CircularProgress />
      </CallbackWrapper>
    </>
  );
}
