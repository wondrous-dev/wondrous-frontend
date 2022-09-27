import { useMe } from 'components/Auth/withAuth';
import { ActionButton } from 'components/Common/Task/styles';
import { Wrapper, WrapperHeader, WrapperSubheader } from './styles';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const LoggedOutUser = ({ user, token }) => {
  return (
    <Wrapper>
      <WrapperHeader>My DAO is on Wonder</WrapperHeader>
      <WrapperSubheader>Log-in and accept the invitation</WrapperSubheader>
      <Link href={`/login?collabInvite=${token}`}>
        <ActionButton>Log in and accept</ActionButton>
      </Link>
    </Wrapper>
  );
};

export const MissingUserActions = ({ user, token }) => {
  
  const href = user ? `/onboarding-dao?collabInvite=${token}` : `/login?collabInvite=${token}`;;  
  return (
    <Wrapper>
      <WrapperHeader>My DAO is not on Wonder</WrapperHeader>
      <WrapperSubheader>Easy, just create a DAO and accept!</WrapperSubheader>
      <Link href={href}>
      <ActionButton>Create org and accept</ActionButton>
      </Link>
    </Wrapper>
  );
};

const CONFIG = {
  NO_LOGGED_IN_USER: [LoggedOutUser, MissingUserActions],
  LOGGED_IN_USER: [MissingUserActions],
};

const Actions = () => {
  const user = useMe();

  const router = useRouter();
  const { token } = router.query;

  let componentsConfig;
  
  if (!user) {
    componentsConfig = CONFIG.NO_LOGGED_IN_USER;
  }
  return componentsConfig?.map((Component, index) => <Component key={index} user={user} token={token} />);
};

export default Actions;
