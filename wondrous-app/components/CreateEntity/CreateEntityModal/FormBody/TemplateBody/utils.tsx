import OnboardingSvg from 'components/CreateEntity/CreateEntityModal/FormBody/TemplateBody/icons/onboarding.svg';

export const PRESET_TEMPLATES = {
  Onboarding: {
    templates: [
      {
        title: 'Join our Discord!',
        description: `[{"type":"p","children":[{"text":"Get a Discord Role and introduce yourself to the community. [This works better as a bounty, rather than a task to accept multiple submissions]"}]},{"type":"p","children":[{"text":""}]},{"type":"p","children":[{"text":"1. Join the Discord [HIGHLIGHT AND INSERT LINK]if you haven't yet!"}]},{"type":"p","children":[{"text":"2. Verify and select a role you want."}]},{"type":"p","children":[{"text":"3. Post about yourself and your skills in the #introduce-yourself channel\n\nDo all this and then you'll have get access to a role!"}]},{"type":"p","children":[{"text":""}]},{"type":"h3","children":[{"text":"To submit:"}]},{"type":"p","children":[{"text":"Please post your Discord username in the submission and we'll approve of it"}]}]`,
      },
      {
        title: 'Try out product and give feedback',
        description: `[{"type":"p","children":[{"text":"Visit our application, use our product and let us know what you think. [This works better as a bounty, rather than a task to accept multiple submissions]."}]},{"type":"p","children":[{"text":""}]},{"type":"h3","children":[{"text":"To submit:"}]},{"type":"p","children":[{"text":"In the submission, answer the following questions:"}]},{"type":"ul","children":[{"type":"li","children":[{"type":"lic","children":[{"text":"What was your first impression?"}]}]},{"type":"li","children":[{"type":"lic","children":[{"text":"Were you able to find everything you expected to find?"}]}]},{"type":"li","children":[{"type":"lic","children":[{"text":"What would you change?"}]}]}]}]`,
      },
      {
        title: 'Read our docs and take this starter quiz',
        description: `[{"type":"p","children":[{"text":" [This works better as a bounty, rather than a task to accept multiple submissions.]"}]},{"type":"p","children":[{"text":""}]},{"type":"p","children":[{"text":"Read our docs [INSERT LINK HERE] and answer these questions:"}]},{"type":"p","children":[{"text":""}]},{"type":"ol","children":[{"type":"li","children":[{"type":"lic","children":[{"text":""}]}]},{"type":"li","children":[{"type":"lic","children":[{"text":""}]}]},{"type":"li","children":[{"type":"lic","children":[{"text":"\n"}]}]}]},{"type":"h3","children":[{"text":"To submit:"}]},{"type":"p","children":[{"text":"Please post your answers as a submission"}]}]`,
      },
      {
        title: 'Take this survey',
        description: `[{"children":[{"text":"We’re sourcing opinions from the community on [topic]. Fill out this survey [link] and let us know what you think. Everyone’s answer will be taken seriously, so we thank you in advance!"}],"type":"p"},{"type":"p","children":[{"text":""}]},{"type":"p","children":[{"text":"[This works better as a bounty, rather than a task to accept multiple submissions]."}]}]`,
      },
    ],
    icon: <OnboardingSvg />,
  },
  Community: {
    templates: [
      {
        title: 'Join Weekly Community Call',
        description: `[{"type":"p","children":[{"text":"Our weekly community calls have all the alpha you need. [Insert Link or calendar invite]"}]},{"type":"p","children":[{"text":""}]},{"type":"p","children":[{"text":"You can also bring up topics you'd want to discuss or ask the team any burning questions."}]},{"type":"p","children":[{"text":""}]},{"type":"p","children":[{"text":"To submit:","bold":true}]},{"type":"p","children":[{"text":"Post a screenshot of the community call you attended :)"}]}]`,
      },
      {
        title: 'Host IRL event',
        description: `[{"children":[{"text":"A big part of community building is creating lasting relationships - if you host a meet up of over 10 people in your city, we're happy to sponsor up to [REWARD AMOUNT]."}],"type":"p"},{"type":"p","children":[{"text":""}]},{"type":"p","children":[{"text":"Submission:","bold":true}]},{"type":"ul","children":[{"type":"li","children":[{"type":"lic","children":[{"text":"Create an event via "},{"type":"a","url":"https://partiful.com/","target":"_self","children":[{"text":"Partiful"}]},{"text":" and post in Discord to invite members"}]}]},{"type":"li","children":[{"type":"lic","children":[{"text":"Post selfie with the crew!"}]}]}]}]`,
      },
      {
        title: 'Invite friend into community',
        description: `[{"children":[{"text":"If you've enjoyed being part of this community please feel to invite friends who would also vibe with us - the more the merrier!"}],"type":"p"},{"type":"p","children":[{"text":""}]},{"type":"p","children":[{"text":"To submit:","bold":true}]},{"type":"ul","children":[{"type":"li","children":[{"type":"lic","children":[{"text":"Invite your friends with [INSERT DISCORD LINK]"}]}]},{"type":"li","children":[{"type":"lic","children":[{"text":"Have them introduce themselves and have them say that you invited them"}]}]},{"type":"li","children":[{"type":"lic","children":[{"text":"Post the screenshot!"}]}]}]}]`,
      },
    ],
  },
  Governance: {
    templates: [
      {
        title: 'Vote on a proposal',
        description: `[{"children":[{"text":"With web3, we're able to make better decisions with the power of the community.  Please visit [INSERT SNAPSHOT/VOTING LINK] to vote on a proposal!"}],"type":"p"},{"type":"p","children":[{"text":""}]},{"type":"p","children":[{"text":"To vote, you'll first need [INSERT TOKEN REQUIREMENT]. If you don't already, here's how to get those tokens [INSERT LINK]."}]},{"type":"p","children":[{"text":""}]},{"type":"p","children":[{"text":"To submit:","bold":true}]},{"type":"p","children":[{"text":"Please post a screenshot of your voted proposal! As a bonus explain why you voted a certain way"}]}]`,
      },
      {
        title: 'Write a proposal',
        descrtiption: `[{"type":"p","children":[{"text":"On Wonderverse, any contributor can create a proposal that can be voted on. These can be simple Yes/No proposals, or polls with many number of options. For more information: "},{"type":"a","url":"https://wonderverse.gitbook.io/welcome-to-wonderverse/wonder-basics/creating-proposals","children":[{"text":"https://wonderverse.gitbook.io/welcome-to-wonderverse/wonder-basics/creating-proposals"}]},{"text":""}]},{"type":"p","children":[{"text":""}]},{"type":"p","children":[{"text":"To submit:","bold":true}]},{"type":"p","children":[{"text":"Post a link to the proposal you created on Wonderverse!"}]}]`,
      },
    ],
  },
  Content: {
    templates: [
      {
        title: 'Write a Twitter thread about our recent announcement',
        description: `[{"type":"p","children":[{"text":"We have a lot of building going on this year. As a result, we're rewarding our community members [INSERT AMOUNT] for writing an awesome thread about our recent announcement [INSERT LINK]"}]},{"type":"p","children":[{"text":""}]},{"type":"p","children":[{"text":"To submit:","bold":true}]},{"type":"p","children":[{"text":"Please post a link to your typefully!"}]}]`,
      },
      {
        title: 'Draw up a meme we can post on socials',
        description: `[{"children":[{"text":"Memes and Web3, name a better duo. We’ll wait…"}],"type":"p"},{"type":"p","children":[{"text":"\nCreate the next viral meme and help spread the good word of our project to other people. This can be related to web3 in general, or specifically to our product\n"}]},{"type":"p","children":[{"text":"To submit:","bold":true}]},{"type":"p","children":[{"text":"Upload a picture of the meme!"}]}]`,
      },
      {
        title: 'Write an article for our blog',
        description: `[{"type":"p","children":[{"text":"Help build our blog by writing an article related to our space."}]},{"type":"p","children":[{"text":"\n"},{"text":"Requirements","italic":true}]},{"type":"ul","children":[{"type":"li","children":[{"type":"lic","children":[{"text":"Topics: Project management, DAOs, Governance, or NFTs"}]}]},{"type":"li","children":[{"type":"lic","children":[{"text":"500 words minimum"}]}]},{"type":"li","children":[{"type":"lic","children":[{"text":"Includes visual aids and links to other resources"}]}]}]},{"type":"p","children":[{"text":""}]},{"type":"p","children":[{"text":"To submit:","bold":true}]},{"type":"p","children":[{"text":"Please post a link to a Google Doc/Notion"}]}]`,
      },
      {
        title: 'Create a video for our upcoming launch',
        description: `[{"children":[{"text":"Calling all creatives! We'd love to get your help on creating a video for our upcoming launch for [INSERT LINK]."}],"type":"p"},{"type":"p","children":[{"text":""}]},{"type":"p","children":[{"text":"To submit:","bold":true}]},{"type":"ul","children":[{"type":"li","children":[{"type":"lic","children":[{"text":"Please submit your ideas in the submission tab."}]}]},{"type":"li","children":[{"type":"lic","children":[{"text":"The core team will choose the best ideas and put them to a vote"}]}]},{"type":"li","children":[{"type":"lic","children":[{"text":"The winning submission will be funded to create a the video, with the additional reward paid out after completion of the video to a satisfactory standard."}]}]}]}]`,
      },
    ],
  },
  Partnerships: {
    templates: [
      {
        title: 'Partner/customer Sourcing',
        description: `[{"children":[{"text":"We know how well-connected our community is, so we'd love to get your help on connecting with potential collaborators and customers. For every accepted referral, we'll be giving out handsome referral fees based on the size and relevance of the partner/customer. "}],"type":"p"},{"type":"p","children":[{"text":""}]},{"type":"p","children":[{"text":"To submit:","bold":true}]},{"type":"p","children":[{"text":"Please contact [Business development person] and post your Discord handle. The reward will be distributed after a partnerships/customer relationship is formed!"}]}]`,
      },
    ],
  },
  Engineering: {
    templates: [
      {
        title: 'Tackle Github issue',
        description: `[{"children":[{"text":"We have a list of Github issues [OR SET UP WONDERVERSE ENGINEERING POD] that needs to be worked on. First you'll need to join our repo - please DM [ENGINEERING LEAD] to get invited."}],"type":"p"},{"type":"p","children":[{"text":""}]},{"type":"p","children":[{"text":"To submit:","bold":true}]},{"type":"p","children":[{"text":"Connect the Github PR you created to the Wonderverse task (for more info check our "},{"type":"a","url":"https://wonderverse.gitbook.io/welcome-to-wonderverse/setting-up-the-workspace/set-up-integrations/github-integration","target":"_self","children":[{"text":"Github integration"}]},{"text":"). Once the PR is closed and merged it'll be auto approved and we'll pay out the appriopriate reward."}]}]`,
      },
    ],
  },
};
