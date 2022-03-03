import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import apollo from '../../services/apollo';
import {
  GET_LOGGED_IN_USER,
  GET_LOGGED_IN_WAITLIST_USER,
  GET_USER_SIGNING_MESSAGE,
  WHOAMI,
} from '../../graphql/queries';
import {
  CONNECT_USER_WALLET,
  CREATE_USER,
  CREATE_WALLET_USER,
  LOGIN_MUTATION,
  LOGIN_WALLET_MUTATION,
} from '../../graphql/mutations';
import { useRouter } from 'next/router';

const MyContext = React.createContext(null);
const EXCLUDED_PATHS = [
  '/invite/[token]',
  '/organization/[username]/boards',
  '/organization/[username]/about',
  '/login',
  '/pod/[podId]/boards',
];

export const useMe = () => {
  return useContext(MyContext);
};

export const emailSignup = async (email: string, password: string) => {
  try {
    const {
      data: {
        emailSignup: { user, token },
      },
    } = await apollo.mutate({
      mutation: CREATE_USER,
      variables: {
        email,
        password,
      },
    });

    if (user) {
      // Set Apollo with Session
      await storeAuthHeader(token, user);
      return true;
    }
    return 'This email is already registered. Try recovering password.';
  } catch (err) {
    return 'This email is already registered. Try recovering password.';
  }
};

export const walletSignup = async (web3Address: string, signedMessage: string, blockchain: string) => {
  try {
    const {
      data: {
        signupWithWeb3: { user, token },
      },
    } = await apollo.mutate({
      mutation: CREATE_WALLET_USER,
      variables: {
        web3Address,
        signedMessage,
        blockchain,
      },
    });

    if (user) {
      // Set Apollo with Session
      await storeAuthHeader(token, user);
      return true;
    }
    return 'We hit a problem, please contact support.';
  } catch (err) {
    return 'We hit a problem, please contact support.';
  }
};

export const emailSignin = async (email: string, password: string) => {
  try {
    const {
      data: {
        emailSignin: { user, token },
      },
    } = await apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: {
        email: email,
        password: password,
      },
    });

    if (user) {
      // Set Apollo with Session
      await storeAuthHeader(token, user);
      return true;
    }
    return 'Incorrect Email and Password combination';
  } catch (err) {
    return 'Incorrect Email and Password combination';
  }
};

export const walletSignin = async (web3Address: string, signedMessage: string) => {
  try {
    const {
      data: {
        signinWithWeb3: { user, token },
      },
    } = await apollo.mutate({
      mutation: LOGIN_WALLET_MUTATION,
      variables: {
        web3Address,
        signedMessage,
      },
    });

    if (user) {
      // Set Apollo with Session
      await storeAuthHeader(token, user);
      return true;
    }
    return 'Sign up with this wallet address first.';
  } catch (err) {
    console.log(err);
    return 'Sign up with this wallet address first.';
  }
};

export const getUserSigningMessage = async (
  web3Address: string,
  blockchain: string,
  includeUserExistsCheck?: boolean
) => {
  try {
    const { data } = await apollo.mutate({
      mutation: GET_USER_SIGNING_MESSAGE,
      variables: {
        web3Address,
        blockchain,
      },
    });

    if (includeUserExistsCheck) {
      return data.getUserSigningMessage;
    }
    return data.getUserSigningMessage.signingMessage;
  } catch (e) {
    console.log('error retrieving nonce', e);
    return false;
  }
};

export const getAuthHeader = () => {
  return localStorage.getItem('wonderToken') || null;
};

export const getWaitlistAuthHeader = () => {
  return localStorage.getItem('waitlistToken') || null;
};

export const linkWallet = async (web3Address: string, signedMessage: string, blockchain: string) => {
  try {
    const {
      data: { connectUserWallet: user },
    } = await apollo.mutate({
      mutation: CONNECT_USER_WALLET,
      variables: {
        web3Address,
        signedMessage,
        blockchain,
      },
    });

    if (user) {
      // Store the user on the session (no token update)
      await storeAuthHeader(null, user);
      return true;
    }

    return false;
  } catch (err) {
    console.log('Error linking wallet: ', err);
    return false;
  }
};

export const storeAuthHeader = async (token, user) => {
  if (token) {
    localStorage.setItem('wonderToken', token);
  }

  if (user) {
    try {
      await apollo.writeQuery({
        query: WHOAMI,
        data: {
          users: [user],
        },
      });
    } catch (e) {
      console.log('error writing user into apollo', e);
    }
  }
};

export const storeAuthWaitlistHeader = async (token, waitlistUser) => {
  localStorage.setItem('waitlistToken', token);
  if (waitlistUser) {
    try {
      await apollo.writeQuery({
        query: GET_LOGGED_IN_WAITLIST_USER,
        data: {
          getLoggedinWaitlistUser: {
            __typename: 'WaitlistUser',
            ...waitlistUser,
          },
        },
      });
    } catch (e) {
      console.log('error writing waitlist user into apollo', e);
    }
  }
};

export const logout = async () => {
  try {
    localStorage.removeItem('wonderToken');
    await apollo.clearStore();
    window.location.href = '/';
  } catch (exception) {
    return false;
  }
};

export const withAuth = (Component, noCache = false) => {
  const AuthComponent = (props) => {
    const { navigation, route } = props;
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [tokenLoading, setTokenLoading] = useState(true);
    const { data, loading, error } = useQuery(GET_LOGGED_IN_USER);
    useEffect(() => {
      (async () => {
        const newToken = await getAuthHeader();
        setToken(newToken);
        setTokenLoading(false);
      })();
    }, [token]);
    if (
      error?.graphQLErrors &&
      error?.graphQLErrors[0]?.extensions.code === 'UNAUTHENTICATED' &&
      !EXCLUDED_PATHS.includes(router.pathname)
    ) {
      logout();
    }
    if (!tokenLoading && !token) {
      // Back to the world
      if (!EXCLUDED_PATHS.includes(router.pathname)) {
        window.location.href = '/login';
      }
      return <Component {...props} />;
    } else {
      const user = data?.getLoggedinUser;
      if (user && !user?.username) {
        router.push('/onboarding/welcome');
      }
      return (
        <MyContext.Provider value={user}>
          <Component {...props} user={user} />
        </MyContext.Provider>
      );
    }
  };
  return AuthComponent;
};

export const withWaitlistAuth = (Component, noCache = false) => {
  const WaitlistAuthComponent = (props) => {
    const [token, setToken] = useState(null);
    const [tokenLoading, setTokenLoading] = useState(true);
    const { data, loading, error } = useQuery(GET_LOGGED_IN_WAITLIST_USER);

    useEffect(() => {
      (async () => {
        const newToken = await getWaitlistAuthHeader();
        setToken(newToken);
        setTokenLoading(false);
      })();
    }, [token]);

    if (!tokenLoading && !token) {
      return <Component {...props} />;
    } else {
      const user = data?.getLoggedinWaitlistUser;
      return (
        <MyContext.Provider value={user}>
          <Component {...props} user={user} />
        </MyContext.Provider>
      );
    }
  };
  return WaitlistAuthComponent;
};
