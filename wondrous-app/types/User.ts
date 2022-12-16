export interface UserInfo {
  __typename: 'UserInfo';
  email: string;
  discordUsername: string;
  twitterUsername?: any;
  orbit1Tweet?: any;
}

export interface User {
  __typename: 'User';
  id: string;
  username: string;
  bio: string;
  activeEthAddress: string;
  profilePicture: string;
  headerPicture?: any;
  thumbnailPicture: string;
  userInfo: UserInfo;
  signupCompleted?: any;
  lastCompletedGuide: string;
  links?: any;
}
