import { useMutation, useQuery } from '@apollo/client'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { SafeAreaView, View, StyleSheet, Pressable, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native'
import { Header } from '../../components/Header'
import { White, Black, Red400, Green400, Grey400 } from '../../constants/Colors'
import { GET_REVIEW_STATS } from '../../graphql/queries/review'
import { ButtonText, Paragraph, Subheading } from '../../storybook/stories/Text'
import { spacingUnit } from '../../utils/common'
import GoalIcon from '../../assets/images/review/goal'
import TaskIcon from '../../assets/images/review/task'
import { PrimaryButton } from '../../storybook/stories/Button'
import { withAuth } from '../../components/withAuth'
import { CREATE_REVIEW } from '../../graphql/mutations'
import Sad from '../../assets/images/emoji/sad'
import SlightFrown from '../../assets/images/emoji/slightFrown'
import Neutral from '../../assets/images/emoji/neutral'
import Smile from '../../assets/images/emoji/smile'
import StarEyes from '../../assets/images/emoji/starEyes'

import { TextEditor } from '../../storybook/stories/TextEditor'
import { TextEditorContext } from '../../utils/contexts'

const createReviewStyles = StyleSheet.create({
  emojiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  emoji: {
    width: 28,
    height: 28,
    marginBottom: spacingUnit * 4,
  },
  emojiPressable: {
    marginLeft: spacingUnit  * 3
  },
  descriptionBox: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: Grey400,
    minHeight: spacingUnit * 9,
    padding: spacingUnit * 2,
    color: Black,
    borderRadius: 4,

  },
  renderSuggestion: {
    marginLeft: 0,
    width: Dimensions.get('window').width - (4 * spacingUnit)
  }
})

const CreateReview = ({ navigation, route }) => {
  const [createReview] = useMutation(CREATE_REVIEW)
  const [description, setDescription] = useState('')
  const [reviewScore, setReviewScore] = useState(null)

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header />
      <TouchableWithoutFeedback 
      onPress={() => Keyboard.dismiss()}>
      <View style={{
        marginTop: spacingUnit * 5,
        flex: 1,
        alignItems: 'center'
      }}>
        <View style={{
          padding: spacingUnit * 2,
          alignItems: 'center'
        }}>
        <Subheading color={Black} style={{
          textAlign: 'center',
          marginBottom: spacingUnit * 4
        }}>
         How do you feel about your progress this week?
        </Subheading>
        <View style={createReviewStyles.emojiRow}>
          <Pressable style={{
            ...createReviewStyles.emojiPressable,
            ...{
              marginLeft: 0
            }
          }}>
            <Sad style={createReviewStyles.emoji} />
          </Pressable>
          <Pressable style={createReviewStyles.emojiPressable}>
            <SlightFrown style={createReviewStyles.emoji} />
          </Pressable>
          <Pressable style={createReviewStyles.emojiPressable}>
            <Neutral style={createReviewStyles.emoji} />
          </Pressable>
          <Pressable style={createReviewStyles.emojiPressable}>
            <Smile style={createReviewStyles.emoji} />
          </Pressable>
          <Pressable style={createReviewStyles.emojiPressable}>
            <StarEyes style={createReviewStyles.emoji} />
          </Pressable>
        </View>
        <TextEditorContext.Provider value={{
            content: description,
            setContent: setDescription,
            placeholder: 'E.g. Last week was pretty productive! I completed goals A and B for my main project. But I should have slept better.'
          }}>
            <View style={{flex: 1}}>
          <TextEditor multiline style={createReviewStyles.descriptionBox}
          renderSuggestionStyle={createReviewStyles.renderSuggestion}
          />
          </View>
          </TextEditorContext.Provider>
      </View>
      </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default withAuth(CreateReview)