import React from 'react'
import { Linking } from 'react-native'


export const tweetNow = ({ twitterShareURL, tweetContent, twitterViaAccount }) => {
  let twitterParameters = [];
  if (twitterShareURL)
    twitterParameters.push('url=' + encodeURI(twitterShareURL));
  if (tweetContent)
    twitterParameters.push('text=' + encodeURI(tweetContent));
  if (twitterViaAccount)
    twitterParameters.push('via=' + encodeURI(twitterViaAccount));
  const url =
    'https://twitter.com/intent/tweet?'
    + twitterParameters.join('&');
  Linking.openURL(url)
    // .then((data) => {
    //   alert('Twitter Opened');
    // })
    // .catch(() => {
    //   alert('Something went wrong');
    // });
}

export const linkedinShare = ({ linkedinShareUrl, linkedinContent }) => {
  let linkedinParameters = [];
  if (linkedinShareUrl)
    linkedinParameters.push('url=' + encodeURI(linkedinShareUrl))
  if (linkedinContent)
    linkedinParameters.push('text=' + encodeURI(linkedinContent))
  const url = 'https://www.linkedin.com/shareArticle?' + linkedinParameters.join('&')
  Linking.openURL(url)
    // .then((data) => {

    // })
    // .catch(() => {
    //   alert('Something went wrong');
    // })
}

export const postOnFacebook = ({ facebookShareURL, postContent}) => {
  let facebookParameters = [];
  if (facebookShareURL)
    facebookParameters.push('u=' + encodeURI(facebookShareURL));
  if (postContent)
    facebookParameters.push('quote=' + encodeURI(postContent));
  const url =
    'https://www.facebook.com/sharer/sharer.php?' +
    facebookParameters.join('&');

  Linking.openURL(url)
}