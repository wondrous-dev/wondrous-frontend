import React from 'react';
import About from 'components/About';
import Tabs from 'components/Tabs';
import Token from 'components/TokenHeader';
import Wrapper from 'components/Wrapper';
import { SOCIAL_MEDIA_FACEBOOK, SOCIAL_MEDIA_LINKEDIN, SOCIAL_MEDIA_TWITTER, TASK_STATUS_DONE } from 'utils/constants';

const SAMPLE_DATA = {
  data: {
    pod: {
      name: 'PR Dream Team',
      description: 'Tortor aliquet dui posuere tortor in viverra orci cras quisque. Lectus mauris.',
      followers: 8500,
      link: {
        url: 'https://andros.io',
        text: 'andros.io',
      },
    },
    members: [
      {
        name: 'UserName',
        id: 'ea5232b9-1a6b-4ced-a368-f5f0139295ad',
        initials: 'LT',
        description: 'Building the future of work and play.',
        skills: ['JavaScript', 'React'],
        avatar: {
          src: '/images/boards/avatar.png',
          id: 'e5c92eca-7218-418f-a74b-7cf4932f6a36',
          // isOwnerOfPod: true,
        },
      },
      {
        name: 'AnotherUser',
        description: 'Building the future of work and play.',
        skills: ['JavaScript', 'React'],
        id: 'a7d1d8d5-ee35-4519-b9ec-dd42f71bea93',
        initials: 'AA',
        avatar: {
          src: '/images/boards/avatarNFT.png',
        },
      },
      {
        name: 'Third User',
        description: 'Building the future of work and play.',
        skills: ['JavaScript', 'React'],
        id: 'beac6b46-0b6b-4e23-b1b3-50492294e3e6',
        initials: 'IK',
        avatar: {
          src: '/images/boards/avatar.png',
        },
      },
      {
        name: 'Third User',
        description: 'Building the future of work and play.',
        skills: ['JavaScript', 'React'],
        id: 'beac6b46-0b6b-4e23-b1b3-50492294e3e6',
        initials: 'IK',
        avatar: {
          src: '/images/boards/avatar.png',
        },
      },
      {
        name: 'Third User',
        description: 'Building the future of work and play.',
        skills: ['JavaScript', 'React'],
        id: 'beac6b46-0b6b-4e23-b1b3-50492294e3e6',
        initials: 'IK',
        avatar: {
          src: '/images/boards/avatar.png',
        },
      },
      {
        name: 'Third User',
        description: 'Building the future of work and play.',
        skills: ['JavaScript', 'React'],
        id: 'beac6b46-0b6b-4e23-b1b3-50492294e3e6',
        initials: 'IK',
        avatar: {
          src: '/images/boards/avatar.png',
        },
      },
    ],
    milestones: [
      {
        id: 1,
        icon: 'wonder',
        title: 'Test Milestones',
        description: 'A social platform where founders build in public using crypto incentives.',
        avatar: '/images/boards/avatar.png',
        position: 'Founder',
      },
      {
        id: 2,
        icon: 'wonder',
        title: 'UpClick',
        description: 'Upclick is a custom e-commerce platform with expertise in sales tool.',
        avatar: '/images/boards/avatarNFT.png',
        position: 'Public Relations',
      },
    ],
    completedTasks: [
      {
        id: 31,
        likes: 14,
        shares: 12,
        comments: 8,
        title: 'Get 10,000 Twitter followers',
        description: 'Design google sheet where we can get an open look at our twitters performance ✨🦄 ',
        status: TASK_STATUS_DONE,
        actions: {
          comments: 8,
          likes: 14,
          shares: 12,
        },
        compensation: {
          amount: 2600,
          currency: 'wonder',
        },
        media: {
          id: 31,
          type: 'video',
          url: 'https://www.youtube.com/watch?v=HmpP7e9gLYs',
        },
        users: [
          {
            name: 'Third User',
            id: '0770c50c-8598-4b2a-ad75-0f58d5937e89',
            initials: 'JA',
          },
          {
            name: 'AnotherUser',
            id: 'a7d1d8d5-ee35-4519-b9ec-dd42f71bea93',
            initials: 'AA',
          },
        ],
      },
    ],
    socialMedia: [
      {
        name: SOCIAL_MEDIA_FACEBOOK,
        url: '',
      },
      {
        name: SOCIAL_MEDIA_TWITTER,
        url: '',
      },
      {
        name: SOCIAL_MEDIA_LINKEDIN,
        url: '',
      },
    ],
    links: [
      { link: 'http://manifesto.xyz', text: 'Our manifesto' },
      { link: 'http://mirror.xyz', text: 'Mirror article' },
      { link: 'http://andros.io', text: 'andros.io' },
    ],
  },
};

const tabsLinks = [
  {
    href: '/profile/boards',
    label: 'Boards',
  },
  {
    href: '/profile/activities',
    label: 'Activity',
  },
  {
    href: '/profile/about',
    label: 'About',
  },
];

const AboutPage = () => {
  return (
    <Wrapper {...SAMPLE_DATA}>
      <Token {...SAMPLE_DATA} />
      <Tabs tabsLinks={tabsLinks} />
      <About {...SAMPLE_DATA} />
    </Wrapper>
  );
};

export default AboutPage;
