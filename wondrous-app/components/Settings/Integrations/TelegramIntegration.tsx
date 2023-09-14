import { Box, Grid, Typography } from '@mui/material';
import GradientHeading from 'components/GradientHeading';
import { UnstyledLink } from 'components/WorkspacePicker/styles';
import { NewTabIcon } from 'components/Icons/taskModalIcons';
import palette from 'theme/palette';
import { CopyContainer, CopyTypography } from 'components/Common/InviteLinkModal/styles';
import CopyIcon from 'components/Icons/copy';
import { useContext, useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { CONNECT_TELEGRAM_BOT } from 'graphql/mutations';
import { getTelegramBotLink } from 'utils/index';
import { ErrorText } from 'components/Common';
import { GroupInput, TelegramBotInfo, TelegramLabel } from './styles';
import ConnectionContext from './Helpers/ConnectionContext';

const TelegramIntegration = () => {
  const { data, setData } = useContext(ConnectionContext);
  const { tgError } = data;

  const tgLink = getTelegramBotLink();

  return (
    <Grid display="flex" direction="column" gap="12px">
      <GradientHeading fontSize={16}>Setup instructions</GradientHeading>
      <Grid display="flex" gap="12px">
        <Box display="flex" flexDirection="column" gap="12px" width="100%" flex="1">
          <TelegramLabel>Link WonderBot</TelegramLabel>
          <UnstyledLink href={tgLink} target="__blank">
            <Grid
              display="flex"
              gap="8px"
              alignItems="center"
              bgcolor={palette.grey920}
              borderRadius="6px"
              padding="6px 10px 6px 8px"
              height="32px"
              width="100%"
            >
              <TelegramBotInfo>@wonderverse_bot</TelegramBotInfo>
              <NewTabIcon />
            </Grid>
          </UnstyledLink>
        </Box>
        <Box display="flex" flexDirection="column" gap="12px" width="100%" flex="1">
          <TelegramLabel>Group ID</TelegramLabel>
          <Grid display="flex" gap="14px" alignItems="center">
            <Grid
              display="flex"
              gap="8px"
              alignItems="center"
              bgcolor={palette.grey920}
              borderRadius="6px"
              padding="6px 10px 6px 8px"
              height="32px"
              width="100%"
            >
              <GroupInput type="number" onChange={(e) => setData((prev) => ({ ...prev, tgValue: e.target.value }))} />
            </Grid>
          </Grid>
        </Box>
      </Grid>
      {tgError ? <ErrorText>{tgError}</ErrorText> : null}
    </Grid>
  );
};

export default TelegramIntegration;
