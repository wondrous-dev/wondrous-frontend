
import React, { useState, useCallback, useEffect } from 'react'
import { Pressable, SafeAreaView, View, Linking, StyleSheet } from 'react-native'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'

import { withAuth, useMe } from '../../components/withAuth'
import { ProfileTabParamList } from '../../types'
import { Header } from '../../components/Header'
import { Black, Blue500, Grey300, White, Blue400, Grey800 } from '../../constants/Colors'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { TwitterShare, CopyLink, LinkedinShare, InstagramShare, GithubShare } from '../../assets/images/share'
import { openLink, spacingUnit } from '../../utils/common'

import Link from '../../assets/images/link'
import { GITHUB_PREFIX, INSTAGRAM_PREFIX, TWITTER_PREFIX, LINKED_PREFIX } from '../../constants'

enum Socials {
  instagram = 'instagram',
  twitter='twitter',
  linkedin='linkedin',
  github='github'
}

const openSocialLink = (social, url) => {
  switch(social) {
    case Socials.instagram:
      console.log('anything?', url)
      if (url.includes(INSTAGRAM_PREFIX)) {
        openLink(url)
      } else {
        openLink(`${INSTAGRAM_PREFIX}${url}`)
      }
      break
    case Socials.twitter:
      if (url.includes(TWITTER_PREFIX)) {
        openLink(url)
      } else {
        openLink(`${TWITTER_PREFIX}${url}`)
      }
      break
    case Socials.linkedin:
      console.log('url', url)
      if (url.includes(LINKED_PREFIX)) {
        console.log('url', url)
        openLink(url)
      } else {
        openLink(`${LINKED_PREFIX}${url}`)
      }
      break
    case Socials.github:
      if (url.includes(GITHUB_PREFIX)) {
        openLink(url)
      } else {
        openLink(`${GITHUB_PREFIX}${url}`)
      }
  }
}

const linkStyles = StyleSheet.create({
  container: {
    marginTop: spacingUnit * 3,
    paddingLeft: spacingUnit * 2,
    paddingRight: spacingUnit * 2,
  },
  linkItem : {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacingUnit * 4,
  },
  linkImage: {
    marginRight: spacingUnit * 2,
    width: spacingUnit * 4,
    height: spacingUnit * 4
  },
  linkText: {
    fontSize: 16,
    textTransform: 'lowercase',
    flex: 1,
    flexWrap: 'wrap'
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
      <Header title='Personal links' />
      <View style={linkStyles.container}>
        {
          links.website && 
          <Pressable style={linkStyles.linkItem} onPress={() => openLink(links.website)}>
            <Link color={Grey800} style={linkStyles.linkImage} />
              <Paragraph color={Grey800} style={linkStyles.linkText}>
                {links.website}
              </Paragraph>
          </Pressable>
        }
        {
          links.twitter &&
          <Pressable style={linkStyles.linkItem} onPress={() => openSocialLink(Socials.twitter,links.twitter)}>
          <TwitterShare style={linkStyles.linkImage} />
            <Paragraph color={Grey800} style={linkStyles.linkText}>
              {links.twitter}
            </Paragraph>
          </Pressable>
        }
        {
          links.instagram &&
          <Pressable style={linkStyles.linkItem} onPress={() => openSocialLink(Socials.instagram, links.instagram)}>
          <InstagramShare style={linkStyles.linkImage} />
            <Paragraph color={Grey800} style={linkStyles.linkText}>
              {links.instagram}
            </Paragraph>
          </Pressable>
        }
        {
          links.linkedin &&
          <Pressable style={linkStyles.linkItem} onPress={() => openSocialLink(Socials.linkedin, links.linkedin)}>
          <LinkedinShare style={linkStyles.linkImage} />
            <Paragraph color={Grey800} style={linkStyles.linkText}>
              {links.linkedin}
            </Paragraph>
          </Pressable>
        }
        {
          links.github &&
          <Pressable style={linkStyles.linkItem} onPress={() => openSocialLink(Socials.github, links.github)}>
          <GithubShare style={linkStyles.linkImage} />
            <Paragraph color={Grey800} style={linkStyles.linkText}>
              {links.github}
            </Paragraph>
          </Pressable>
        }
      </View>
    </SafeAreaView>
  )
}

export default Links