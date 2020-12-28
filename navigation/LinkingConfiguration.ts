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
      FeedItem: {
        screens: {
          FeedItem: 'feedItem'
        }
      },
      Root: {
        screens: {
          TabOne: {
            screens: {
              TabOneScreen: 'one',
            },
          },
          TabTwo: {
            screens: {
              TabTwoScreen: 'two',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
}
