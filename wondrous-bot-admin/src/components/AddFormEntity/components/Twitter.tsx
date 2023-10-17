import { Grid, Typography } from "@mui/material";
import { IndexContainer, Label } from "./styles";
import TextField from "../../Shared/TextField";
import { TYPES } from "utils/constants";

const TextInputStyle = {
  width: "50%",
};
const TwitterLikeText = ({ handleOnChange, value, error }) => (
  <>
    <Label>Like this tweet</Label>
    <TextField
      placeholder="Please enter the tweet link"
      value={value?.tweetLink || ""}
      onChange={(value) => handleOnChange("tweetLink", value)}
      multiline={false}
      error={error}
      style={TextInputStyle}
    />
  </>
);

const TwitterRetweetText = ({ handleOnChange, value, error }) => (
  <>
    <Label>Retweet this tweet</Label>
    <TextField
      placeholder="Please enter the tweet link"
      value={value?.tweetLink || ""}
      onChange={(value) => handleOnChange("tweetLink", value)}
      multiline={false}
      error={error}
      style={TextInputStyle}
    />
  </>
);

const TwitterReplyText = ({ handleOnChange, value, error }) => (
  <>
    <Label>Reply to this tweet</Label>
    <TextField
      placeholder="Please enter the tweet link"
      value={value?.tweetLink || ""}
      onChange={(value) => handleOnChange("tweetLink", value)}
      multiline={false}
      error={error}
      style={TextInputStyle}
    />
  </>
);

const TwitterFollowText = ({ handleOnChange, value, error }) => (
  <>
    <Label>Follow this Twitter account (enter without @)</Label>
    <TextField
      placeholder="Please enter the twitter handle to follow e.g. wonderverse_xyz"
      value={value?.tweetHandle}
      onChange={(value) => handleOnChange("tweetHandle", value)}
      multiline={false}
      error={error}
      style={{
        ...TextInputStyle,
        width: "55%",
      }}
    />
  </>
);

const TweetWithPhraseText = ({ handleOnChange, value, error }) => (
  <>
    <Label>Tweet with this hashtag, mention, or phrase!</Label>
    <TextField
      placeholder="Please enter the a phrase: e.g. #wonderverse, @wonderverse_xyz or Wonderverse"
      value={value?.tweetPhrase || ""}
      onChange={(value) => handleOnChange("tweetPhrase", value)}
      multiline={false}
      error={error}
      style={{
        ...TextInputStyle,
        width: "70%",
      }}
    />
  </>
);

const getTwitterComponent = (stepType, handleOnChange, value, error) => {
  if (stepType === TYPES.LIKE_TWEET)
    return <TwitterLikeText handleOnChange={handleOnChange} value={value} error={error?.tweetLink} />;
  if (stepType === TYPES.RETWEET)
    return <TwitterRetweetText handleOnChange={handleOnChange} value={value} error={error?.tweetLink} />;
  if (stepType === TYPES.REPLY_TWEET)
    return <TwitterReplyText handleOnChange={handleOnChange} value={value} error={error?.tweetLink} />;
  if (stepType === TYPES.FOLLOW_TWITTER)
    return <TwitterFollowText handleOnChange={handleOnChange} value={value} error={error?.tweetHandle} />;
  if (stepType === TYPES.TWEET_WITH_PHRASE)
    return <TweetWithPhraseText handleOnChange={handleOnChange} value={value} error={error?.tweetPhrase} />;

  return null;
};

const TwitterComponent = ({ onChange, value, stepType, error }) => {
  const handleOnChange = (key, val) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  return (
    <Grid
      gap="8px"
      display="flex"
      alignItems="center"
      style={{
        width: "100%",
      }}
      direction="column"
    >
      <Grid
        item
        gap="14px"
        display="flex"
        flexDirection="column"
        xs={12}
        style={{
          width: "100%",
        }}
      >
        {getTwitterComponent(stepType, handleOnChange, value, error?.additionalData)}
      </Grid>
    </Grid>
  );
};

export default TwitterComponent;
