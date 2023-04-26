const TWITTER_CLIENT_ID = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID;
const DEFAULT_TWITTER_SCOPE = 'users.read%20tweet.read%20follows.read%20like.read%20offline.access';

export const getTwitterCallbackUrl = () => {
  if (process.env.NEXT_PUBLIC_PRODUCTION) {
    return 'https%3A%2F%2Fapp.wonderverse.xyz%2Ftwitter%2Fcallback';
  }
  if (process.env.NEXT_PUBLIC_STAGING) {
    return 'https%3A%2F%2Fwondrous-app-git-staging-wonderverse.vercel.app%2Ftwitter%2Fcallback';
  }
  return 'http%3A%2F%2Flocalhost%3A3000%2Ftwitter%2Fcallback';
};

export const buildTwitterAuthUrl = (challengeCode, state?) => {
  if (!state) {
    state = 'state';
  }
  const redirectUri = getTwitterCallbackUrl();
  return `https://twitter.com/i/oauth2/authorize?client_id=${TWITTER_CLIENT_ID}&scope=${DEFAULT_TWITTER_SCOPE}&response_type=code&redirect_uri=${redirectUri}&state=${state}&code_challenge=${challengeCode}&code_challenge_method=plain`;
};
