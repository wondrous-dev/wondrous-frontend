import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, SafeAreaView, Image, Dimensions } from 'react-native'
import * as Notifications from 'expo-notifications'
import * as Sentry from 'sentry-expo'

import Branch from '../services/branch'
import { RootStackParamList } from '../types'
import palette from 'theme/palette'
import { Title, Paragraph, ButtonText } from '../storybook/stories/Text'
import { MyCarousel } from '../storybook/stories/Carousel'
import { PrimaryButton, SecondaryButton } from '../storybook/stories/Button'
import { moderateScale } from '../utils/scale'
import { snakeToCamelObj, spacingUnit } from '../utils/common'
import { withAuth } from '../components/withAuth'
import apollo from '../services/apollo'
import { getNotificationPressFunction } from './Notifications'
import ExampleApp from '../assets/images/homepage-icon.png'
import { MY_USER_INVITE } from '../graphql/queries/userInvite'

function HomeScreen({
  navigation,
  route
}: StackScreenProps<RootStackParamList, 'Home'>) {
  const homeScreens = [
    {
      subheading: 'The social platform where builders crush their goals',
      paragraph: 'Wonder helps you build/learn in public so you are held socially accountable.'
    },
    {
      subheading: 'Set goals, complete tasks and build projects in public',
      paragraph: 'Wonder helps you build a following from day one. Get feedback and help from people interested in your projects. '
    },
    {
      subheading: 'Get help with your projects by growing a following and a team',
      paragraph: `Wonder tracks your milestones and goals so you can be proud of what you've achieved. You can then share this with the world!`
    }
  ]
  const [invitorFirstName, setInvitorFirstName] = React.useState('')
  const [invitorLastName, setInvitorLastName] = React.useState('')
  const writeInvite = async ({ userInvitationId, invitorFirstName, invitorLastName, groupId }) => {
    try {
      await apollo.writeQuery({
        query: MY_USER_INVITE,
        data: {
          userInvitation: {
            __typename: 'MyUserInvite',
            userInvitationId,
            invitorFirstName,
            invitorLastName,
            groupId
          }
        }
      })
    } catch (err) {
      Sentry.Native.captureEvent({
        message: 'Branch user invitation write failure',
        extra: err
      })
    }
  }
  const registerNotifications = () => {
    // Redirect from here
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      const cleanedData = snakeToCamelObj(data)
      // Any custom logic to see whether the URL needs to be handled
      //...
      if (navigation) {
        getNotificationPressFunction({
          notificationInfo: cleanedData,
          navigation,
          tab: 'Notifications',
          notifications: null,
          push: true
        })
      }
      // Let React Navigation handle the URL
      // listener(url)
    });

    return () => {
      // Clean up the event listeners
      // Linking.removeEventListener('url', onReceiveURL);
      backgroundSubscription.remove()
    }
  }
  React.useEffect(() => {
    if (navigation) {
      registerNotifications()
    }
    if (Branch) {
      Branch.subscribe(async (bundle: any) => {
        Sentry.Native.captureEvent({
          message: 'Branch user invitation',
          extra: bundle
        })
        if (bundle && !bundle.error) {
          try {
            const params = await Branch.getFirstReferringParams();
            setInvitorFirstName(params?.invitor_firstname)
            setInvitorLastName(params?.invitor_lastname)
            writeInvite({
              userInvitationId: params?.user_invitation_id || null,
              invitorFirstName: params?.invitor_firstname || null,
              invitorLastName: params?.invitor_lastname || null,
              groupId: params?.group_id || null
            })
          } catch (e) {
            console.log('Failed to get deeplink params!' + e)
          }
        }
      })
    }
  }, [navigation])

  return (
    <SafeAreaView style={styles.container}>
      <Title style={{
        color: palette.white,
        marginTop: spacingUnit * 10,
        fontFamily: 'Rubik SemiBold',
        fontSize: 35
      }}>
        Welcome to Wonder
      </Title>
      <MyCarousel data={homeScreens} activeDotColor={palette.white} passiveDotColor={palette.grey800} containerStyle={{
        marginTop: 0
      }} />
      <PrimaryButton onPress={() => navigation.push('Signup')} textStyle={{
        color: palette.white
      }} textPressStyle = {{
        color: palette.white
      }} style={{
        marginTop: spacingUnit,
        zIndex: 10
      }}>
          <ButtonText style={{
            fontSize: 16
          }} color={palette.white}>
          Get started
          </ButtonText>
      </PrimaryButton>
      <SecondaryButton onPress={() => navigation.push('Signup', {
        login: true
      })} style={{
        marginTop: spacingUnit * 1.5,
        marginBottom: spacingUnit * 2,
        zIndex: 10
      }}>
        <ButtonText style={{
            fontSize: 16
          }} color={palette.grey800}>
          Log in
        </ButtonText>
      </SecondaryButton>

      <Image style={styles.logo} source={ExampleApp} />
      {/* <NotificationTester /> */}
      {
        !!invitorFirstName &&
        <Paragraph style={{
          marginTop: spacingUnit * 2
        }}>
          Invited by{` `}
          <Paragraph style={{
            fontFamily: 'Rubik SemiBold'
          }}>
            {invitorFirstName} {invitorLastName}
          </Paragraph>
        </Paragraph>
      }
    </SafeAreaView>
  )
}

export default withAuth(HomeScreen)

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.orange,
    alignItems: 'center',
    paddingTop: 8
  },
  logo: {
    marginTop: moderateScale(0),
    width: Dimensions.get('window').width,
    resizeMode: 'contain',
    height: 400
  },
  subheading: {
    marginTop: moderateScale(8),
    fontWeight: 'bold'
  },
  paragraph: {
    marginTop: 16,
    textAlign: 'center'
  }
})