import React from 'react';
import {
  ListType,
  DiscordParagraph,
  DiscordTitle,
  BoldParagraph,
  ListItem,
  SmallerTopParagraph,
} from 'components/Discord/styles';
import palette from 'theme/palette';
import Link from 'next/link';

export const BOT_URL = `https://discord.com/api/oauth2/authorize?client_id=917630803314352208&permissions=8&scope=bot`;
function DiscordNotificationSetup(props) {
  const orgUsername = props?.orgUsername;
  return (
    <>
      <DiscordTitle>Setting up Wonder notifications in a Discord channel</DiscordTitle>
      <DiscordParagraph>
        With this integration, you can set up notifications in a specific channel on your Discord server. These will
        include:
      </DiscordParagraph>
      <ListType>
        <li>
          <BoldParagraph>Task proposal creation</BoldParagraph>
        </li>
        <ListItem>
          <BoldParagraph>Task creation</BoldParagraph>
        </ListItem>
        {/* <ListItem>
        <BoldParagraph>Task submission creation</BoldParagraph>
      </ListItem> */}
        <ListItem>
          <BoldParagraph>Task completion</BoldParagraph>
        </ListItem>
      </ListType>
      <DiscordTitle
        style={{
          marginTop: '20px',
          fontSize: '22px',
        }}
      >
        Adding the Wonder bot
      </DiscordTitle>

      <DiscordParagraph>
        To add our bot to your discord server and to send the notifications from the bot, click{' '}
        <a
          style={{
            color: palette.highlightBlue,
          }}
          href={BOT_URL}
          target="_blank"
          rel="noreferrer"
        >
          this link
        </a>
      </DiscordParagraph>
      <DiscordParagraph>(You can only add bot to servers you have admin access to)</DiscordParagraph>
      <DiscordTitle
        style={{
          marginTop: '20px',
          fontSize: '22px',
        }}
      >
        Connect your own discord account to Wonder
      </DiscordTitle>

      <DiscordParagraph>
        To ensure only users with the correct permission can set up notification, please connect your discord account to
        Wonder through
        <Link
          href="/profile/settings"
          target="_blank"
          style={{
            color: palette.highlightBlue,
            marginLeft: '4px',
          }}
        >
          your profile setting page
        </Link>
      </DiscordParagraph>
      <DiscordTitle
        style={{
          marginTop: '20px',
          fontSize: '22px',
        }}
      >
        Configure Notification To Channel
      </DiscordTitle>
      <SmallerTopParagraph
        style={{
          fontSize: '16px',
          fontWeight: 'bolder',
        }}
      >
        After adding the bot, navigate to the channel you want to send notifications to in Discord. Please make sure the
        bot is in the channel and that the bot can embed links. Then enter the command
      </SmallerTopParagraph>
      <SmallerTopParagraph
        style={{
          fontSize: '16px',
          fontWeight: 'bolder',
          color: 'green',
        }}
      >
        !wonder setup notification {orgUsername || '{{org_username}}'}
      </SmallerTopParagraph>
      <SmallerTopParagraph
        style={{
          marginTop: '20px',
          fontWeight: 'bolder',
        }}
      >
        You should see the message {`"notification configured to this current channel!"`}. Refresh this page when you do
        and {`you're`} done!
      </SmallerTopParagraph>
      <DiscordParagraph>
        (If you don{`'`}t see any message on discord, it could be that our bot doesn{`'`}t have permission to send
        message on your channel, Please check back in your org setting page to see if it{`'`}s configured )
      </DiscordParagraph>
    </>
  );
}

export default DiscordNotificationSetup;
