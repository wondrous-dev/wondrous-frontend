export type RootStackParamList = {
  Home: undefined
  Signup: undefined
  Login: undefined
  Welcome: undefined
  Root: undefined
  Dashboard: undefined
  NotFound: undefined
  FeedItem: undefined
  Feed: undefined
  ProjectSetupCategory: undefined
  UsernameSetup: undefined
  FirstProjectSetup: undefined
  ProjectInviteCollaborators: undefined
  ProjectTagSelection: undefined
  ProjectCollaborators: undefined
  EmailSignup: undefined
  EmailSignin: undefined
  GroupSetup: undefined
  UserInterestCategory: undefined
  NotificationPrompt: undefined
  FollowRecommendation: undefined
}

export type ProfileTabParamList = {
  ProjectProfile: undefined
  UserProfile: {
    noGoingBack: boolean,
    tab: string,
    fetchedUser: any,
    initialSection: string,
  }
  WorkflowWelcome: undefined
  ProfileItem: undefined
  SetupGoal: undefined
  SetupTask: undefined
}

export type BottomTabParamList = {
  Dashboard: undefined
  Search: undefined
  Add: undefined
  Notifications: undefined
  Profile: undefined
}

export type TabOneParamList = {
  TabOneScreen: undefined
}

export type TabTwoParamList = {
  TabTwoScreen: undefined
}
