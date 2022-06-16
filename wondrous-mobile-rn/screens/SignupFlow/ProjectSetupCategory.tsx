import React, { createContext, useContext, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, ScrollView, Text, Image, SafeAreaView, Dimensions, Pressable } from 'react-native'
import ProgressCircle from 'react-native-progress-circle'
import * as Analytics from 'expo-firebase-analytics'

import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import BusinessIcon from '../../assets/images/categories/business'
import TechIcon from '../../assets/images/categories/tech'
import ArtIcon from '../../assets/images/categories/art'
import MusicIcon from '../../assets/images/categories/music'
import VideoIcon from '../../assets/images/categories/video'
import PhotographyIcon from '../../assets/images/categories/photography'
import LearningIcon from '../../assets/images/categories/learning'
import FoodIcon from '../../assets/images/categories/food'
import PodcastIcon from '../../assets/images/categories/podcast'
import WritingIcon from '../../assets/images/categories/writing'
import FitnessIcon from '../../assets/images/categories/fitness'
import OtherIcon from '../../assets/images/categories/other'
import { spacingUnit } from '../../utils/common'
import palette from 'theme/palette'
import { Subheading, RegularText, Paragraph, ErrorText } from '../../storybook/stories/Text'
import { moderateScale } from '../../utils/scale'
import { useMutation } from '@apollo/client'
import { UPDATE_PROJECT } from '../../graphql/mutations/project'
import BigMouthSmile from '../../assets/images/emoji/openMouthSmile'
import { withAuth, useMe } from '../../components/withAuth'
import { updateUsageProgress } from '../../utils/apollo'
import { LogEvents } from '../../utils/analytics'

const ProjectSetupCategoryContext = createContext(null)

export const projectSetupStyles = StyleSheet.create({
  categoryContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  categoryRowContainer: {
    maxWidth: moderateScale(spacingUnit * 43),
    flexDirection: 'row',
    marginTop: spacingUnit * 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: spacingUnit * 3,
  },
  stepCount: {
    fontSize: 16,
    color: palette.blue500,
    fontFamily: 'Rubik',
    fontStyle: 'normal',
    fontWeight: '500',
  },
  stepContainer: {
    marginTop: spacingUnit * 3,
  }
})

export const categories = {
  business: {
    title: 'Business',
    image: BusinessIcon
  },
  tech: {
    title: 'Tech',
    image: TechIcon
  },
  art: {
    title: 'Design',
    image: ArtIcon
  },
  music: {
    title: 'Music',
    image: MusicIcon
  },
  video: {
    title: 'Video',
    image: VideoIcon
  },
  learning: {
    title: 'Learning',
    image: LearningIcon
  },
  fitness: {
    title: 'Fitness',
    image: FitnessIcon
  },
  writing: {
    title: 'Writing',
    image: WritingIcon
  },
  podcast: {
    title: 'Podcast',
    image: PodcastIcon
  },
  photography: {
    title: 'Photography',
    image: PhotographyIcon
  },
  food: {
    title: 'Food',
    image: FoodIcon
  },
  other: {
    title: 'Other',
    image: OtherIcon
  }
}

const CategoryItem = ({ category }) => {
  const CategoryImage = category.image
  const { projectCategory, setProjectCategory, setError, error } = useContext(ProjectSetupCategoryContext)
  let categoryColors = null
  if (category.title.toLowerCase() === projectCategory) {
    categoryColors = {
      iconColor: palette.white,
      backgroundColor: palette.blue600
    }
  }

  return (
      <View style={{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }} key={category.title}>
        <Pressable onPress={() => setProjectCategory(category.title.toLowerCase())} style={{
          alignItems: 'center'
        }}>
          <CategoryImage backgroundColor={(categoryColors && categoryColors?.backgroundColor) || '#F0F4FE'} iconColor={category && categoryColors?.iconColor} />
          <RegularText color={palette.blue600} style={{
            marginTop: spacingUnit
          }} > {category.title} </RegularText>
        </Pressable>
      </View>
  )
}

export const CategoryRow = ({ threeCategories }) => {
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
          marginTop: spacingUnit * 3
        }} color={palette.black}>
          What type of project is this?
      </Subheading>
      <Paragraph style={{
        textAlign: 'center',
        paddingLeft: spacingUnit * 2,
        paddingRight: spacingUnit * 2
      }} color={palette.grey500}>
        You only need to pick one!
      </Paragraph>
      {
        newCategories.map((threeCategories, index) => (
          <CategoryRow threeCategories={threeCategories} key={index} />
        ))
      }
    </View>
  )
}

function ProjectSetupCategoryScreen({
  navigation,
  route
}: StackScreenProps<RootStackParamList, 'ProjectSetupCategory'>) {
  const user = useMe()

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    update(cache, { data: { updateProject }}) {
      cache.modify({
          fields: {
              users() {
                return updateUsageProgress({ user, newKey: 'projectCategorySelected' })
              },
              getProjectById(existingProject) {

              }
          }
      })
    }
  })
  const {
    projectId,
    edit,
    existingProjectCategory,
    setup
  } = route.params
  const [projectCategory, setProjectCategory] = useState(existingProjectCategory)
  const [error, setError] = useState(null)
  useEffect(() => {
    if (!edit && user && user.usageProgress && user.usageProgress.projectCategorySelected && setup) {
      const categorySelected = user.usageProgress.projectCategorySelected
      if (categorySelected === 'business' || categorySelected === 'tech') {
        navigation.push('ProjectTagSelection', {
          projectId,
          setup
        })
      }
    }
  }, [])

  return (
    <SafeAreaView style={{
      backgroundColor: palette.white,
      flex: 1
    }}>
      <ScrollView style={{
        marginBottom: spacingUnit * 2
      }}>
      <ProjectSetupCategoryContext.Provider value={{
        projectCategory,
        setProjectCategory,
        error,
        setError
      }}>
        <Header  rightButton={{
        color: palette.orange,
        text: 'Continue',
        onPress: async () => {
          if (!projectCategory) {
            setError('Please select a project category')
          } else {
            await updateProject({
              variables: {
                input: {
                  category: projectCategory
                },
                projectId,
                firstTime: true
              }
            })
            if (!edit) {
              if (projectCategory === 'business' || projectCategory === 'tech') {
                navigation.push('ProjectTagSelection', {
                  projectId,
                  setup
                })
              } else {
                if (setup) {
                  try {
                    Analytics.logEvent(LogEvents.SET_PROJECT_CATEGORY_FIRST_TIME, {
                      user_id: user?.id,
                      project_id: projectId,
                      category: projectCategory
                    })
                  } catch (err) {
                    console.log('Error logging setting project category for the first time: ', err)
                  }
                  navigation.navigate('Root', {
                    screen: 'Profile',
                    params: {
                      screen: 'UserProfile'
                    }
                  })
                } else {
                  try {
                    Analytics.logEvent(LogEvents.SET_PROJECT_CATEGORY, {
                      user_id: user?.id,
                      project_id: projectId,
                      category: projectCategory
                    })
                  } catch (err) {
                    console.log('Error logging setting project category: ', err)
                  }
                  navigation.push('ProjectInviteCollaborators', {
                    project: {
                      id: projectId
                    },
                    setup
                  })
                }
              }
            } else {
              try {
              Analytics.logEvent(LogEvents.EDIT_PROJECT_CATEGORY, {
                  user_id: user?.id,
                  project_id: projectId,
                  category: projectCategory
                })
              } catch (err) {
                console.log('Error logging setting project category: ', err)
              }
              navigation.navigate('Root', {
                screen: 'Profile',
                params: {
                  screen: 'ProjectProfile',
                  params: {
                    projectId,
                    editProfile: true
                  }
                }
              })
            }
          }
        }
      }} />
        {!edit &&
        <View style={projectSetupStyles.progressCircleContainer}>
          <ProgressCircle
              percent={60}
              radius={50}
              borderWidth={10}
              color={palette.yellow300}
              shadowColor={palette.grey300}
              bgColor={palette.white}
          >
              <BigMouthSmile />
          </ProgressCircle>
          {/* <View style={projectSetupStyles.stepContainer}>
            <Text style={projectSetupStyles.stepCount}>step {setup ? '3/4' : '2/3'}</Text>
          </View> */}
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
      </ProjectSetupCategoryContext.Provider>
      </ScrollView>
    </SafeAreaView>
  )
}

export default withAuth(ProjectSetupCategoryScreen)
