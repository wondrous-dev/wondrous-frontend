import React from 'react'
import SwipeableItem from 'react-native-swipeable-item'
import { 
  View,
  Text,
  StyleSheet,
  Platform,
  UIManager,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import { TouchableOpacity as RNGHTouchableOpacity } from "react-native-gesture-handler"
import Animated from "react-native-reanimated"

import { Grey400, Black, Green400, White } from '../../../constants/Colors'
import CompleteSvg from '../../../assets/images/complete.svg'
import ArchiveSvg from '../../../assets/images/archive.svg'
import { SvgImage } from '../Image'

const { multiply, sub } = Animated
const isAndroid = Platform.OS === "android"

if (isAndroid && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PlatformTouchable = isAndroid ? RNGHTouchableOpacity : TouchableOpacity

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
    width: '100%',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Grey400,
    elevation: 7,
    shadowOpacity: 0.25,
    shadowColor: Grey400,
    shadowRadius: 2,
    shadowOffset: { width: 2, height: 2 }
  },
  text: {
    fontWeight: "bold",
    color: Black,
    fontSize: 16
  },
  underlayRight: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: Green400,
    color: White
  },
  underlayLeft: {
    flex: 1,
    backgroundColor: Grey400,
    justifyContent: "flex-end"
  }
})

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

  renderOverlay = ({ item, openLeft, openRight, openDirection, close }) => {
    const { detail } = item.item
    return (
      <View style={[styles.row, { backgroundColor: White }]}>
            <PlatformTouchable
              onLongPress={item.drag}
              style={[{ width: 5, alignItems: "flex-start" }]}
            >
              <Text style={styles.text}>{` `}</Text>
            </PlatformTouchable>
        <PlatformTouchable style={[styles.flex, { width: '100%'}]} onLongPress={item.drag}>
          <Text style={[styles.text, { width: '100%'}]}>{detail}</Text>
        </PlatformTouchable>
          <PlatformTouchable  onLongPress={item.drag} style={[{ width: 5, alignItems: "flex-end" }]}>
            <Text style={styles.text}>{` `}</Text>
          </PlatformTouchable>
      </View>
    );
  }

  render () {
    const { item, drag, isActive, itemRefs } = this.props
    console.log('Active?', isActive)
    return (
      <SwipeableItem
        key={item.key}
        item={{ item, drag }}
        ref={ref => {
          if (ref && !itemRefs.get(item.key)) {
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