import React, { createContext, useContext, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, ScrollView, Text, Image, SafeAreaView, Dimensions, Pressable } from 'react-native'
import ProgressCircle from 'react-native-progress-circle'

import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { categories, projectSetupStyles } from './ProjectSetupCategory'
import { spacingUnit } from '../../utils/common'
import { Black, Blue600, Yellow300, Grey300, White, Orange } from '../../constants/Colors'
import { Subheading, RegularText, ButtonText, ErrorText } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import { useMutation, useQuery } from '@apollo/client'
import BigMouthSmile from '../../assets/images/emoji/openMouthSmile'
import { withAuth, useMe } from '../../components/withAuth'
import { CREATE_USER_INTERESTS } from '../../graphql/mutations'
import { GET_USER_INTERESTS } from '../../graphql/queries'

const UserInterestCategoryContext = createContext(null)


const CategoryItem = ({ category }) => {
  const CategoryImage = category.image
  const { interests, setInterests, setError, error } = useContext(UserInterestCategoryContext)
  let categoryColors = null
  const title = category.title.toLowerCase()
  if (interests.includes(title)) {
    categoryColors = {
      iconColor: White,
      backgroundColor: Blue600
    }
  }

  return (
      <View style={{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }} key={category.title}>
        <Pressable onPress={() => {
          if (interests.includes(title)) {
            // Remove from interests
            const filteredInterests = interests.filter(interest => interest !== title)
            setInterests(filteredInterests)
          } else {
            if (interests.length < 3) {
              const newInterests = [...interests, title]
              setInterests(newInterests)
            }
          }
        }} style={{
          alignItems: 'center'
        }}>
          <CategoryImage backgroundColor={(categoryColors && categoryColors?.backgroundColor) || '#F0F4FE'} iconColor={category && categoryColors?.iconColor} />
          <RegularText color={Blue600} style={{
            marginTop: spacingUnit
          }} > {category.title} </RegularText>
        </Pressable>
      </View>
  )
}

const CategoryRow = ({ threeCategories }) => {
  return (
    <View style={projectSetupStyles.categoryRowContainer}>
      {
        threeCategories.map(category => <CategoryItem category={category} key={category.title} />)
      }
    </View>
  )
}

const CategoryDisplay = ({ categories }) => {
  categories = Object.values(categories)
  const newCategories = []
  
  for (let i = 0; i < categories.length; i = i + 3) {
    newCategories.push(categories.slice(i, i + 3))
  }

  return (
    <View style={projectSetupStyles.categoryContainer}>
      <Subheading style={{
          marginBottom: spacingUnit,
          fontSize: 32,
          marginTop: spacingUnit,
        }} color={Black}>
          Pick 3 areas of interests
      </Subheading>
      {
        newCategories.map((threeCategories, index) => (
          <CategoryRow threeCategories={threeCategories} key={index} />
        ))
      }
    </View>
  )
}

function UserInterestCategoryScreen({
  navigation,
  route
}: StackScreenProps<RootStackParamList, 'UserInterestCategory'>) {
  const user = useMe()

  const [createUserInterests] = useMutation(CREATE_USER_INTERESTS, {
    refetchQueries: [{
      query: GET_USER_INTERESTS,
      variables: {
        userId: user?.id
      }
    }]
  })

  const {
    data,
    error: getUserInterestError,
  } = useQuery(GET_USER_INTERESTS, {
    variables: {
      userId: user?.id
    }
  })
  const edit = route?.params?.edit
  const setup = route?.params?.setup
  const [interests, setInterests] = useState([])
  const [error, setError] = useState(null)
  useEffect(() => {
    if (data?.getUserInterests && data?.getUserInterests.length > 0) {
      const newInterests = data?.getUserInterests.map(userInterest => userInterest?.interest )
      setInterests(newInterests)
      navigation.push('FollowRecommendation')
    }
  }, [data])

  return (
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}>
      <ScrollView style={{
        marginBottom: spacingUnit * 2
      }}>
      <UserInterestCategoryContext.Provider value={{
        interests,
        setInterests,
        error,
        setError
      }}>
        <Header />
        {!edit &&
        <View style={projectSetupStyles.progressCircleContainer}>
          <ProgressCircle
              percent={75}
              radius={50}
              borderWidth={10}
              color={Yellow300}
              shadowColor={Grey300}
              bgColor={White}
          >
              <BigMouthSmile />
          </ProgressCircle>
          <View style={projectSetupStyles.stepContainer}>
            <Text style={projectSetupStyles.stepCount}>step {setup ? '3/4' : '2/3'}</Text>
          </View>
        </View>
        }
        {
          error &&
          <View style={{
            alignItems: 'center'
          }}>
            <ErrorText>
              {error}
            </ErrorText>
          </View>
        }
        <CategoryDisplay categories={categories} />
      </UserInterestCategoryContext.Provider>
      <PrimaryButton textStyle={{
            color: White
          }} style={{
            alignSelf: 'center',
            marginTop: spacingUnit * 5,
            backgroundColor: Orange
          }} onPress={async () => {
            if (interests.length === 0) {
              setError('Please select some interests')
            } else {
              await createUserInterests({
                variables: {
                  interests
                }
              })
              if (!edit) {
                navigation.push('FollowRecommendation')
              } else {

              }
            }
          }
          }>
            <ButtonText color={White}>
              {edit ? 'Update' : 'Continue'}
            </ButtonText>
      </PrimaryButton>
      </ScrollView>
    </SafeAreaView>
  )
}

export default withAuth(UserInterestCategoryScreen)
