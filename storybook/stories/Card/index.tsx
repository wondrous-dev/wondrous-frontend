import React from 'react'
import SwipeableItem from 'react-native-swipeable-item'
import { 
  View,
  Text,
  StyleSheet,
  Platform,
  UIManager,
  TouchableOpacity
} from 'react-native'

import { Grey400, Black, Orange, White } from '../../../constants/Colors'
import { TouchableOpacity as RNGHTouchableOpacity } from "react-native-gesture-handler"
import Animated from "react-native-reanimated"

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
    borderWidth: 1,
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
    backgroundColor: Grey400
  },
  underlayLeft: {
    flex: 1,
    backgroundColor: "tomato",
    justifyContent: "flex-end"
  }
})

class Card extends React.Component {

  state = {

  }

  constructor(props) {
    super(props)
  }

  onRowDidOpen = () => {
    console.log('Hi')
  }

  onRowDidClose = () => {
    console.log('bye')
  }

  renderUnderlayLeft = ({ item, percentOpen }) => (
    <Animated.View
      style={[styles.row, styles.underlayLeft, { opacity: percentOpen }]} // Fade in on open
    >
      <PlatformTouchable onPressOut={() => console.log('hi')}>
        <Text style={styles.text}>{`[x]`}</Text>
      </PlatformTouchable>
    </Animated.View>
  )

  renderUnderlayRight = ({ item, percentOpen, close }) => (
    <Animated.View
      style={[
        styles.row,
        styles.underlayRight,
        {
          transform: [{ translateX: multiply(sub(1, percentOpen), -100) }] // Translate from left on open
        }
      ]}
    >
      <PlatformTouchable onPressOut={close}>
        <Text style={styles.text}>CLOSE</Text>
      </PlatformTouchable>
    </Animated.View>
  )

  renderOverlay = ({ item, openLeft, openRight, openDirection, close }) => {
    const { detail } = item.item
    return (
      <View style={[styles.row, { backgroundColor: White }]}>
            <PlatformTouchable

              onLongPress={item.drag}
              style={[{ flex: 0.1, alignItems: "flex-start" }]}
            >
              <Text style={styles.text}>{` `}</Text>
            </PlatformTouchable>
        <PlatformTouchable style={[styles.flex, { width: '100%'}]} onLongPress={item.drag}>
          <Text style={[styles.text, { width: '100%'}]}>{detail}</Text>
        </PlatformTouchable>
          <PlatformTouchable  onLongPress={item.drag} style={[{ flex: 0.1, alignItems: "flex-end" }]}>
            <Text style={styles.text}>{` `}</Text>
          </PlatformTouchable>
      </View>
    );
  }

  render () {
    const { cardInfo, setCardList, width, height, item, drag, moveEnd, isActive, itemRefs } = this.props
    console.log('move', drag, moveEnd)
    return (
      <SwipeableItem
        key={item.key}
        item={{ item, drag }}
        ref={ref => {
          if (ref && !itemRefs.get(item.key)) {
            itemRefs.set(item.key, ref);
          }
        }}
        onChange={({ open }) => {
          if (open) {
            // Close all other open items
            [...itemRefs.entries()].forEach(([key, ref]) => {
              if (key !== item.key && ref) ref.close();
            });
          }
        }}
        overSwipe={50}
        renderUnderlayLeft={this.renderUnderlayLeft}
        snapPointsLeft={[100, 300]}
        renderUnderlayRight={this.renderUnderlayRight}
        snapPointsRight={[100, 300]}
        renderOverlay={this.renderOverlay}
        activationThreshold={30}
      />

    )
  }
}

export { Card }