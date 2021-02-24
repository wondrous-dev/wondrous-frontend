import * as Linking from 'expo-linking'

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Home: {
        screens: {
          Home: 'home'
        }
      },
      Signup: {
          screens: {
            Signup: 'signup'
          }
      },
      Login: {
        screens: {
          Login: 'login'
        }
      },
      EmailSignin: {
        screens: {
          Login: 'emailSignin'
        }
      },
      EmailSignup: {
        screens: {
          Login: 'emailSignup'
        }
      },
      Welcome: {
        screens: {
          Welcome: 'welcome'
        }
      },
      Dashboard: {
        screens: {
          Dashboard: 'dashboard'
        }
      },
      ProjectSetupCategory: {
        screens: {
          ProjectSetupCategory: 'projectSetupCategory'
        }
      },
      UsernameSetup: {
        screens: {
          UsernameSetup: 'usernameSetup'
        }
      },
      ProjectTagSelection : {
        screens: {
          ProjectTagSelection: 'projectTagSelection'
        }
      },
      FirstProjectSetup: {
        screens: {
          FirstProjectSetup: 'firstProjectSetup'
        }
      },
      Root: {
        screens: {
          Feed: {
            screens: {
              Feed: 'feed'
            }
          },
          FeedItem: {
            screens: {
              FeedItem: 'feedItem'
            }
          },
        },
      },
      NotFound: '*',
    },
  },
}
