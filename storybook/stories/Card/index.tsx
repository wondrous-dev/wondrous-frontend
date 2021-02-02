import React from 'react'
import SwipeableItem from 'react-native-swipeable-item'
import { 
  View,
  Text,
  StyleSheet,
  Platform,
  UIManager,
  TouchableOpacity,
  Dimensions,
  Pressable,
  LayoutAnimation
} from 'react-native'
import { TouchableHighlight, TouchableOpacity as RNGHTouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler"
import Animated, { withDecay } from "react-native-reanimated"

import { Grey400, Blue400, Green400, White, Grey450, Purple, Red400, Yellow300, Grey300, Grey800 } from '../../../constants/Colors'
import CompleteSvg from '../../../assets/images/complete.svg'
import ArchiveSvg from '../../../assets/images/archive.svg'
import { SafeImage, SvgImage } from '../Image'
import { RegularText, TinyText } from '../Text'
import { formatDueDate, redDate } from '../../../utils/date'
import { spacingUnit, renderMentionString } from '../../../utils/common'
import PriorityFlame from '../../../assets/images/modal/priority'
import { FullScreenTaskModal } from '../../../components/Modal/TaskModal'
import { FullScreenGoalModal } from '../../../components/Modal/GoalModal'
import { FullScreenAskModal } from '../../../components/Modal/AskModal'
import { Tag } from '../../../components/Tag'
import { useNavigation } from '@react-navigation/native'
import apollo from '../../../services/apollo'
import { UPDATE_GOAL, UPDATE_TASK, UPDATE_ASK } from '../../../graphql/mutations'
import { cache } from 'webpack'

const { multiply, sub } = Animated
const isAndroid = Platform.OS === "android"

if (isAndroid && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PlatformTouchable = Pressable

const styles = StyleSheet.create({
  container: {
      backgroundColor: 'white',
      flex: 1,
  },
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    padding: 15,
    marginBottom: 16,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: Grey400,
    elevation: 7,
    shadowOpacity: 0.25,
    shadowColor: Grey400,
    shadowRadius: 2,
    shadowOffset: { width: 2, height: 2 }
  },
  text: {
    fontFamily: 'Rubik SemiBold',
    fontSize: 16,
    lineHeight: 24
  },
  underlayRight: {
    // flex: 1,
    justifyContent: "flex-start",
    backgroundColor: Green400,
    color: White
  },
  underlayLeft: {
    // flex: 1,
    backgroundColor: Grey400,
    justifyContent: "flex-end"
  },
  bottomInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dueText: {
    color: Grey450
  },
  topInfoContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  profilePicture: {
    width: spacingUnit * 4,
    height: spacingUnit * 4,
    borderRadius: spacingUnit * 2
  }
})

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
        <SvgImage width="16" height="16" srcElement={ArchiveSvg} />
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
        <SvgImage width="20" height="20" srcElement={CompleteSvg} />
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
    const { name, dueDate, project: {
      name: projectName
    }, useProfilePicture, user, priority, content } = item.item
    const {
      profilePicture,
      icon,
      iconSize,
      type,
      navigation,
      redirect,
      redirectParams
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
          navigation.navigate(redirect, redirectParams)
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
              marginLeft: type === 'goal' ? -8 : -4
            }}>
            {
              icon &&
              <Icon style={{
                width: iconSize,
                height: iconSize
              }} />

            }
            </View>
            <View>
            <Text style={[styles.text, {
              marginLeft: spacingUnit,
              paddingRight: 4
            }]}>{renderMentionString({ content: type === 'ask' ? content : name, textStyle: styles.text, navigation: this.props.navigation })}</Text>
            </View>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: spacingUnit,
            flex: 1
          }}>
            <View style={[styles.bottomInfoContainer, {
              flex: 1
            }]}>
              {
                priority &&
                <PriorityFlame color={sortPriority()} style={{
                  // marginLeft: spacingUnit,
                  marginRight: spacingUnit * 1.5
                }} />
              }
              <Tag color={Purple} style={{
                marginRight: spacingUnit  
              }}>
                <RegularText color={White}>
                  {projectName}
                </RegularText>
              </Tag>
              {dueDate &&
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
                    Completed
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
        key={item.key}
        item={{ item, drag }}
        swipeEnabled={swipeEnabled}
        ref={ref => {
          if (ref && itemRefs && !itemRefs.get(item.key)) {
            itemRefs.set(item.key, ref);
          }
        }}
        onChange={({ open, snapPoint }) => {
          if (snapPoint > 90 && snapPoint !== 0 && open === 'left') {
            //TODO: Implement archive card functionality
            if (onSwipeLeft) {
              onSwipeLeft()
              // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
            }
          }
          if (snapPoint > 90 && snapPoint !== 0 && open === 'right') {
            //TODO: Implement goal/task complete functionality
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
        renderUnderlayLeft={this.renderUnderlayLeft}
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