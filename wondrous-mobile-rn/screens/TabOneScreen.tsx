import * as React from 'react'
import { StyleSheet, Button } from 'react-native'

import EditScreenInfo from '../components/EditScreenInfo'
import { Text, View } from '../components/Themed'

export default function TabOneScreen() {
  const [count, setCount] = React.useState(0)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wonder</Text>
      <Text style={styles.title}>{count}</Text>
      <Button title='increment' onPress={() => setCount(count + 1)} />
      <View style={styles.separator} lightColor='#eee' darkColor='rgba(255,255,255,0.1)' />
      <EditScreenInfo path='/screens/TabOneScreen.js' />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
