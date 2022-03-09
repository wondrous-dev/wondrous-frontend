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
} from './styles';
import { HighlightBlue, White } from '../../theme/colors';

const DiscordNotificationSetup = () => {
  return (
    <>
      <HeaderComponent />
      <SideBarComponent />
      <SettingsContainer
        style={{
          flexDirection: 'column',
          paddingTop: '120px',
          paddingLeft: '200px',
          paddingBottom: '100px',
        }}
      >
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
        <DiscordTitle
          style={{
            marginTop: '20px',
            fontSize: '22px',
          }}
        >
          Creating a webhook
        </DiscordTitle>
        <SmallerTopParagraph
          style={{
            fontSize: '16px',
            fontWeight: 'bolder',
          }}
        >
          After adding the bot, we will need to{' '}
          <a
            style={{
              color: HighlightBlue,
            }}
            href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks"
            target="_blank"
            rel="noreferrer"
          >
            create a webhook
          </a>{' '}
          in Discord and paste the link into your organization to send Wonder event notifications to a Discord channel.
        </SmallerTopParagraph>
        <SmallerTopParagraph>
          1. Open the Discord channel you want to receive Wonder event notifications.
        </SmallerTopParagraph>
        <SmallerTopParagraph>
          2. From the channel menu, select <BoldSpan> Edit channel.</BoldSpan>
        </SmallerTopParagraph>
        <SmallerTopParagraph>
          3. If there are no existing webhooks, select <BoldSpan>Create Webhook</BoldSpan> . Otherwise, select{' '}
          <BoldSpan>View Webhooks</BoldSpan> then <BoldSpan>New Webhook.</BoldSpan>
        </SmallerTopParagraph>
        <SmallerTopParagraph>4. Enter the name of the bot to post the message.</SmallerTopParagraph>
        <SmallerTopParagraph>5. Optional. Edit the avatar.</SmallerTopParagraph>
        <SmallerTopParagraph>
          6. Copy the URL from the <BoldSpan> WEBHOOK URL</BoldSpan> field.
        </SmallerTopParagraph>
        <SmallerTopParagraph>
          7. Select <BoldSpan>Save.</BoldSpan>
        </SmallerTopParagraph>
        <DiscordTitle
          style={{
            marginTop: '20px',
            fontSize: '22px',
          }}
        >
          Configuring created webhook on Wonder
        </DiscordTitle>
        <SmallerTopParagraph>
          Click on your organization{`'`}s settings page by clicking the settings button on the boards page
        </SmallerTopParagraph>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          style={{
            width: '100%',
            maxWidth: '800px',
            marginTop: '8px',
            marginBottom: '12px',
          }}
          src="https://storage.googleapis.com/wondrous-media-prod/static/discord-setup-settings.png"
          alt=""
        />
        <SmallerTopParagraph>
          You can then paste the webhook url you copied from the previous section onto the Discord Webhook URL field
        </SmallerTopParagraph>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          style={{
            width: '100%',
            maxWidth: '800px',
            marginTop: '8px',
          }}
          src="https://storage.googleapis.com/wondrous-media-prod/static/discord-setup-integrations.png"
          alt=""
        />
        <SmallerTopParagraph>
          Click <BoldSpan>Save changes</BoldSpan> and voila! You've now set up notifications :)
        </SmallerTopParagraph>
      </SettingsContainer>
    </>
  );
};

export default DiscordNotificationSetup;
