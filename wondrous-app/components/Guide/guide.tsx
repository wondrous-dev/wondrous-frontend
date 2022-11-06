import { StepTitle, StepBody, EndGuideButton } from './styles';

export const guideConfig = {
  '/explore': {
    id: 'explore_guide',
    steps: [
      // {
      //   selector: '#tour-header-create-btn',
      //   position: 'bottom',
      //   content: () => (
      //     <div>
      //       <StepTitle gradient="linear-gradient(180deg, #ffffff 0%, #06ffa5 100%)">Create tasks</StepTitle>
      //       <StepBody>You can create tasks, proposals, pods, and milestones by clicking this button.</StepBody>
      //     </div>
      //   ),
      //   nextButtonTitle: 'Sounds good',
      //   prevButtonTitle: 'Skip training',
      //   prevAction: 'skip',
      // },
      {
        selector: '#tour-header-dashboard-icon',
        position: 'bottom',
        content: () => (
          <div>
            <StepTitle gradient="linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)">Your Dashboard</StepTitle>
            <StepBody>
              All of your most important work across projects live here. Check this every day to see what you need to do
              next.
            </StepBody>
          </div>
        ),
        nextButtonTitle: 'Will do',
        prevButtonTitle: 'Skip training',
        prevAction: 'skip',
      },
      {
        selector: '#tour-user-profile',
        position: 'right',
        content: () => (
          <div>
            <StepTitle gradient="linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)">Your profile</StepTitle>
            <StepBody>Build your epic web3 resume here. (Don’t forget to delete your LinkedIn.)</StepBody>
          </div>
        ),
        nextButtonTitle: 'Love it',
        prevButtonTitle: 'Skip training',
        prevAction: 'skip',
      },
      {
        selector: '#tour-sidebar-explore-top',
        position: 'right',
        content: () => (
          <div>
            <StepTitle gradient="linear-gradient(180deg, #FFFFFF 0%, #06FFA5 100%)">Explore the Wonderverse</StepTitle>
            <StepBody>Here you can discover, launch, and join new web3 projects.</StepBody>
          </div>
        ),
        nextButtonTitle: 'Great to know',
        prevButtonTitle: 'Skip training',
        prevAction: 'skip',
      },
      {
        selector: '#tour-sidebar-daos',
        position: 'center',
        content: () => (
          <div>
            <StepTitle gradient="linear-gradient(180deg, #FFFFFF 0%, #00BAFF 100%)">
              Press SHIFT+S for shortcuts.
            </StepTitle>
            <StepBody>
              Simply press shift+s together to show all the shortcuts around app. List in tutorial button in sidebar.
            </StepBody>
          </div>
        ),
        nextButtonTitle: 'Great to know',
        prevButtonTitle: 'Skip training',
        prevAction: 'skip',
      },
      {
        selector: '#tour-shortcuts',
        position: 'right',
        content: () => (
          <div>
            <StepTitle gradient="linear-gradient(180deg, #FFFFFF 0%, #00BAFF 100%)">
              Your Orgs will appear here.
            </StepTitle>
            <StepBody>Join new organizations through invite links or apply to one through the explore.</StepBody>
          </div>
        ),
        nextButtonTitle: 'Great to know',
        prevButtonTitle: 'Skip training',
        prevAction: 'skip',
      },
      {
        selector: '#tour-sidebar-daos',
        position: 'center',
        bypassElem: true,
        content: () => (
          <div>
            <StepTitle gradient="linear-gradient(180deg, #FFFFFF 0%, #FFD653 100%)">It’s time...</StepTitle>
            <StepBody>
              You’re ready. Join some awesome projects, earn cold hard crypto, and make your dent in the Wonderverse.
            </StepBody>
          </div>
        ),
        hideButtons: true,
        endButton: ({ onClick }) => <EndGuideButton onClick={onClick}>LFG</EndGuideButton>,
      },
    ],
  },
};
