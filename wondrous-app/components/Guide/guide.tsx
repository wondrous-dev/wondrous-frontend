import { StepTitle, StepBody } from './styles';

const projectHomeSteps = [
  {
    selector: '#tour-header-create-btn',
    position: 'bottom',
    content: () => (
      <div>
        <StepTitle gradient="linear-gradient(180deg, #FFFFFF 0%, #06FFA5 100%)">Your creation button</StepTitle>
        <StepBody>Create tasks, proposals, and milestones by clicking here.</StepBody>
      </div>
    ),
    nextButtonTitle: 'Continue',
    prevButtonTitle: 'Skip training',
    prevAction: 'skip',
  },
  {
    selector: '#tour-header-project-settings',
    position: 'right',
    content: () => (
      <div>
        <StepTitle gradient="linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)">Settings</StepTitle>
        <StepBody>
          Here you can configure payment methods, Gnosis wallets, integrations, task imports and more!{' '}
        </StepBody>
      </div>
    ),
    nextButtonTitle: 'Continue',
    prevButtonTitle: 'Skip training',
    prevAction: 'skip',
  },
  {
    selector: '#tour-header-project-pods',
    position: 'right',
    content: () => (
      <div>
        <StepTitle gradient="linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)">Pods</StepTitle>
        <StepBody>
          Pods are the teams within your org. They can be made private or public and be subject to gating rules
          configured in settings.
        </StepBody>
      </div>
    ),
    nextButtonTitle: 'Continue',
    prevButtonTitle: 'Skip training',
    prevAction: 'skip',
  },
  {
    selector: '#tour-header-project-tasks',
    position: 'left',
    content: () => (
      <div>
        <StepTitle gradient="linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)">Tasks</StepTitle>
        <StepBody>
          Tasks are the central units of work led by a single contributor. You can assign them or create applications to
          filter contributors. You can reward tasks with payment methods of your choice or with a flexible points
          system. You can create subtasks within tasks.{' '}
        </StepBody>
      </div>
    ),
    nextButtonTitle: 'Continue',
    prevButtonTitle: 'Skip training',
    prevAction: 'skip',
  },
  {
    selector: '#tour-header-project-bounties',
    position: 'left',
    content: () => (
      <div>
        <StepTitle gradient="linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)">Bounties</StepTitle>
        <StepBody>
          Bounties are flexible tasks that can have many submissions and have one off or variable payout amounts to
          reward better submissions.{' '}
        </StepBody>
      </div>
    ),
    nextButtonTitle: 'Continue',
    prevButtonTitle: 'Skip training',
    prevAction: 'skip',
  },
  {
    selector: '#tour-header-project-milestones',
    position: 'left',
    content: () => (
      <div>
        <StepTitle gradient="linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)">Milestones</StepTitle>
        <StepBody>
          Milestones are goals that you or your teams are tracking toward. It can be a metric, like gain 10k twitter
          followers, or a mini-project (like a sprint) with a bunch of tasks within it.{' '}
        </StepBody>
      </div>
    ),
    nextButtonTitle: 'Continue',
    prevButtonTitle: 'Skip training',
    prevAction: 'skip',
  },
  {
    selector: '#tour-header-project-proposals',
    position: 'left',
    content: () => (
      <div>
        <StepTitle gradient="linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)">Proposals</StepTitle>
        <StepBody>
          Proposals are a way for you to tap into your community for feedback, governance decisions, and much more.
          Users can create proposals that can be approved or denied by admins. Proposals can be voted on through polls
          or a Snapshot vote. Once accepted, proposals turn into tasks.{' '}
        </StepBody>
      </div>
    ),
    nextButtonTitle: 'Continue',
    prevButtonTitle: 'Skip training',
    prevAction: 'skip',
  },
  {
    selector: '#tour-header-project-collabs',
    position: 'left',
    content: () => (
      <div>
        <StepTitle gradient="linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)">Collabs</StepTitle>
        <StepBody>
          Collabs are shared workspaces between you and your partners. You can share work between multiple orgs while
          being able to see everything aggregated in your mission control{' '}
        </StepBody>
      </div>
    ),
    nextButtonTitle: 'Continue',
    prevButtonTitle: 'Skip training',
    prevAction: 'skip',
  },
  {
    selector: '#tour-header-project-grants',
    position: 'left',
    content: () => (
      <div>
        <StepTitle gradient="linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)">Grants</StepTitle>
        <StepBody>
          You can create and manage grants given to your community to build projects for your org. You can gate who can
          apply, generate application templates and pay out grants.{' '}
        </StepBody>
      </div>
    ),
    nextButtonTitle: 'Continue',
    prevButtonTitle: 'Skip training',
    prevAction: 'skip',
  },
  {
    selector: '#tour-header-project-docs',
    position: 'left',
    content: () => (
      <div>
        <StepTitle gradient="linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)">Docs</StepTitle>
        <StepBody>
          You can link documents (Google docs, Notion, Figma, etc) so your community can get more context/resources
          about you. These can be made to be members only or public.{' '}
        </StepBody>
      </div>
    ),
    nextButtonTitle: 'Finish',
    prevButtonTitle: 'Skip training',
    prevAction: 'skip',
    nextAction: 'finish',
  },
];

export const guideConfig = {
  '/mission-control': {
    id: 'mission_control_guide',
    steps: [
      {
        selector: '#tour-header-create-btn',
        position: 'bottom',
        content: () => (
          <div>
            <StepTitle gradient="linear-gradient(180deg, #FFFFFF 0%, #06FFA5 100%)">Your creation button</StepTitle>
            <StepBody>Create tasks, proposals, and milestones by clicking here.</StepBody>
          </div>
        ),
        nextButtonTitle: 'Continue',
        prevButtonTitle: 'Skip training',
        prevAction: 'skip',
      },
      {
        selector: '#tour-header-personal-navigation',
        position: 'bottom',
        content: () => (
          <div>
            <StepTitle gradient="linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)">
              Your personal navigation
            </StepTitle>
            <StepBody>Access your Profile and Personal Workspace here</StepBody>
          </div>
        ),
        nextButtonTitle: 'Continue',
        prevButtonTitle: 'Skip training',
        prevAction: 'skip',
      },
      {
        selector: '#tour-header-project-navigation',
        position: 'bottom',
        content: () => (
          <div>
            <StepTitle gradient="linear-gradient(180deg, #FFFFFF 0%, #06FFA5 100%)">Navigate projects</StepTitle>
            <StepBody>Here you can navigate, explore, and create projects</StepBody>
          </div>
        ),
        nextButtonTitle: 'Continue',
        prevButtonTitle: 'Skip training',
        prevAction: 'skip',
      },
      {
        selector: '#tour-header-launch',
        position: 'center',
        content: () => (
          <div>
            <StepTitle gradient="linear-gradient(180deg, #FFFFFF 0%, #FFD653 100%)">Let’s get to work</StepTitle>
            <StepBody>Want to create a project or find an existing one to join?</StepBody>
          </div>
        ),
        nextButtonTitle: 'Finish',
        prevButtonTitle: 'Skip training',
        prevAction: 'skip',
        nextAction: 'finish',
      },
    ],
  },
  '/organization/[username]/home': {
    id: 'organization_home_guide',
    steps: projectHomeSteps,
  },
  '/pod/[podId]/home': {
    id: 'pod_home_guide',
    steps: projectHomeSteps.filter(
      (item) => item.selector !== '#tour-header-project-collabs' && item.selector !== '#tour-header-project-pods'
    ),
  },
};
