
import React, { useState, useCallback, useEffect } from 'react'
import { Pressable, SafeAreaView, View, Linking, StyleSheet } from 'react-native'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'

import { withAuth, useMe } from '../../components/withAuth'
import { ProfileTabParamList } from '../../types'
import { Header } from '../../components/Header'
import { Black, Blue500, Grey300, White, Blue400, Grey800 } from '../../constants/Colors'
import { profileStyles } from './style'
import { GET_PROJECT_BY_ID, GET_PROJECT_FEED } from '../../graphql/queries/project'
import { UPDATE_PROJECT } from '../../graphql/mutations/project'
import { SafeImage, UploadImage } from '../../storybook/stories/Image'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { TwitterShare, CopyLink, LinkedinShare, InstagramShare, GithubShare } from '../../assets/images/share'
import { spacingUnit } from '../../utils/common'

import Link from '../../assets/images/link'

const linkStyles = StyleSheet.create({
  container: {
    marginTop: spacingUnit * 3,
    paddingLeft: spacingUnit * 2,
    paddingRight: spacingUnit * 2,
  },
  linkItem : {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacingUnit * 4
  },
  linkImage: {
    marginRight: spacingUnit * 2,
    width: spacingUnit * 4,
    height: spacingUnit * 4
  }
})

const Links = ({ route }) => {
  const {
    name,
    links
  } = route.params

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header title={name} />
      <View style={linkStyles.container}>
        {
          links.website && 
          <Pressable style={linkStyles.linkItem} onPress={() => Linking.openURL(links.website)}>
            <Link color={Grey800} style={linkStyles.linkImage} />
              <Paragraph color={Grey800} style={{
                fontSize: 18
              }}>
                {links.website}
              </Paragraph>
          </Pressable>
        }
        {
          links.twitter &&
          <Pressable style={linkStyles.linkItem} onPress={() => Linking.openURL(links.twitter)}>
          <TwitterShare style={linkStyles.linkImage} />
            <Paragraph color={Grey800} style={{
              fontSize: 18
            }}>
              {links.twitter}
            </Paragraph>
          </Pressable>
        }
        {
          links.instagram &&
          <Pressable style={linkStyles.linkItem} onPress={() => Linking.openURL(links.instagram)}>
          <InstagramShare style={linkStyles.linkImage} />
            <Paragraph color={Grey800} style={{
              fontSize: 18
            }}>
              {links.instagram}
            </Paragraph>
          </Pressable>
        }
        {
          links.linkedin &&
          <Pressable style={linkStyles.linkItem} onPress={() => Linking.openURL(links.linkedin)}>
          <LinkedinShare style={linkStyles.linkImage} />
            <Paragraph color={Grey800} style={{
              fontSize: 18
            }}>
              {links.linkedin}
            </Paragraph>
          </Pressable>
        }
        {
          links.github &&
          <Pressable style={linkStyles.linkItem} onPress={() => Linking.openURL(links.github)}>
          <GithubShare style={linkStyles.linkImage} />
            <Paragraph color={Grey800} style={{
              fontSize: 18
            }}>
              {links.github}
            </Paragraph>
          </Pressable>
        }
      </View>
    </SafeAreaView>
  )
}

export default Links