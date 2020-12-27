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
      FeedItem: {
        screens: {
          FeedItem: 'feeditem'
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
