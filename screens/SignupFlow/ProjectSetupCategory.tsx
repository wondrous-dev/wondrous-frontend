import React, { createContext, useContext, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, TouchableOpacity, Text, Image, SafeAreaView, Dimensions, Pressable } from 'react-native'

import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import BusinessIcon from '../../assets/images/categories/business'
import TechIcon from '../../assets/images/categories/tech'
import ArtIcon from '../../assets/images/categories/art'
import MusicIcon from '../../assets/images/categories/music'
import VideoIcon from '../../assets/images/categories/video'
import PhotographyIcon from '../../assets/images/categories/photography'
import LearningIcon from '../../assets/images/categories/learning'
import GamesIcon from '../../assets/images/categories/games'
import FoodIcon from '../../assets/images/categories/food'
import PodcastIcon from '../../assets/images/categories/podcast'
import WritingIcon from '../../assets/images/categories/writing'
import FitnessIcon from '../../assets/images/categories/fitness'
import OtherIcon from '../../assets/images/categories/other'
import { spacingUnit } from '../../utils/common'
import { Black, Blue600, White } from '../../constants/Colors'
import { Subheading, RegularText, ButtonText} from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import { moderateScale } from '../../utils/scale'
import { useMutation } from '@apollo/client'

const ProjectSetupCategoryContext = createContext(null)

const projectSetupStyles = StyleSheet.create({
  categoryContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  categoryRowContainer: {
    maxWidth: moderateScale(spacingUnit * 43),
    flexDirection: 'row',
    marginTop: spacingUnit * 5,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

const categories = {
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
  const { projectCategory, setProjectCategory } = useContext(ProjectSetupCategoryContext)
  let categoryColors = null
  if (category.title.toLowerCase() === projectCategory) {
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
        <Pressable onPress={() => setProjectCategory(category.title.toLowerCase())} style={{
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
          marginTop: spacingUnit * 3
        }} color={Black}>
          What type of project is this?
      </Subheading>
      {
        newCategories.map((threeCategories, index) => (
          <CategoryRow threeCategories={threeCategories} key={index} />
        ))
      }
    </View>
  )
}

function ProjectSetupCategoryScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'ProjectSetupCategory'>) {
  const [projectCategory, setProjectCategory] = useState(null)
  // const [] = useMutation()
  const []
  return (
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}>
      <ProjectSetupCategoryContext.Provider value={{
        projectCategory,
        setProjectCategory
      }}>
        <Header />
        <CategoryDisplay categories={categories} />
      </ProjectSetupCategoryContext.Provider>
      <PrimaryButton textStyle={{
            color: White
          }} style={{
            alignSelf: 'center',
            marginTop: spacingUnit * 8
          }}>
            <ButtonText color={White}>
              Continue
            </ButtonText>
      </PrimaryButton>
    </SafeAreaView>
  )
}

export default ProjectSetupCategoryScreen
