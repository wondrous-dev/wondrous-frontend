import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, ScrollView, Pressable } from 'react-native'
import { useLazyQuery, useMutation } from '@apollo/client'

import { withAuth, useMe } from '../../components/withAuth'
import { Header } from '../../components/Header'
import { palette.grey800, Purple, palette.red400, White, palette.black, palette.blue400, Grey450, palette.green400, palette.grey300 } from '../../constants/Colors'
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

  const [status, setStatus] = useState(null)
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
    if (ask?.status) {
      setStatus(ask?.status)
    }
  }, [data, ask])


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
  let statusColor = palette.red400, statusTextColor=White, statusText='Open'
  const completed = status === 'completed'
  const archived = status === 'archived'

  if (completed) {
    statusColor = palette.green400
    statusText = 'Completed'
  } else if (archived) {
    statusColor= palette.grey300
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
          borderColor: palette.grey800
        },
        textColor: palette.grey800,
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
          {
            completed || archived
            ?
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
            :
            <>
            {
              ownedByUser &&
              <Pressable onPress={() => {
                setStatus('completed')
                updateAsk({
                  variables: {
                    askId: ask?.id,
                    input: {
                      status: 'completed'
                    }
                  }
                })
  
              }} style={pageStyles.markAsComplete}>
                <RegularText color={palette.green400}>
                  Mark as complete
                </RegularText>
              </Pressable>
            }
            </>
          }
        </View>
        {
          goal &&
          <View style={{
            marginTop: spacingUnit,
            flexDirection: 'row'
          }}>
            <RegularText color={palette.black}>
              From{` `}
                <RegularText onPress={() => navigation.navigate('Root', {
                screen: tab ||'Profile',
                params: {
                  screen: 'GoalPage',
                  params: {
                    goal
                  }
                }
              })} color={palette.blue400} style={{
                  marginLeft: spacingUnit * 0.5
                }}>
                  {goal.name} {` `} {
                    task &&
                    <>
                    <RegularText color={palette.black}>
                      ->
                    </RegularText>
                    <RegularText color={palette.blue400} onPress={() => navigation.navigate('Root', {
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
            <RegularText color={palette.black}>
              From{` `}
                <RegularText onPress={() => navigation.navigate('Root', {
                screen: tab || 'Profile',
                params: {
                  screen: 'TaskPage',
                  params: {
                    task
                  }
                }
              })} color={palette.blue400} style={{
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
            <LinkIcon color={palette.grey800} style={{
              marginRight: spacingUnit
            }} />
            <Paragraph color={palette.blue400} style={pageStyles.link}>
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
          ] : images} images={true} passiveDotColor={palette.grey800} activeDotColor={palette.blue400} />
        }
        </View>
        <ReactionFeed type={'ask'} objId={ask.id} user={user} tab={tab} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default withAuth(AskPage)