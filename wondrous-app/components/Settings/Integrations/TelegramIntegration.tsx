import { Grid, Typography } from '@mui/material';
import GradientHeading from 'components/GradientHeading';
import { UnstyledLink } from 'components/WorkspacePicker/styles';
import { NewTabIcon } from 'components/Icons/taskModalIcons';
import palette from 'theme/palette';
import { CopyContainer, CopyTypography } from 'components/Common/InviteLinkModal/styles';
import CopyIcon from 'components/Icons/copy';
import { useContext, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { CONNECT_TELEGRAM } from 'graphql/mutations';
import { getTelegramBotLink } from 'utils/index';
import { TelegramBotInfo, TelegramLabel } from './styles';
import ConnectionContext from './Helpers/ConnectionContext';

const TelegramIntegration = () => {
  const { orgId, podId } = useContext(ConnectionContext);

  const [copied, setCopied] = useState(false);

  const [connectTelegram, { data }] = useMutation(CONNECT_TELEGRAM, {
    variables: {
      orgId,
      podId,
    },
  });

  const token = `token:${data?.connectTelegram}`;

  useEffect(() => {
    if (orgId) {
      connectTelegram();
    }
  }, [orgId, podId]);

  const handleOnCopy = () => {
    navigator.clipboard.writeText(`${token}`);
    setCopied(true);
  };

  const tgLink = getTelegramBotLink();

  return (
    <Grid display="flex" direction="column" gap="12px">
      <GradientHeading fontSize={16}>Setup instructions</GradientHeading>
      <TelegramLabel>Step 1 speak to our bot</TelegramLabel>
      <UnstyledLink href={tgLink} target="__blank">
        <Grid
          display="flex"
          gap="8px"
          alignItems="center"
          bgcolor={palette.grey920}
          borderRadius="6px"
          padding="6px 10px 6px 8px"
          height="32px"
          width="fit-content"
        >
          <TelegramBotInfo>@wonderverse_bot</TelegramBotInfo>
          <NewTabIcon />
        </Grid>
      </UnstyledLink>
      <TelegramLabel>Step 2</TelegramLabel>
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
          <TelegramBotInfo>{token}</TelegramBotInfo>
        </Grid>
        <CopyContainer
          $copied={copied}
          onClick={handleOnCopy}
          style={{
            height: '32px',
          }}
        >
          <CopyIcon color={copied ? palette.green30 : palette.blue20} />
          <CopyTypography $copied={copied}>{copied ? 'Code copied' : 'Copy code'}</CopyTypography>
        </CopyContainer>
      </Grid>
    </Grid>
  );
};

export default TelegramIntegration;
