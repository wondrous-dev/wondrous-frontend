import * as Linking from 'expo-linking'
import * as Notifications from 'expo-notifications'

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
  subscribe(listener) {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log('data', data)
      // Any custom logic to see whether the URL needs to be handled
      //...

      // Let React Navigation handle the URL
      // listener(url)
    });

    return () => {
      // Clean up the event listeners
      // Linking.removeEventListener('url', onReceiveURL);
      subscription.remove();
    }
  }
}
