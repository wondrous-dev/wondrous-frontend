import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native'

import { RootStackParamList } from '../types'
import { Orange, Black } from '../constants/Colors'
import { styles } from '../HomeScreen'
import { Title, Subheading, Paragraph, ButtonText } from '../../storybook/stories/Text'
import { registerForPushNotificationsAsync } from '../../components/Notifications/RegisterNotification'
import Snapper from '../../components/Camera'
import { DescriptionTextEditor  } from '../../storybook/stories/TextEditor'
import { CardList } from '../../storybook/stories/CardList'
import { withAuth, useMe } from '../../components/withAuth'
import { SafeAreaView } from 'react-native-safe-area-context'

const loginStyles = StyleSheet.create({
  container: {
    ...styles.container
  },

})

function WelcomeScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'Welcome'>) {
  const user = useMe()
  const [image, setImage] = React.useState('')
  const [snapperOpen, setSnapperOpen] = React.useState(false)
  React.useEffect(() => {
    registerForPushNotificationsAsync(user.id)
  }, [])

  return (
    <SafeAreaView style={styles.container}>
    <View style={{ flex: 1, width: '100%' }}>
      <Title>
        Welcome to Wonder! Successfully logged in
      </Title>
      <TouchableOpacity onPress={() => setSnapperOpen(true)}>
        <Text style={{
          marginTop: 16
        }}>Turn on camera</Text>
      </TouchableOpacity>
      {
        snapperOpen && <Snapper setSnapperOpen={setSnapperOpen} snapperOpen={snapperOpen} setImage={setImage} image={image} />
      }
      {
        !!(image) && <Image source={{
          uri: image
        }} style={{
          resizeMode: 'contain',
        width: '100%',
        aspectRatio: 1 // Your aspect ratio
        }} />
      }
      <CardList />
      <DescriptionTextEditor  />
    </View>
    </SafeAreaView>
  )
}

export default withAuth(WelcomeScreen)