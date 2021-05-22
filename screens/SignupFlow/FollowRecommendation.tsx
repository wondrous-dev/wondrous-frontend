import React, { useEffect, useState } from 'react'
import { View, FlatList, Text, SafeAreaView} from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'

import { White, Black, Orange, Grey300, Grey800, Green400 } from '../../constants/Colors'
import { Subheading, Paragraph, ButtonText, ErrorText } from '../../storybook/stories/Text'
import { Header } from '../../components/Header'
import { useMutation, useQuery } from '@apollo/client'
import { GET_RECOMMENDED_USERS_TO_FOLLOW } from '../../graphql/queries'
import { projectSetupStyles } from './ProjectSetupCategory'
import { spacingUnit } from '../../utils/common'
import BigMouthSmile from '../../assets/images/emoji/openMouthSmile'
import HeartEyes from '../../assets/images/emoji/heartEyes'
import { withAuth, useMe } from '../../components/withAuth'
import { UserItem } from '../Profile/UserList'
import { SET_USER_SIGNUP_COMPLETE } from '../../graphql/mutations'

const FollowRecommendation = ({ navigation }) => {
  const user = useMe()
  const {
    data
  } = useQuery(GET_RECOMMENDED_USERS_TO_FOLLOW)
  const [setSignupComplete] = useMutation(SET_USER_SIGNUP_COMPLETE)
  const [finished, setFinished] = useState(false)

  return (
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}>
    <Header rightButton={{
        color: Orange,
        text: 'Finish',
        onPress: () => {
          setFinished(true)
          setSignupComplete()
          setTimeout(() => {
            navigation.push('Root', {
              screen: 'Profile',
              params: {
                screen: 'UserProfile',
                params: {
                  initialSection: 'action'
                }
              }
            })
          }, 2000)
        }
      }}/>
    <View style={projectSetupStyles.progressCircleContainer}>
                    <AnimatedCircularProgress
                prefill={80}
                fill={finished ? 100 : 80}
                size={100}
                width={10}
                backgroundColor={Grey300}
                tintColor={finished ? Green400: Orange}
                style={{
                  position: 'absolute',
                  top: -spacingUnit
                }}
                rotation={0}
              />
              <View style={{
                marginTop: spacingUnit * 3.5
              }}>
              {finished ? 
                  <HeartEyes />
                  :
                  <BigMouthSmile />
              }
              </View>
                    <View style={{
                      ...projectSetupStyles.stepContainer,
                      marginTop: spacingUnit * 5
                    }}>
                        <Text style={projectSetupStyles.stepCount}>step 3/3</Text>
                    </View>
                </View>
    
    <Subheading color={Black} style={{
        fontSize: 36,
        textAlign: 'center',
        marginTop: spacingUnit
      }}>
        Follow builders
      </Subheading>
      <Paragraph style={{
        marginTop: spacingUnit,
        paddingLeft: spacingUnit * 2,
        paddingRight: spacingUnit * 2,
        textAlign: 'center'
      }} color={Grey800}>
        The magic of Wonder is working with our community, so come follow our top users!
      </Paragraph>
      <FlatList
        contentContainerStyle={{
          paddingLeft: spacingUnit * 2,
          paddingRight: spacingUnit * 2,
          marginTop: spacingUnit * 3
        }}
        data={data?.getRecommendedUsersToFollow || []}
        renderItem={({ item }) => {
          const followingUsers = user?.usersFollowing
          const userFollowing = followingUsers.some((element) => {
            return element === item.id
          })
          return (
            <UserItem
              initialFollowing={userFollowing}
              existingUserFollowing={followingUsers}
              item={item}
              itemPressed={() => {}}
            />
          )
        }}
      />
    </SafeAreaView>
  )
}

export default withAuth(FollowRecommendation)
