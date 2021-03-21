import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, ScrollView, Pressable } from 'react-native'
import { useLazyQuery, useMutation } from '@apollo/client'

import { withAuth, useMe } from '../../components/withAuth'
import { Header } from '../../components/Header'
import { Grey800, Purple, Red400, White, Black, Blue400, Grey450, Green400, Grey300 } from '../../constants/Colors'
import { FullScreenAskModal } from '../../components/Modal/AskModal'
import { pageStyles, ReactionFeed } from './common'
import { UPDATE_ASK } from '../../graphql/mutations'
import { ErrorText, Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { renderMentionString, spacingUnit } from '../../utils/common'
import { GET_ASK_BY_ID, GET_TASK_BY_ID, GET_GOAL_BY_ID } from '../../graphql/queries'
import { MyCarousel, VideoDisplay } from '../../storybook/stories/Carousel'
import LinkIcon from '../../assets/images/link'

const AskPage = ({ navigation, route }) => {
  const user = useMe()
  const {
    ask: initialAsk,
    askId,
    tab
  } = route.params
  const [ask, setAsk] = useState(initialAsk)
  const ownedByUser = (ask && ask.userId) === (user && user.id)
  const [modalVisible, setModalVisible] = useState(false)
  const [getAsk, {
    data,
    loading,
    error
  }] = useLazyQuery(GET_ASK_BY_ID)
  const [updateAsk] = useMutation(UPDATE_ASK, {
    update: (cache, { data }) => {
      if (data) {
        setAsk(data && data.updateAsk)
      }
      cache.modify({
        fields: {
          getAsksFromProject(existingAsks=[]) {

          },
          getAsksFromUser() {

          }
        }
      })
    }
  })

  const [getGoalName, {
    data: askGoal
  }] = useLazyQuery(GET_GOAL_BY_ID)

  const [getTaskName, {
    data: askTask
  }] = useLazyQuery(GET_TASK_BY_ID)

  useEffect(() => {
    if (!ask) {
      getAsk({
        variables: {
          askId
        }
      })
    }
    if (data) {
      setAsk(data.getAskById)
    }
    
    if (ask && ask.additionalData && ask.additionalData.relatedGoalIds) {
      getGoalName({
        variables: {
          goalId: ask && ask.additionalData && ask.additionalData.relatedGoalIds && ask.additionalData.relatedGoalIds[0]
        }
      })
    }
    if (ask && ask.additionalData && ask.additionalData.relatedTaskIds) {
      getTaskName({
        variables: {
          taskId: ask && ask.additionalData && ask.additionalData.relatedTaskIds && ask.additionalData.relatedTaskIds[0]
        }
      })
    }
  }, [data])


  if (!ask) {
    return (
      <View>
        {/* <ErrorText>
          No goal found
        </ErrorText> */}
      </View>
    )
  }
  const images = ask.additionalData && ask.additionalData.images
  const muxPlaybackId = ask.muxPlaybackId
  const goal = askGoal && askGoal.getGoalById
  const task = askTask && askTask.getTaskById
  let statusColor = Red400, statusTextColor=White, statusText='Open'
  if (ask.status === 'completed') {
    statusColor = Green400
    statusText = 'Completed'
  } else if (ask.status === 'archived') {
    statusColor= Grey300
    statusTextColor = White
    statusText = 'Archived'
  }
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <FullScreenAskModal setModalVisible={setModalVisible} isVisible={modalVisible} ask={ask} askMutation={updateAsk} />
      <Header title='Ask' rightButton={ownedByUser && {
        style: {
          borderWidth: 1,
          borderColor: Grey800
        },
        textColor: Grey800,
        text: 'Edit Ask',
        onPress: () => {
          setModalVisible(true)
        }
      }}/>
      <ScrollView style={pageStyles.container}>
        <Text style={pageStyles.title}>
          {renderMentionString({ content: ask.content, navigation, tab })}
        </Text>
        <View style={[pageStyles.infoContainer]}>
          <View style={{
            backgroundColor: statusColor,
            paddingLeft: spacingUnit * 1.5,
            paddingRight: spacingUnit * 1.5,
            borderRadius: 4,
            marginTop: spacingUnit
          }}>
          <RegularText color={statusTextColor}>
            Status: {statusText || 'Open'}
          </RegularText>
          </View>
        </View>
        {
          goal &&
          <View style={{
            marginTop: spacingUnit,
            flexDirection: 'row'
          }}>
            <RegularText color={Black}>
              From{` `}
                <RegularText onPress={() => navigation.push('Root', {
                screen: tab ||'Profile',
                params: {
                  screen: 'GoalPage',
                  params: {
                    goal
                  }
                }
              })} color={Blue400} style={{
                  marginLeft: spacingUnit * 0.5
                }}>
                  {goal.name} {` `} {
                    task &&
                    <>
                    <RegularText color={Black}>
                      ->
                    </RegularText>
                    <RegularText color={Blue400} onPress={() => navigation.push('Root', {
                      screen: tab || 'Profile',
                      params: {
                        screen: 'TaskPage',
                        params: {
                          task
                        }
                      }
                    })}>
                      {task.name}
                    </RegularText>
                    </>
                  }
                </RegularText>
            </RegularText>
          </View>
        }
        {
          task && !goal &&
          <View style={{
            marginTop: spacingUnit
          }}>
            <RegularText color={Black}>
              From{` `}
                <RegularText onPress={() => navigation.push('Root', {
                screen: tab || 'Profile',
                params: {
                  screen: 'TaskPage',
                  params: {
                    task
                  }
                }
              })} color={Blue400} style={{
                  marginLeft: spacingUnit * 0.5
                }}>
                  {task.name}
                </RegularText>
            </RegularText>
          </View>
        }
        {
          ask.additionalData && ask.additionalData.link &&
          <View style={pageStyles.linkContainer}>
            <LinkIcon color={Grey800} style={{
              marginRight: spacingUnit
            }} />
            <Paragraph color={Blue400} style={pageStyles.link}>
              {ask.additionalData.link}
            </Paragraph>
          </View>
        }
        <View style={pageStyles.imageContainer}>
        {!images && muxPlaybackId &&
          <VideoDisplay video={muxPlaybackId} />
        }
        {
          images &&
          <MyCarousel data={muxPlaybackId ? [
            {
              video: muxPlaybackId
            },
            ...images
          ] : images} images={true} passiveDotColor={Grey800} activeDotColor={Blue400} />
        }
        </View>
        <ReactionFeed type={'ask'} objId={ask.id} user={user} tab={tab} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default withAuth(AskPage)