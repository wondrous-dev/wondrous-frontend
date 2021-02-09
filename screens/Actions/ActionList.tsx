import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { SafeAreaView, View} from 'react-native'

import { Card } from '../../storybook/stories/Card'
import { GET_TASKS_FROM_GOAL, GET_ASK_BY_ID } from '../../graphql/queries'

import { White } from '../../constants/Colors'
import { Header } from '../../components/Header'
import { FlatList } from 'react-native'
import { renderCard } from '../Profile/common'
import { spacingUnit } from '../../utils/common'
import apollo from '../../services/apollo'

const ActionList = ({ route, navigation }) => {
  const {
    goalId,
    taskId,
    routeLabel,
    type,
    askIds,
    tab
  } = route.params

  const [getTasks, { 
    data: goalTasks
  }] = useLazyQuery(GET_TASKS_FROM_GOAL)
  const [askData, setAskData] = useState([])
  let data = []
  
  useEffect(() => {
    if (type === 'task' && goalId) {
      getTasks({
        variables: {
          goalId
        }
      })
    } else if (type === 'ask') {
      populateData(askIds)
    }
  }, [])

  const populateData = useCallback(async (askArray) => {
    const promises = askArray.map((askId) => {
      return apollo.query({
        query: GET_ASK_BY_ID,
        variables: {
          askId
        }
      })
    })
    const contents = await Promise.all(promises)
    const newArray = contents.map(item => {
      return item && item.data && item.data.getAskById
    })
    setAskData(newArray)
  }, [])

  if (goalTasks) {
    data = goalTasks && goalTasks.getTasksFromGoal
  } else if (askData && askData.length > 0) {
    data = askData
  }

  const itemRefs = useRef(new Map())
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header title={routeLabel} />
      <View style={{
        marginTop: spacingUnit * 3
      }}>
        <FlatList
          data={data}
          renderItem={({ item }) => renderCard({ navigation,item, itemRefs, type, tab })}
        />
      </View>
    </SafeAreaView>
  )
}

export default ActionList
