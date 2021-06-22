import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, SafeAreaView, Platform, Image, Dimensions } from 'react-native'
import * as Notifications from 'expo-notifications'
import * as Sentry from 'sentry-expo'

import Branch from '../services/branch'
import { RootStackParamList } from '../types'
import { Orange, Black, White, Green400, Grey800 } from '../constants/Colors'
import { Title, Subheading, Paragraph, ButtonText } from '../storybook/stories/Text'
import { MyCarousel } from '../storybook/stories/Carousel'
import { PrimaryButton, SecondaryButton } from '../storybook/stories/Button'
import { scale, moderateScale, verticalScale } from '../utils/scale'
import { navigateUserOnLogin, snakeToCamelObj, spacingUnit, usePrevious } from '../utils/common'
import { getAuthHeader, useMe, withAuth } from '../components/withAuth'
import { useQuery } from '@apollo/client'
import { GET_LOGGED_IN_USER, WHOAMI } from '../graphql/queries'
import apollo from '../services/apollo'
import { getNotificationPressFunction } from './Notifications'
import Rocket from '../assets/images/rocket_transparent_loop.gif'
import ExampleApp from '../assets/images/homepage-icon.png'
import { MY_USER_INVITE } from '../graphql/queries/userInvite'

const redirectUser = async (user, navigation) => {
  const token = await getAuthHeader()
  if (token) {
    await apollo.writeQuery({
      query: WHOAMI,
      data: {
        users: [user]
      }
    })
    navigateUserOnLogin(user, navigation)
  }
}

function HomeScreen({
  navigation,
  route
}: StackScreenProps<RootStackParamList, 'Home'>) {
  const user = useMe()
  const { data } = useQuery(GET_LOGGED_IN_USER, {
    fetchPolicy: 'no-cache'
  })
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
      Branch.subscribe(bundle => {
        if (bundle && bundle.params && !bundle.error) {
          setInvitorFirstName(bundle.params?.invitor_firstname)
          setInvitorLastName(bundle.params?.invitor_lastname)
          writeInvite({
            userInvitationId: bundle.params?.user_invitation_id || null,
            invitorFirstName: bundle.params?.invitor_firstname || null,
            invitorLastName: bundle.params?.invitor_lastname || null,
            groupId: bundle.params?.group_id || null
          })
        }
      })
    }

    if (data && data.getLoggedinUser) {
      redirectUser(data.getLoggedinUser, navigation)
    }
  }, [data, navigation])

  return (
    <SafeAreaView style={styles.container}>
      <Title style={{
        color: White,
        marginTop: spacingUnit * 10,
        fontFamily: 'Rubik SemiBold',
        fontSize: 35
      }}>
        Welcome to Wonder
      </Title>
      <MyCarousel data={homeScreens} activeDotColor={White} passiveDotColor={Grey800} containerStyle={{
        marginTop: 0
      }} />
      <PrimaryButton onPress={() => navigation.push('Signup')} textStyle={{
        color: White
      }} textPressStyle = {{
        color: White
      }} style={{
        marginTop: spacingUnit,
        zIndex: 10
      }}>
          <ButtonText style={{
            fontSize: 16
          }} color={White}>
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
          }} color={Grey800}>
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
    backgroundColor: Orange,
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