import { makeVar } from '@apollo/client';

const CYBER_CONNECT_API = 'https://api.cyberconnect.dev';
const CYBER_CONNECT_DOMAIN = 'cyberconnect.me';
const CYBER_CONNECT_TOKEN_FIELD = 'cyberconnectAccessToken';
export const CYBER_CONNECT_HANDLE_STORAGE = 'cyberconnectHandle';

export const makeCyberConnectVar = makeVar('');

export const getHandle = async (address) => {
  const accessToken = localStorage.getItem(CYBER_CONNECT_TOKEN_FIELD);
  const existingHandle = localStorage.getItem(CYBER_CONNECT_HANDLE_STORAGE);
  if (existingHandle) {
    return existingHandle;
  }
  const graphqlQuery = {
    query: `query ExampleQuery($address: AddressEVM!) {
      address(address: $address) {
        wallet {
          profiles {
            edges {
              node {
                handle
              }
            }
          }
        }
      }
    }
  `,
    variables: {
      address,
    },
  };
  const getAddressResponse = await fetch(CYBER_CONNECT_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${accessToken}`,
    },
    body: JSON.stringify(graphqlQuery),
  });
  const addressJson = await getAddressResponse.json();
  const handle =
    addressJson.data?.address?.wallet?.profiles?.edges?.length > 0
      ? addressJson.data?.address?.wallet?.profiles?.edges[0]?.node?.handle
      : null;
  if (handle) {
    const splitHandle = handle?.split('.');
    localStorage.setItem(CYBER_CONNECT_HANDLE_STORAGE, splitHandle[0]);
    makeCyberConnectVar(splitHandle[0]);
    return splitHandle[0];
  }
};

export const getProfile = async (handle) => {
  const graphqlQuery = {
    operationName: 'profileByHandle',
    query: `query getLink3ProfileData($handle: String!) {
      profileByHandle(handle: $handle) {
        externalMetadataInfo {
          type
          verifiedTwitterID
          organization {
            cmcTokenId
            sector
            networks
          }
          personal {
            verifiedDiscordID
            title
            organization {
              id
              handle
              name
              avatar
            }
          }
          section {
            type
            name
          }
        }
      }
    }`,
    variables: { handle },
  };
  return await fetch(CYBER_CONNECT_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphqlQuery),
  });
};

export const cyberConnectSignin = async (address, signMessage) => {
  // const existingAccessToken = localStorage.getItem(CYBER_CONNECT_TOKEN_FIELD);
  // if (existingAccessToken) {
  //   return existingAccessToken;
  // }
  const signMessageGraphqlQuery = {
    operationName: 'loginGetMessage',
    query: `mutation loginGetMessage($domain:String!,$address:AddressEVM!) {
      loginGetMessage(input:{
        domain: $domain,
        address: $address
      }) {
        message
      }
    }`,
    variables: {
      domain: CYBER_CONNECT_DOMAIN,
      address,
    },
  };
  const messageResponse = await fetch(CYBER_CONNECT_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signMessageGraphqlQuery),
  });
  const messageJSON = await messageResponse?.json();
  const message = messageJSON?.data?.loginGetMessage?.message;
  const signedMessage = await signMessage(message);
  const loginVerifyGraphqlQuery = {
    oeprationName: 'loginVerify',
    query: `mutation loginVerify ($domain:String!,$address:AddressEVM!,$signature:String!) 
    {
      loginVerify(input:{
        domain:$domain,
        address:$address,
        signature:$signature
      }){
        accessToken
      }
    }`,
    variables: {
      address,
      domain: CYBER_CONNECT_DOMAIN,
      signature: signedMessage,
    },
  };
  const loginMessageResponse = await fetch(CYBER_CONNECT_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginVerifyGraphqlQuery),
  });
  const loginMessageJSON = await loginMessageResponse?.json();
  const loginToken = loginMessageJSON?.data?.loginVerify?.accessToken;
  if (loginToken) {
    localStorage.setItem(CYBER_CONNECT_TOKEN_FIELD, loginToken);
  }
  return loginToken;
};
