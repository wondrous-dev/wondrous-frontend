import { ENTITIES_TYPES, DAO_CATEGORIES_KEYS } from 'utils/constants';

export const TASK_SUGGESTIONS = {
  [DAO_CATEGORIES_KEYS.SOCIAL_GOOD]: {
    [ENTITIES_TYPES.POD]: [{ title: 'Design' }, { title: 'Public Outreach' }, { title: 'Grants' }],
    [ENTITIES_TYPES.TASK]: [
      {
        title: 'Build partnerships with stakeholders',
        description: [
          {
            children: [
              {
                text: 'Collaborate with individuals or organizations who have an interest in supporting the initiative to promote awareness and generate support.',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Establish metrics for measuring success',
        description: [
          {
            children: [
              {
                text: 'Determine what metrics will be used to track progress towards achieving stated goals/objectives of providing these essential services',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Secure adequate funding sources',
        description: [
          {
            children: [
              {
                text: 'Seek out sustainable revenue streams such as taxes, grants, donations from philanthropists/charities/NGOs etc., crowdfunding campaigns or other creative methods depending on local context (e.g., if there is significant inequality).',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.MILESTONE]: [
      { title: 'Grow the community 10%' },
      { title: 'Reach 10,000 twitter followers' },
      { title: 'Launch a new blog' },
    ],
    [ENTITIES_TYPES.BOUNTY]: [
      {
        title: 'Daily engagement activity',
        description: [
          {
            children: [
              {
                text: 'This is our easiest task. Complete this everyday to let others know you’re here and ready to collab',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Create onboarding guide',
        description: [
          {
            children: [
              {
                text: 'Create a 1 pager to give folks some context to your org and attach to Docs section!',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Invite friends',
        description: [
          {
            children: [
              {
                text: 'Invite friends to your community. We’re all in this together!',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
  },
  [DAO_CATEGORIES_KEYS.MEDIA_CONTENT]: {
    [ENTITIES_TYPES.POD]: [{ title: 'Design' }, { title: 'Community management' }, { title: 'Meme factory' }],
    [ENTITIES_TYPES.TASK]: [
      {
        title: 'Develop a content strategy',
        description: [
          {
            children: [
              {
                text: 'Define your target audience, identify key platforms, create content themes and establish metrics to measure success.',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Create a content calendar',
        description: [
          {
            children: [
              {
                text: 'Plan your content schedule in advance based on holidays or events that align with your brand values or promotions.',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Leverage social media channels',
        description: [
          {
            children: [
              {
                text: 'Promote content organically on social channels where most customers engage-share regular updates; post questions-respond timely-use hashtags',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.BOUNTY]: [
      {
        title: 'Daily engagement activity',
        description: [
          {
            children: [
              {
                text: 'This is our easiest task. Complete this everyday to let others know you’re here and ready to collab',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Create onboarding guide',
        description: [
          {
            children: [
              {
                text: 'Create a 1 pager to give folks some context to your org and attach to Docs section!',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Invite friends',
        description: [
          {
            children: [
              {
                text: 'Invite friends to your community. We’re all in this together!',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.MILESTONE]: [
      { title: 'Create a content flywheel' },
      { title: 'Get showcased by a popular Twitter account' },
      { title: 'Be hired by our first client' },
    ],
  },
  [DAO_CATEGORIES_KEYS.NFT_COLLECTIVE]: {
    [ENTITIES_TYPES.POD]: [{ title: 'Art and creative' }, { title: 'Marketing' }, { title: 'Merch' }],
    [ENTITIES_TYPES.BOUNTY]: [
      {
        title: 'Daily engagement activity',
        description: [
          {
            children: [
              {
                text: 'This is our easiest task. Complete this everyday to let others know you’re here and ready to collab',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Create onboarding guide',
        description: [
          {
            children: [
              {
                text: 'Create a 1 pager to give folks some context to your org and attach to Docs section!',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Invite friends',
        description: [
          {
            children: [
              {
                text: 'Invite friends to your community. We’re all in this together!',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.TASK]: [
      {
        title: 'Participate in public events and exhibits',
        description: [
          {
            children: [
              {
                text: 'Attend local meetups or virtual conferences based around NFTs where you can network with others who share similar interests in this area.',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Connect with other creators',
        description: [
          {
            children: [
              {
                text: 'Find other artists, musicians, game developers or anyone working on creative projects within the NFT space to connect and collaborate.',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Shill emerging projects',
        description: [
          {
            children: [
              {
                text: 'As a member of this community it is important to support emerging projects that align with your values by sharing them on social media platforms or even investing time/money into the project itself',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.MILESTONE]: [
      { title: 'Launch our first PFP project' },
      { title: 'Run a merchandise giveaway' },
      { title: 'Host first IRL event' },
    ],
  },
  [DAO_CATEGORIES_KEYS.INVESTMENTS]: {
    [ENTITIES_TYPES.POD]: [{ title: 'Governance' }, { title: 'Market research' }, { title: 'Partnerships' }],
    [ENTITIES_TYPES.BOUNTY]: [
      {
        title: 'Daily engagement activity',
        description: [
          {
            children: [
              {
                text: 'This is our easiest task. Complete this everyday to let others know you’re here and ready to collab',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Create onboarding guide',
        description: [
          {
            children: [
              {
                text: 'Create a 1 pager to give folks some context to your org and attach to Docs section!',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Invite friends',
        description: [
          {
            children: [
              {
                text: 'Invite friends to your community. We’re all in this together!',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.TASK]: [
      {
        title: 'Develop an investment plan',
        description: [
          {
            children: [
              {
                text: "Once you've identified your goals and assessed risk tolerance along with asset allocation preferences, you can create an investment plan detailing how much money goes toward each type of asset class.",
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Determine asset allocation strategy',
        description: [
          {
            children: [
              {
                text: 'Asset allocation refers to how you divide up your investment portfolio among various types of assets like stocks, bonds and alternative investments depending on factors such as age, financial status, objectives etc.',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Set Expectations',
        description: [
          {
            children: [
              {
                text: 'Though it is natural for any investor aspiring better returns, one must keep realistic expectations from his selected pickings while being cautious about market risks involved.',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.MILESTONE]: [
      { title: 'Achieve 15% portfolio growth' },
      { title: 'Actualize an investment hedging strategy' },
      { title: 'Implement community governance mechanisms' },
    ],
  },
  [DAO_CATEGORIES_KEYS.DEFI]: {
    [ENTITIES_TYPES.POD]: [{ title: 'Engineering' }, { title: 'Partnerships' }, { title: 'Content creation' }],
    [ENTITIES_TYPES.BOUNTY]: [
      {
        title: 'Daily engagement activity',
        description: [
          {
            children: [
              {
                text: 'This is our easiest task. Complete this everyday to let others know you’re here and ready to collab',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Create onboarding guide',
        description: [
          {
            children: [
              {
                text: 'Create a 1 pager to give folks some context to your org and attach to Docs section!',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Invite friends',
        description: [
          {
            children: [
              {
                text: 'Invite friends to your community. We’re all in this together!',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.TASK]: [
      {
        title: 'Research current DeFi platforms',
        description: [
          {
            children: [
              {
                text: 'Develop a list of current DeFi platforms, their pros and cons, and why we should utilize them',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Conduct Tokenomics analysis',
        description: [
          {
            children: [
              {
                text: 'Highlight whether prospective investments have sound tokenomics',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Develop a whitepaper',
        description: [
          {
            children: [
              {
                text: 'Write a white paper illustrating our communities past, current, and future investment strategies.',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.MILESTONE]: [
      { title: 'Launch V1 of the new protocol' },
      { title: 'Achieve 99% uptime' },
      { title: 'Sponsor an event at Eth Denver' },
    ],
  },
  [DAO_CATEGORIES_KEYS.SOCIAL]: {
    [ENTITIES_TYPES.POD]: [{ title: 'Community engagement' }, { title: 'Book club' }, { title: 'Meme factory' }],
    [ENTITIES_TYPES.BOUNTY]: [
      {
        title: 'Daily engagement activity',
        description: [
          {
            children: [
              {
                text: 'This is our easiest task. Complete this everyday to let others know you’re here and ready to collab',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Create onboarding guide',
        description: [
          {
            children: [
              {
                text: 'Create a 1 pager to give folks some context to your org and attach to Docs section!',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Invite friends',
        description: [
          {
            children: [
              {
                text: 'Invite friends to your community. We’re all in this together!',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.TASK]: [
      {
        title: 'Define community purpose and goals',
        description: [
          {
            children: [
              {
                text: 'Clearly define what is the purpose of this social community and set realistic goals to achieve.',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Develop Community Guidelines',
        description: [
          {
            children: [
              {
                text: 'Set clear guidelines about what behavior is acceptable or not within the community, such as tone of voice, content standards etc.',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Proactively engage with others',
        description: [
          {
            children: [
              {
                text: 'Actively engage with members by participating in conversations they start on social media channels; monitor comments/feedback regularly to ensure everyone feels included & valued',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.MILESTONE]: [
      { title: 'Gain 100 new community members' },
      { title: 'Plan and host the inaugural community book club event' },
      { title: 'Reach 75% capacity for our Web3 education series' },
    ],
  },
  [DAO_CATEGORIES_KEYS.SERVICE_DAO]: {
    [ENTITIES_TYPES.POD]: [{ title: 'Public outreach' }, { title: 'Marketing' }, { title: 'Product' }],
    [ENTITIES_TYPES.BOUNTY]: [
      {
        title: 'Daily engagement activity',
        description: [
          {
            children: [
              {
                text: 'This is our easiest task. Complete this everyday to let others know you’re here and ready to collab',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Create onboarding guide',
        description: [
          {
            children: [
              {
                text: 'Create a 1 pager to give folks some context to your org and attach to Docs section!',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Invite friends',
        description: [
          {
            children: [
              {
                text: 'Invite friends to your community. We’re all in this together!',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.TASK]: [
      {
        title: 'Establish governance structure',
        description: [
          {
            children: [
              {
                text: 'Develop a hierarchical system that assigns roles and responsibilities clearly among members of the DAO. To ensure seamless operation across all areas',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Set up communication plan',
        description: [
          {
            children: [
              {
                text: 'Create effective channels of communication between members so everyone feels connected with each other',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Create methods for incentivizing participation',
        description: [
          {
            children: [
              {
                text: 'Rewarding active participants within communities more concretely than just reputation-based systems.',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.MILESTONE]: [
      { title: 'Win $10k in grant money' },
      { title: 'Discover product and service market fit' },
      { title: 'Earn 5 new customers' },
    ],
  },
  [DAO_CATEGORIES_KEYS.GAMING]: {
    [ENTITIES_TYPES.POD]: [{ title: 'Community management' }, { title: 'Game guides' }, { title: 'Content creation' }],
    [ENTITIES_TYPES.BOUNTY]: [
      {
        title: 'Daily engagement activity',
        description: [
          {
            children: [
              {
                text: 'This is our easiest task. Complete this everyday to let others know you’re here and ready to collab',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Create onboarding guide',
        description: [
          {
            children: [
              {
                text: 'Create a 1 pager to give folks some context to your org and attach to Docs section!',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Invite friends',
        description: [
          {
            children: [
              {
                text: 'Invite friends to your community. We’re all in this together!',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.TASK]: [
      {
        title: 'Video streaming sessions',
        description: [
          {
            children: [
              {
                text: 'Organize live-streaming sessions on platforms like Twitch or YouTube where experienced players can offer advice or showcase their gameplay skills while interacting with viewers in real-time.',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Discussion forums',
        description: [
          {
            children: [
              {
                text: 'Set up online forums for gamers to talk about their favorite games, share tips and tricks, and connect with others in the community.',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Community survey',
        description: [
          {
            children: [
              {
                text: 'Set up online forums for gamers to talk about their favorite games, share tips and tricks, and connect with others in the community.',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.MILESTONE]: [
      { title: 'Win a major game event' },
      { title: 'Develop a new game in-house' },
      { title: 'Plan and host a gaming tournament' },
    ],
  },
  [DAO_CATEGORIES_KEYS.BUILDING_PRODUCTS]: {
    [ENTITIES_TYPES.POD]: [{ title: 'Product' }, { title: 'Design' }, { title: 'Engineering' }],
    [ENTITIES_TYPES.BOUNTY]: [
      {
        title: 'Daily engagement activity',
        description: [
          {
            children: [
              {
                text: 'This is our easiest task. Complete this everyday to let others know you’re here and ready to collab',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Create onboarding guide',
        description: [
          {
            children: [
              {
                text: 'Create a 1 pager to give folks some context to your org and attach to Docs section!',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Invite friends',
        description: [
          {
            children: [
              {
                text: 'Invite friends to your community. We’re all in this together!',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.TASK]: [
      {
        title: 'Conduct market research',
        description: [
          {
            children: [
              {
                text: 'Gather insights about the target market and identify their needs and preferences.',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Define Product Requirements',
        description: [
          {
            children: [
              {
                text: 'Create a detailed list of features, specifications, and requirements for the product based on research findings.',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Create prototype',
        description: [
          {
            children: [
              {
                text: 'Build a physical or digital prototype of the product to test its functionality, usability, and design with potential users.',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.MILESTONE]: [
      { title: 'Create our first working prototype' },
      { title: 'Plan Alpha launch' },
      { title: 'Retain 50% of our Alpha partners' },
    ],
  },
  [DAO_CATEGORIES_KEYS.REFI]: {
    [ENTITIES_TYPES.POD]: [{ title: 'Sustainability' }, { title: 'Social good' }, { title: 'Risk management' }],
    [ENTITIES_TYPES.BOUNTY]: [
      {
        title: 'Daily engagement activity',
        description: [
          {
            children: [
              {
                text: 'This is our easiest task. Complete this everyday to let others know you’re here and ready to collab',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Create onboarding guide',
        description: [
          {
            children: [
              {
                text: 'Create a 1 pager to give folks some context to your org and attach to Docs section!',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Invite friends',
        description: [
          {
            children: [
              {
                text: 'Invite friends to your community. We’re all in this together!',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.TASK]: [
      {
        title: 'Engage with community organizations',
        description: [
          {
            children: [
              {
                text: 'Collaborate with local or digital community groups who are working towards a shared goal of creating positive social and environmental outcomes through responsible financial management',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Implement education programs on Regenerative Finance',
        description: [
          {
            children: [
              {
                text: 'Develop educational resources aimed at encouraging people within an organization or wider community to understand the importance of investing sustainably',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Create sustainability plan',
        description: [
          {
            children: [
              {
                text: 'Work with relevant stakeholders to create a comprehensive sustainability plan that incorporates regenerative finance principles into decision-making processes.',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.MILESTONE]: [
      { title: 'Reduce carbon footprint to 0' },
      {
        title: 'Invest in 10 people from minority communities to help them start their dream project',
      },
    ],
  },
  [DAO_CATEGORIES_KEYS.CREATOR_COMMUNITY]: {
    [ENTITIES_TYPES.POD]: [{ title: 'Fan clubs' }, { title: 'Events' }, { title: 'Swag' }],
    [ENTITIES_TYPES.BOUNTY]: [
      {
        title: 'Daily engagement activity',
        description: [
          {
            children: [
              {
                text: 'This is our easiest task. Complete this everyday to let others know you’re here and ready to collab',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Create onboarding guide',
        description: [
          {
            children: [
              {
                text: 'Create a 1 pager to give folks some context to your org and attach to Docs section!',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Invite friends',
        description: [
          {
            children: [
              {
                text: 'Invite friends to your community. We’re all in this together!',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.TASK]: [
      {
        title: 'Create guidelines and rules',
        description: [
          {
            children: [
              {
                text: 'Draft clear written guidelines outlining what is permitted and not permitted within the community to ensure member safety and create an environment that fosters productive discussion.',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Define the purpose and goals of the community',
        description: [
          {
            children: [
              {
                text: 'Establishing clear objectives and expectations is crucial to creating a successful community.',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Plan regular events and activities',
        description: [
          {
            children: [
              {
                text: 'Organize virtual events (like live Q&As), webinars workshops or opportunities that allow for networking between creators in ways specific to their industry without being overwhelming.',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.MILESTONE]: [
      { title: 'Host IRL event' },
      { title: 'Design and distribute merchandise to community' },
      { title: 'Grow community by 10%' },
    ],
  },
  [DAO_CATEGORIES_KEYS.DESCI]: {
    [ENTITIES_TYPES.POD]: [{ title: 'Engineering' }, { title: 'Governance' }, { title: 'Quality Assurance' }],
    [ENTITIES_TYPES.BOUNTY]: [
      {
        title: 'Daily engagement activity',
        description: [
          {
            children: [
              {
                text: 'This is our easiest task. Complete this everyday to let others know you’re here and ready to collab',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Create onboarding guide',
        description: [
          {
            children: [
              {
                text: 'Create a 1 pager to give folks some context to your org and attach to Docs section!',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Invite friends',
        description: [
          {
            children: [
              {
                text: 'Invite friends to your community. We’re all in this together!',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.TASK]: [
      {
        title: 'Identify existing standards',
        description: [
          {
            children: [
              {
                text: 'It is useful to investigate whether there are any existing standards or protocols that can serve as a basis for building the new one.',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Determine scope of protocol',
        description: [
          {
            children: [
              {
                text: 'Determine which features should be included in the protocol, and also identify those that should be excluded from its scope.',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Define error handling procedures',
        description: [
          {
            children: [
              {
                text: 'Establish rules around when errors occur during interactions according to their severity level; then determine appropriate responses by both parties involved based on those levels designated earlier',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.MILESTONE]: [
      { title: 'Release V1 of our protocol' },
      { title: 'Honor all service level agreements' },
      { title: 'Fix all bugs in 24 hours or less' },
    ],
  },
  DEFAULT: {
    [ENTITIES_TYPES.POD]: [{ title: 'Content' }, { title: 'Community' }, { title: 'Swag' }],
    [ENTITIES_TYPES.BOUNTY]: [
      {
        title: 'Daily engagement activity',
        description: [
          {
            children: [
              {
                text: 'This is our easiest task. Complete this everyday to let others know you’re here and ready to collab',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Create onboarding guide',
        description: [
          {
            children: [
              {
                text: 'Create a 1 pager to give folks some context to your org and attach to Docs section!',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Invite friends',
        description: [
          {
            children: [
              {
                text: 'Invite friends to your community. We’re all in this together!',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.TASK]: [
      {
        title: 'Define community goals',
        description: [
          {
            children: [
              {
                text: 'Clearly articulate the purpose and values of your digital community.',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Encourage conversations through questions, polls, etc.',
        description: [
          {
            children: [
              {
                text: 'Use different strategies like open-ended questions/polls/surveys in order to encourage discussion amongst readership',
              },
            ],
            type: 'p',
          },
        ],
      },
      {
        title: 'Plan consistent promotional activity',
        description: [
          {
            children: [
              {
                text: 'Market new features/campaigns/updates using email listservs/social media channels regularly in order maintain engagement levels while encouraging newcomers',
              },
            ],
            type: 'p',
          },
        ],
      },
    ],
    [ENTITIES_TYPES.MILESTONE]: [
      { title: 'Host first IRL event' },
      { title: 'Grow the community by 10%' },
      { title: 'Define community compensation structure' },
    ],
  },
};
