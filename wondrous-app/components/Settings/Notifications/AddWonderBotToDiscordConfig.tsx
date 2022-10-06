import React, { useEffect, useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import {
  GET_ORG_DISCORD_NOTIFICATION_CONFIGS,
  GET_DISCORD_GUILD_FROM_INVITE_CODE,
  CHECK_DISCORD_BOT_ADDED,
  GET_CHANNELS_FROM_DISCORD,
  GET_POD_DISCORD_NOTIFICATION_CONFIGS,
} from 'graphql/queries';
import { MANUAL_DISCORD_ORG_SETUP, MANUAL_DISCORD_POD_SETUP } from 'graphql/mutations';

import { BOT_URL } from 'components/DiscordNotificationSetup';
import palette from 'theme/palette';
import InputForm from 'components/Common/InputForm/inputForm';
import DropdownSelect from 'components/Common/DropdownSelect';
import { CreateFormPreviewButton } from 'components/CreateEntity/styles';
import { ErrorText } from 'components/Common';
import { AddGuildButton, DiscordText } from 'components/Settings/styles';
import Box from '@mui/material/Box';
import { NotificationType } from 'components/Settings/Notifications/constants';
import { DiscordCard, DiscordCardElement, DiscordCardElementDiv } from './styles';

let timeout;

function AddWonderBotToDiscordConfig({
  orgId,
  onSave = null,
  type = NotificationType.TasksNotifications,
  podId = null,
}) {
  const [discordInviteLink, setDiscordInviteLink] = useState('');
  const [discordInviteLinkError, setDiscordInviteLinkError] = useState('');
  const [getDiscordGuildFromInviteCode] = useLazyQuery(GET_DISCORD_GUILD_FROM_INVITE_CODE);
  const [manualDiscordOrgSetup, { error: saveDiscordOrgError }] = useMutation(MANUAL_DISCORD_ORG_SETUP);
  const [manualDiscordPodSetup, { error: saveDiscordPodError }] = useMutation(MANUAL_DISCORD_POD_SETUP);
  const [getChannelsFromDiscord, { data: discordChannelData }] = useLazyQuery(GET_CHANNELS_FROM_DISCORD);
  const [guildId, setGuildId] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [checkDiscordBotAdded, { data: discordBotAdded, startPolling, stopPolling }] = useLazyQuery(
    CHECK_DISCORD_BOT_ADDED,
    {
      variables: {
        guildId,
      },
    }
  );

  useEffect(() => {
    if (guildId) {
      checkDiscordBotAdded({
        variables: {
          guildId,
        },
      });
      startPolling(1000);
    }
  }, [guildId]);

  useEffect(() => {
    if (discordBotAdded?.checkDiscordBotAdded?.botAdded) {
      // #fetch channels
      getChannelsFromDiscord({
        variables: {
          guildId,
        },
      });
      stopPolling();
    }
  }, [discordBotAdded]);

  const handleManualSetup = () => {
    const orgRefetchQueries = [GET_ORG_DISCORD_NOTIFICATION_CONFIGS];
    const podRefetchQueries = [GET_POD_DISCORD_NOTIFICATION_CONFIGS];

    if (podId) {
      manualDiscordPodSetup({
        variables: {
          guildId,
          podId,
          channelId: selectedChannel,
          type,
        },
        refetchQueries: podRefetchQueries,
      });
    } else
      manualDiscordOrgSetup({
        variables: {
          guildId,
          orgId,
          channelId: selectedChannel,
          type,
        },
        refetchQueries: orgRefetchQueries,
      });
    if (onSave) onSave();
  };

  useEffect(() => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      const inviteCodeArr = discordInviteLink.split('/');
      const inviteCode = inviteCodeArr[inviteCodeArr.length - 1];
      if (discordInviteLink) {
        if (inviteCode) {
          try {
            const guildData = await getDiscordGuildFromInviteCode({
              variables: {
                inviteCode,
              },
            });
            if (guildData?.error) {
              setDiscordInviteLinkError('Invalid invite link');
            } else if (guildData?.data) {
              setGuildId(guildData?.data?.getDiscordGuildFromInviteCode?.guildId);
            }
          } catch (err) {
            console.log('err', err);
            setDiscordInviteLinkError('Invalid invite link');
          }
        } else {
          setDiscordInviteLinkError('Invalid invite link');
        }
      }
    }, 1000);
  }, [discordInviteLink]);
  const discordChannels = discordChannelData?.getAvailableChannelsForDiscordGuild || [];
  const filteredDiscordChannels = discordChannels.map((channel) => ({
    value: channel.id,
    label: channel.name,
  }));

  return (
    <>
      <DiscordCard container>
        <DiscordCardElement sm={4}>
          <DiscordCardElementDiv>
            <DiscordText>Paste invite link</DiscordText>
            <InputForm
              style={{
                background: palette.black97,
              }}
              value={discordInviteLink}
              onChange={(e) => setDiscordInviteLink(e.target.value)}
            />
            {!!discordInviteLinkError && <ErrorText>{discordInviteLinkError}</ErrorText>}
          </DiscordCardElementDiv>
        </DiscordCardElement>
        <DiscordCardElement sm={4}>
          <DiscordCardElementDiv>
            <DiscordText>Add bot</DiscordText>
            {guildId && !discordBotAdded?.checkDiscordBotAdded?.botAdded ? (
              <AddGuildButton
                style={{
                  border: '1px solid deepskyblue',
                  backgroundColor: palette.grey1000,
                }}
                href={`${BOT_URL}&guild_id=${guildId}`}
                target="_blank"
              >
                <DiscordText
                  style={{
                    color: palette.white,
                    fontSize: '14px',
                    marginBottom: '0',
                  }}
                >
                  Add Wonder bot
                </DiscordText>
              </AddGuildButton>
            ) : (
              <AddGuildButton disabled>
                <DiscordText
                  style={{
                    color: '#8b8b8c',
                    fontSize: '14px',
                    marginBottom: '0',
                  }}
                >
                  {discordBotAdded?.checkDiscordBotAdded?.botAdded ? 'Wonder bot added' : 'Add Wonder bot'}
                </DiscordText>
              </AddGuildButton>
            )}
          </DiscordCardElementDiv>
        </DiscordCardElement>
        <DiscordCardElement sm={4}>
          <DiscordCardElementDiv>
            <DiscordText>Set channel</DiscordText>
            <DropdownSelect
              value={selectedChannel}
              setValue={setSelectedChannel}
              formSelectStyle={{
                height: 'auto',
              }}
              innerStyle={{
                marginTop: '0',
                background: palette.black97,
              }}
              options={filteredDiscordChannels}
            />
          </DiscordCardElementDiv>
        </DiscordCardElement>
      </DiscordCard>
      {selectedChannel && (
        <Box sx={{ padding: '12px', display: 'flex', justifyContent: 'flex-end' }}>
          <CreateFormPreviewButton
            style={{
              margin: '0',
            }}
            onClick={handleManualSetup}
          >
            Save changes
          </CreateFormPreviewButton>
          {saveDiscordOrgError && (
            <ErrorText>
              Failed to set up Discord for organization: {saveDiscordOrgError?.message || saveDiscordOrgError}
            </ErrorText>
          )}
        </Box>
      )}
    </>
  );
}

export default AddWonderBotToDiscordConfig;
