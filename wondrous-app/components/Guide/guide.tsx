import { StepTitle, StepBody } from './styles';

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
};
