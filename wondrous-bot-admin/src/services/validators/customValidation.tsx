export const getYouTubeVideoId = (url) => {
  let videoId = "";
  // Extract video ID from the first format: https://youtu.be/videoId
  const regex1 = /^https:\/\/youtu\.be\/([^\?]+)/;
  const match1 = url.match(regex1);
  if (match1 && match1.length >= 2) {
    videoId = match1[1];
  }
  // Extract video ID from the second format: https://www.youtube.com/watch?v=videoId&...
  const regex2 = /[?&]v=([^&]+)/;
  const match2 = url.match(regex2);
  if (match2 && match2.length >= 2) {
    videoId = match2[1];
  }
  return videoId;
};

export const validateChannelUrl = (url) => {
  // Extract channel ID from the first format: https://www.youtube.com/@channelName
  const regex1 = /^https:\/\/www\.youtube\.com\/@([^\?]+)/;
  const match1 = url.match(regex1);
  if (match1 && match1.length >= 2) {
    return true;
  }
  // Extract channel ID from the second format: https://www.youtube.com/channel/channelId
  const regex2 = /^https:\/\/www\.youtube\.com\/channel\/([^\?]+)/;
  const match2 = url.match(regex2);
  if (match2 && match2.length >= 2) {
    return true;
  }
  return false;
};
