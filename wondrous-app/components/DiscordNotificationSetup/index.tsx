import React from 'react';
import { useRouter } from 'next/router';
import SideBarComponent from '../../components/SideBar';
import HeaderComponent from '../../components/Header';
import { SettingsContainer } from '../../components/Settings/styles';
import { HeaderBlock } from '../../components/Settings/headerBlock';
import {
  ListType,
  DiscordParagraph,
  DiscordTitle,
  BoldParagraph,
  ListItem,
  BoldSpan,
  SmallerTopParagraph,
} from '../../components/Discord/styles';
import { HighlightBlue, White } from '../../theme/colors';
import Link from 'next/link';

const DiscordNotificationSetup = (props) => { 
  const orgUsername = props?.orgUsername
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
          <ListItem>
            <BoldParagraph>Task submission creation</BoldParagraph>
          </ListItem>
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
              color: HighlightBlue,
            }}
            href="https://discord.com/api/oauth2/authorize?client_id=917630803314352208&permissions=268437504&scope=bot"
            target="_blank"
            rel="noreferrer"
          >
            this link
          </a>
        </DiscordParagraph>
        <DiscordParagraph>
          (You can only add bot to servers you have admin access to)
        </DiscordParagraph>
        <DiscordTitle
          style={{
            marginTop: '20px',
            fontSize: '22px',
          }}
        >
          Connect your own discord account to Wonder
        </DiscordTitle>

        <DiscordParagraph>
          To ensure only users with the correct permission can set up notification, please connect your discord account to Wonder through{' '}
          your profile setting page
          <Link href="profile/settings">
            <a
              target="_blank"
              style={{
                color: HighlightBlue,
                marginLeft: '4px',
              }}
            >
              your profile setting page
            </a>
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
          After adding the bot, navigate the channel you want you want to send notifications to
          in Discord and enter the command
        </SmallerTopParagraph>
        <SmallerTopParagraph
          style={{
            fontSize: '16px',
            fontWeight: 'bolder',
            color: 'green',
          }}
        >
          !wonder setup notification {orgUsername? orgUsername: '{{org_username}}'}
        </SmallerTopParagraph>
        <DiscordTitle
          style={{
            marginTop: '20px',
            fontSize: '22px',
          }}
        >
          You should see the message "notification configured to this current channel!"
        </DiscordTitle>

    </>
  );

}

export default DiscordNotificationSetup;
