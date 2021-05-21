import React from 'react'
import SwipeableItem from 'react-native-swipeable-item'
import { 
  View,
  Text,
  StyleSheet,
  Platform,
  UIManager,
  Pressable,
} from 'react-native'
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler"
import Animated from "react-native-reanimated"

import { Grey400, Blue400, Green400, White, Grey450, Purple, Red400, Yellow300, Grey300, Grey800 } from '../../../constants/Colors'
import CompleteSvg from '../../../assets/images/complete'
import ArchiveSvg from '../../../assets/images/archive'
import { RegularText, TinyText, Paragraph } from '../Text'
import { formatDueDate, redDate } from '../../../utils/date'
import { spacingUnit, renderMentionString } from '../../../utils/common'
import PriorityFlame from '../../../assets/images/modal/priority'
import { FullScreenTaskModal } from '../../../components/Modal/TaskModal'
import { FullScreenGoalModal } from '../../../components/Modal/GoalModal'
import { FullScreenAskModal } from '../../../components/Modal/AskModal'
import { Tag } from '../../../components/Tag'
import { useNavigation, useRoute } from '@react-navigation/native'
import apollo from '../../../services/apollo'
import { UPDATE_GOAL, UPDATE_TASK, UPDATE_ASK, NUDGE_TASK } from '../../../graphql/mutations'
import { GetReviewIcon } from '../../../screens/Review/utils'
import { format } from 'date-fns'
import RightCaret from '../../../assets/images/right-caret'
import Nudge from '../../../assets/images/actions/nudge'
import { styles } from './styles'
import Toast from 'react-native-toast-message'

const { multiply, sub } = Animated
const isAndroid = Platform.OS === "android"

if (isAndroid && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PlatformTouchable = Pressable

export const ReviewCard = ({ review, tab }) => {
  const navigation = useNavigation()
  return (
    <Pressable onPress={() => navigation.push('Root', {
      screen: tab || 'Profile',
      params: {
        screen: 'ReviewPage',
        params: {
          reviewId: review.id
        }
      }
    })}>
    <View style={[styles.row, { backgroundColor: White, justifyContent: 'space-between' }]}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
        <GetReviewIcon review={review}  style={{
          width: 24,
          height: 24,
          marginRight: spacingUnit
        }}/>
        <Paragraph style={{
          fontFamily: 'Rubik SemiBold',
        }}>
          Review on {format(new Date(review.createdAt), 'dd/MM/yy')}
        </Paragraph>
        </View>
        <View />
        <RightCaret />
    </View>
    </Pressable>
  )
}

class Card extends React.Component {

  state = {
    isVisible: false
  }

  constructor(props) {
    super(props)
  }

  renderUnderlayLeft = ({ item, percentOpen }) => (
    <Animated.View
      style={[styles.row, styles.underlayLeft, { opacity: percentOpen, borderWidth: 0 }]} // Fade in on open
    >
      <PlatformTouchable style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 4 }}>
        <Text style={[styles.text, { marginRight: 8 }]}>Archive</Text>
        <ArchiveSvg style={{
          width: 16,
          height: 16
        }} />
      </PlatformTouchable>
    </Animated.View>
  )

  renderUnderlayRight = ({ item, percentOpen, close }) => (
    <Animated.View
      style={[
        styles.row,
        styles.underlayRight,
        {
          // transform: [{ translateX: multiply(sub(1, percentOpen), -100) }], // Translate from left on open,
          borderWidth: 0,
          backgroundColor: this.props.isActive ? Grey400 : Green400
        }
      ]}
    >
      <PlatformTouchable style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={[styles.text, { color: White, marginRight: 4 }]}>Done</Text>
        <CompleteSvg style={{
          width: 20,
          height: 20
        }} />
      </PlatformTouchable>
    </Animated.View>
  )
  
  setModalVisible = (arg) => {
    this.setState({
      isVisible: arg
    })
  }

  updateGoal = (args) => {
    const { item } = this.props
    apollo.mutate({
      mutation: UPDATE_GOAL,
      update: (cache, { data }) => {
        cache.modify({
          fields: {
            getGoalsFromProject(existingGoals=[]) {
              // console.log('existingGoals', existingGoals)
              return existingGoals
            }
          }
        })
      },
      ...args
    })
  }

  updateTask = (args) => {
    apollo.mutate({
      mutation: UPDATE_TASK,
      update: (cache, { data }) => {
        cache.modify({
          fields: {
            getTasksFromProject(existingTasks=[]) {
              // console.log('existingGoals', existingGoals)
              // return existingGoals
            }
          }
        })
      },
      ...args
    })
  }

  updateAsk = (args) => {
    apollo.mutate({
      mutation: UPDATE_ASK,
      update: (cache, {}) => {
        cache.modify({
          fields: {
            getAsksFromProject(existingAsks=[]) {

            }
          }
        })
      }
    })
  }
  renderOverlay = ({ item, openLeft, openRight, openDirection, close  }) => {
    const name = item?.item?.name
    const dueDate = item?.item?.dueDate
    const projectName = item?.item?.project?.name
    const priority = item?.item?.priority
    const content = item?.item?.content
    const completedAt = item?.item?.completedAt
    const status = item?.item?.status
    const id = item?.item?.id
    const onboarding = item?.item?.additionalData?.onboarding
    const {
      profilePicture,
      icon,
      iconSize,
      type,
      navigation,
      redirect,
      redirectParams,
      route,
      followBack
    } = this.props

    const sortPriority = () => {
      switch(priority) {
        case 'high':
          return Red400
        case 'medium':
          return Yellow300
        case 'low':
          return Blue400
      }
    }
    const Icon = icon
    const isRedDate = redDate(dueDate)
    return (
      <TouchableWithoutFeedback onPress={() => {
        if (!redirect) {
          this.setModalVisible(true)
        } else {
          navigation.push(redirect, redirectParams)
        }
      }}>
      <View style={[styles.row, { backgroundColor: White }]}>
            <PlatformTouchable
              onLongPress={item.drag}
              style={[{ width: 5, alignItems: "flex-start" }]}
            >
              <Text style={styles.text}>{` `}</Text>
            </PlatformTouchable>
        <PlatformTouchable style={[styles.flex, { alignItems: 'flex-start'}]} onLongPress={item.drag}>
          <View style={styles.topInfoContainer}>
            {/* {
              profilePicture && 
              <SafeImage src={profilePicture} style={styles.profilePicture} />
            } */}
            <View style={{
              marginLeft: -4
            }}>
            {
              icon &&
              <Icon style={{
                width: iconSize,
                height: iconSize
              }} />

            }
            </View>
            <View style={{
              flex: 20
            }}>
            <Text style={[styles.text, {
              marginLeft: spacingUnit,
              paddingRight: 4
            }]}>{renderMentionString({ content: type === 'ask' ? content : name, textStyle: styles.text, navigation: this.props.navigation, tab: route && route.params && route.params.tab })}</Text>
            </View>
            {
                status === 'created' && followBack && type === 'task' &&
                <>
                <View style={{
                  flex: 1
                }} />
                <TouchableOpacity containerStyle={{
                  marginLeft: spacingUnit
                }} onPress={async () => {
                  await apollo.mutate({
                    mutation: NUDGE_TASK,
                    variables:{
                      taskId: id
                    }
                  })
                  Toast.show({
                    text1: 'Nudge successfully sent!',
                    position: 'bottom',
                  })
                }}>
                  <Nudge color={Yellow300} />
                </TouchableOpacity>
                </>
              }
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: spacingUnit,
            flex: 1
          }}>
            <View style={[styles.bottomInfoContainer, {
              flex: 1,
              flexWrap: 'wrap'
            }]}>
              {
                priority &&
                <PriorityFlame color={sortPriority()} style={{
                  // marginLeft: spacingUnit,
                  marginRight: spacingUnit * 1.5
                }} />
              }
              {
                projectName &&
                <Tag color={Purple} style={{
                  marginRight: spacingUnit,
                  marginBottom: spacingUnit
                }}>
                  <RegularText color={White}>
                    {projectName}
                  </RegularText>
                </Tag>
              }
              {dueDate && !completedAt &&  
                  <RegularText color={isRedDate ? Red400 : Grey450} style={styles.dueText}>
                  Due {formatDueDate(new Date(dueDate))}
                </RegularText>
              }
            </View>
            <View>
              {
                item.item && item.item.status === 'completed' &&
                <Tag color={Green400} style={{
                }}>
                  <RegularText color={White}>
                    Completed {formatDueDate(new Date(completedAt))}
                  </RegularText>
                </Tag>
              }
              {
                item.item && item.item.status === 'archived' &&
                <Tag color={Grey300}>
                  <RegularText color={Grey800}>
                    Archived
                  </RegularText>
                </Tag>
              }
            </View>
          </View>
        </PlatformTouchable>
          <PlatformTouchable  onLongPress={item.drag} style={[{ width: 5, alignItems: "flex-end" }]}>
            <Text style={styles.text}>{` `}</Text>
          </PlatformTouchable>
      </View>
      </TouchableWithoutFeedback>
    );
  }

  render () {
    const { item, drag, isActive, itemRefs, swipeEnabled, type, onSwipeRight, onSwipeLeft } = this.props
    const {
      isVisible
    } = this.state
    const onboarding = item?.additionalData?.onboarding
    return (
        <>
                {
          type === 'goal' &&
          <FullScreenGoalModal goal={item} setModalVisible={this.setModalVisible} isVisible={isVisible} goalMutation={this.updateGoal} />
        }
        {
          type === 'task' &&
          <FullScreenTaskModal task={item} setModalVisible={this.setModalVisible} isVisible={isVisible} taskMutation={this.updateTask} />
        }
        {
          type === 'ask' &&
          <FullScreenAskModal ask={item} setModalVisible={this.setModalVisible} isVisible={isVisible} askMutation={this.updateAsk} />
        }
      <SwipeableItem
        key={item.id}
        item={{ item, drag }}
        swipeEnabled={swipeEnabled}
        ref={ref => {
          if (ref && itemRefs && !itemRefs.get(item.key)) {
            itemRefs.set(item.key, ref);
          }
        }}
        onChange={({ open, snapPoint }) => {
          if (snapPoint > 90 && snapPoint !== 0 && open === 'left' && !onboarding) {
            if (onSwipeLeft) {
              onSwipeLeft()
              // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
            }
          }
          if (snapPoint > 90 && snapPoint !== 0 && open === 'right') {
            if (onSwipeRight) {
              onSwipeRight()
              // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
            }
          }
          if (open) {
            // Close all other open items
            [...itemRefs.entries()].forEach(([key, ref]) => {
              if (key !== item.key && ref) ref.close();
            });
          }
        }}
        overSwipe={50}
        renderUnderlayLeft={({ item, percentOpen }) => {
          if (!onboarding) {
            this.renderUnderlayLeft({ item, percentOpen })
          }
        }}
        snapPointsLeft={[0, 100]}
        renderUnderlayRight={this.renderUnderlayRight}
        snapPointsRight={[0, 100]}
        renderOverlay={this.renderOverlay}
      />
      </>

    )
  }
}

export { Card }