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
  Governance: {},
  Content: {},
  Partnerships: {},
  Engineering: {},
};
