import "./MessagePreview.css"
import { format, parseISO } from "date-fns";
import { toHTML } from "../utils/markdown";
import { colorIntToHex } from "../utils";
import { useState } from "react";
import { useEmbedCreatorContext } from "utils/context/EmbedCreatorContext";
import { Grid } from "@mui/material";


export const defaultMessage: any = {
  "content": "Welcome to **Embeds Generator**! 🎉 \nCreate stunning embed messages for your Discord server with ease!\n\n\n\n\n\n\n\nIf you're ready to start, simply click on the \"Clear\" button at the top of the editor and create your own message.\n\nShould you need any assistance or have questions, feel free to join our [support server](/discord) where you can connect with our helpful community members and get the support you need.\n\nWe also have a [complementary bot](/invite) that enhances the experience with Embed Generator. Check out our [Discord bot](/invite) which offers features like formatting for mentions, channels, and emoji, creating reaction roles, interactive components, and more.\n\nLet your creativity shine and make your server stand out with Embed Generator! ✨",
  "tts": false,
  "embeds": [
    {
      "id": 652627557,
      "title": "About Embed Generator",
      "description": "Embed Generator is a powerful tool that enables you to create visually appealing and interactive embed messages for your Discord server. With the use of webhooks, Embed Generator allows you to customize the appearance of your messages and make them more engaging.\n\nTo get started, all you need is a webhook URL, which can be obtained from the 'Integrations' tab in your server's settings. If you encounter any issues while setting up a webhook, our bot can assist you in creating one.\n\nInstead of using webhooks you can also select a server and channel directly here on the website. The bot will automatically create a webhook for you and use it to send the message.",
      "color": 2326507,
      "fields": []
    },
    {
      "id": 10674342,
      "title": "Discord Bot Integration",
      "description": "Embed Generator offers a Discord bot integration that can further enhance your the functionality. While it is not mandatory for sending messages, having the bot on your server gives you access to a lot more features!\n\nHere are some key features of our bot:",
      "color": 2326507,
      "fields": [
        {
          "id": 472281785,
          "name": "Interactive Components",
          "value": "With our bot on your server you can add interactive components like buttons and select menus to your messages. Just invite the bot to your server, select the right server here on the website and you are ready to go!"
        },
        {
          "id": 608893643,
          "name": "Special Formatting for Mentions, Channels, and Emoji",
          "value": "With the /format command, our bot provides special formatting options for mentions, channel tags, and ready-to-use emoji. No more manual formatting errors! Simply copy and paste the formatted text into the editor."
        },
        {
          "id": 724530251,
          "name": "Recover Embed Generator Messages",
          "value": "If you ever need to retrieve a previously sent message created with Embed Generator, our bot can assist you. Right-click or long-press any message in your server, navigate to the apps menu, and select Restore to Embed Generator. You'll receive a link that leads to the editor page with the selected message."
        },
        {
          "id": 927221233,
          "name": "Additional Features",
          "value": "Our bot also supports fetching images from profile pictures or emojis, webhook management, and more. Invite the bot to your server and use the /help command to explore all the available features!"
        }
      ]
    }
  ],
  "components": [],
  "actions": {}
};

const buttonColors = {
  1: "discord-button-primary",
  2: "discord-button-secondary",
  3: "discord-button-success",
  4: "discord-button-destructive",
  5: "discord-button-secondary",
};

const MessagePreviewComponent = () => {
  const currentTime = format(new Date(), "hh:mm aa");
  const [responses, setResponses] = useState([]);
  const {message} = useEmbedCreatorContext();
  // const message = defaultMessage;
  return (
    <Grid width="100%">
      <div
        className="discord-messages"
        style={{
          border: "none",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
      >
        <div className="discord-message">
          <div className="discord-message-inner">
            <div className="discord-author-avatar">
              <img src={message.avatar_url || "/app/logo.svg"} alt="" />
            </div>
            <div className="discord-message-content">
              <span className="discord-author-info">
                <span className="discord-author-username">{message.username || "Embed Generator"}</span>
                <span className="discord-application-tag">Bot</span>
              </span>
              <span className="discord-message-timestamp pl-1">Today at {currentTime}</span>
              {!!message.content && (
                <div className="discord-message-body">
                  <div
                    className="discord-message-markup"
                    dangerouslySetInnerHTML={{
                      __html: toHTML(message.content || "", {}),
                    }}
                  />
                </div>
              )}
              <div className="discord-message-compact-indent">
                {message?.embeds &&
                  message?.embeds?.map((embed) => {
                    let inlineFieldIndex = 0;
                    const hexColor = embed.color ? colorIntToHex(embed.color) : "#1f2225";
                    let timestamp = "";
                    if (embed.timestamp) {
                      const date = parseISO(embed.timestamp);
                      if (!isNaN(date.getTime())) {
                        timestamp = format(date, "dd/MM/yyyy");
                      }
                    }
                    return (
                      <div key={embed.id} className="discord-embed overflow-hidden">
                        <div className="discord-left-border" style={{ backgroundColor: hexColor }}></div>
                        <div className="discord-embed-root">
                          <div className="discord-embed-wrapper">
                            <div className="discord-embed-grid">
                              {!!embed.author?.name && (
                                <div className="discord-embed-author overflow-hidden break-all">
                                  {!!embed.author.icon_url && (
                                    <img src={embed.author.icon_url} alt="" className="discord-author-image" />
                                  )}
                                  {embed.author.url ? (
                                    <a href={embed.author.url}>{embed.author.name}</a>
                                  ) : (
                                    embed.author.name
                                  )}
                                </div>
                              )}
                              {!!embed.title && (
                                <div className="discord-embed-title overflow-hidden break-all">
                                  {embed.url ? (
                                    <a
                                      href={embed.url}
                                      dangerouslySetInnerHTML={{
                                        __html: toHTML(embed.title || "", {
                                          isTitle: true,
                                        }),
                                      }}
                                    ></a>
                                  ) : (
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: toHTML(embed.title || "", {
                                          isTitle: true,
                                        }),
                                      }}
                                    />
                                  )}
                                </div>
                              )}
                              {!!embed.description && (
                                <div
                                  className="discord-embed-description"
                                  dangerouslySetInnerHTML={{
                                    __html: toHTML(embed.description || "", {}),
                                  }}
                                />
                              )}
                              {!!embed.fields.length && (
                                <div className="discord-embed-fields">
                                  {embed?.fields?.map((field) => (
                                    <div
                                      key={field.id}
                                      className={`discord-embed-field${
                                        field.inline
                                          ? ` discord-embed-inline-field discord-embed-inline-field-${
                                              (inlineFieldIndex++ % 3) + 1
                                            }`
                                          : ""
                                      }`}
                                    >
                                      <div
                                        className="discord-field-title overflow-hidden break-all"
                                        dangerouslySetInnerHTML={{
                                          __html: toHTML(field.name || "", {
                                            isTitle: true,
                                          }),
                                        }}
                                      />
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: toHTML(field.value, {}),
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                              {!!embed.image && (
                                <div className="discord-embed-media">
                                  <img src={embed.image.url} alt="" className="discord-embed-image" />
                                </div>
                              )}
                              {!!embed.thumbnail && (
                                <img src={embed.thumbnail.url} alt="" className="discord-embed-thumbnail" />
                              )}
                              {(embed.footer?.text || embed.timestamp) && (
                                <div className="discord-embed-footer overflow-hidden break-all">
                                  {embed.footer?.icon_url && (
                                    <img src={embed.footer?.icon_url} alt="" className="discord-footer-image" />
                                  )}
                                  {embed.footer?.text}
                                  {embed.footer?.text && embed.timestamp && (
                                    <div className="discord-footer-separator">•</div>
                                  )}
                                  <div className="flex-none">{timestamp}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                <div className="discord-attachments">
                  {/* TODO: fix me */}
                  {"channel" === "channel" &&
                    message?.components?.map((row) => (
                      <div className="discord-action-row" key={row.id}>
                        {row?.components?.map((comp) =>
                          comp.type === 2 ? (
                            comp.style === 5 ? (
                              <a
                                className={`discord-button discord-button-hoverable ${buttonColors[comp.style]}`}
                                key={comp.id}
                                target="_blank"
                                href={comp.url}
                                rel="noreferrer"
                              >
                                <span>{comp.label}</span>
                                <svg
                                  className="discord-button-launch"
                                  aria-hidden="false"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M10 5V3H5.375C4.06519 3 3 4.06519 3 5.375V18.625C3 19.936 4.06519 21 5.375 21H18.625C19.936 21 21 19.936 21 18.625V14H19V19H5V5H10Z"
                                  ></path>
                                  <path
                                    fill="currentColor"
                                    d="M21 2.99902H14V4.99902H17.586L9.29297 13.292L10.707 14.706L19 6.41302V9.99902H21V2.99902Z"
                                  ></path>
                                </svg>
                              </a>
                            ) : (
                              <div
                                className={`discord-button discord-button-hoverable ${buttonColors[comp.style]}`}
                                key={comp.id}
                              >
                                <span>{comp.label}</span>
                              </div>
                            )
                          ) : undefined
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {responses.map((resp) => (
          <div className="discord-message discord-highlight-ephemeral" key={resp.id}>
            <div className="discord-replied-message">
              <img src={message.avatar_url || "/app/logo.svg"} alt="" className="discord-replied-message-avatar" />
              <span className="discord-application-tag">Bot</span>
              <span className="discord-replied-message-username">{message.username || "Embed Generator"}</span>
              <div className="discord-replied-message-content truncate">
                {message.content || <span className="italic">Click to see attachment</span>}
              </div>
            </div>
            <div className="discord-message-inner">
              <div className="discord-author-avatar">
                <img src="/app/logo.svg" alt="" />
              </div>
              <div className="discord-message-content">
                <span className="discord-author-info">
                  <span className="discord-author-username">Embed Generator</span>
                  <span className="discord-application-tag">
                    <svg
                      className="discord-application-tag-verified"
                      aria-label="Verified Bot"
                      aria-hidden="false"
                      width="16"
                      height="16"
                      viewBox="0 0 16 15.2"
                    >
                      <path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" fill="currentColor"></path>
                    </svg>
                    Bot
                  </span>
                </span>
                <span className="discord-message-timestamp pl-1">Today at {currentTime}</span>
                <div className="discord-message-body">
                  <span className="discord-message-markup">{resp.text}</span>
                </div>
                <div className="discord-message-compact-indent">
                  <div className="discord-message-ephemeral flex items-center">
                    <svg
                      className="discord-message-ephemeral-icon"
                      aria-hidden="false"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M12 5C5.648 5 1 12 1 12C1 12 5.648 19 12 19C18.352 19 23 12 23 12C23 12 18.352 5 12 5ZM12 16C9.791 16 8 14.21 8 12C8 9.79 9.791 8 12 8C14.209 8 16 9.79 16 12C16 14.21 14.209 16 12 16Z"
                      ></path>
                      <path
                        fill="currentColor"
                        d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                      ></path>
                    </svg>
                    Only you can see this •{" "}
                    <span
                      className="discord-message-ephemeral-link"
                      onClick={() => setResponses(responses.filter((r) => r.id !== resp.id))}
                    >
                      Dismiss message
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Grid>
  );
};

export default MessagePreviewComponent;
