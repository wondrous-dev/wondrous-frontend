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
  Pressable
} from 'react-native'
import { TouchableOpacity as RNGHTouchableOpacity } from "react-native-gesture-handler"
import Animated, { withDecay } from "react-native-reanimated"

import { Grey400, Blue400, Green400, White, Grey450, Purple, Red400, Yellow300 } from '../../../constants/Colors'
import CompleteSvg from '../../../assets/images/complete.svg'
import ArchiveSvg from '../../../assets/images/archive.svg'
import { SafeImage, SvgImage } from '../Image'
import { RegularText, TinyText } from '../Text'
import { formatDueDate } from '../../../utils/date'
import { spacingUnit } from '../../../utils/common'
import PriorityFlame from '../../../assets/images/modal/priority'

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
    marginTop: spacingUnit,
    flexDirection: 'row',
    alignItems: 'center'
  },
  dueText: {
    color: Grey450
  },
  tag: {
    borderRadius: 8,
    paddingLeft: spacingUnit * 1.5,
    paddingRight: spacingUnit * 1.5
  },
  topInfoContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  profilePicture: {
    width: spacingUnit * 4,
    height: spacingUnit * 4,
    borderRadius: spacingUnit * 2
  }
})

const Tag = ({ color, children, style }) => (
  <View style={[styles.tag, {
    backgroundColor: color,
    ...style
  }]}>
    {children}
  </View>
)

class Card extends React.Component {

  state = {

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
          transform: [{ translateX: multiply(sub(1, percentOpen), -100) }], // Translate from left on open,
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
  
  renderOverlay = ({ item, openLeft, openRight, openDirection, close  }) => {
    const { name, dueDate, projectName, useProfilePicture, user, priority } = item.item
    const {
      profilePicture
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
    return (
      <View style={[styles.row, { backgroundColor: White, width: '100%' }]}>
            <PlatformTouchable
              onLongPress={item.drag}
              style={[{ width: 5, alignItems: "flex-start" }]}
            >
              <Text style={styles.text}>{` `}</Text>
            </PlatformTouchable>
        <PlatformTouchable style={[styles.flex, { width: '100%', alignItems: 'flex-start'}]} onLongPress={item.drag}>
          <View style={styles.topInfoContainer}>
            {
              profilePicture && 
              <SafeImage src={profilePicture} style={styles.profilePicture} />
            }
            <Text style={[styles.text]}>{name}</Text>
          </View>
          <View style={styles.bottomInfoContainer}>
            {
              priority &&
              <PriorityFlame color={sortPriority()} style={{
                // marginLeft: spacingUnit,
                marginRight: spacingUnit
              }} />
            }
            <Tag color={Purple} style={{
              marginRight: spacingUnit * 0.75
            }}>
              <RegularText color={White}>
                {projectName}
              </RegularText>
            </Tag>
            <RegularText color={Grey450} style={styles.dueText}>
              Due by {formatDueDate(new Date(dueDate))}
            </RegularText>
          </View>
        </PlatformTouchable>
          <PlatformTouchable  onLongPress={item.drag} style={[{ width: 5, alignItems: "flex-end" }]}>
            <Text style={styles.text}>{` `}</Text>
          </PlatformTouchable>
      </View>
    );
  }

  render () {
    const { item, drag, isActive, itemRefs, swipeEnabled } = this.props
    return (
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
          }
          if (snapPoint > 90 && snapPoint !== 0 && open === 'right') {
            //TODO: Implement goal/task complete functionality
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

    )
  }
}

export { Card }