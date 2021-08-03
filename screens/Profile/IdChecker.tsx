import { useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header } from '../../components/Header'
import { View } from '../../components/Themed'
import { White } from '../../constants/Colors'
import { GET_PROJECT_BY_ID, GET_USER } from '../../graphql/queries'
import { ErrorText } from '../../storybook/stories/Text'

const TIMEOUT = 8000
const IdChecker = ({ navigation, route }) => {
  const {
    id,
    tab
  } = route.params
  const { data: projectData } = useQuery(GET_PROJECT_BY_ID, {
    variables: {
      projectId: id
    }
  })
  const { data: userData } = useQuery(GET_USER, {
    variables: {
      userId: id
    }
  })
  const [error, setError] = useState('')
  useEffect(() => {
    if (projectData && projectData.getProjectById) {
      navigation.navigate('Root', {
        screen: tab || 'Profile',
        params: {
          screen:'ProjectProfile',
          params: {
            fetchedProject: projectData.getProjectById,
            projectId: projectData.getProjectById.id
          }
        }
      })
    } else if (userData && userData.getUser) {
      navigation.navigate('Root', {
        screen: tab || 'Profile',
        params: {
          screen:'OtherUserProfile',
          params: {
            fetchedUser: userData.getUser,
            userId: userData.getUser.id
          }
        }
      })
    }
    setTimeout(() => {
      setError('No entity found with this username')
    }, TIMEOUT)
  }, [projectData, userData])
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header />
      <View>
        {
          error
          ?
          <ErrorText style={{
            fontSize: 16
          }}>
            {error}
          </ErrorText>
          :
          <ActivityIndicator />
        }
      </View>
    </SafeAreaView>
  )
}

export default IdChecker