import { MentionsInput, Mention } from 'react-mentions';
import React, { useCallback, useEffect, useState } from 'react';
import { useTextInput } from 'utils/hooks';
import palette from 'theme/palette';
import { UserSuggestionTypography, UserSuggestionWrapper } from './styles';
import { SafeImage } from '../Common/Image';

export function TextInput(props) {
  const { overrideStyle, ...rest } = props;
  const inputProps = useTextInput();

  const handleChange = useCallback(
    (event) => {
      if (inputProps?.onChange) {
        inputProps?.onChange(event);
      }
    },
    [inputProps]
  );

  useEffect(() => {
    if (inputProps?.orgId) {
    }
  }, [inputProps?.orgId]);

  const style = !overrideStyle && {
    ...{
      textarea: {
        outline: 'none',
      },
      '&multiLine': {
        input: {
          outline: 'none',
          background: '#0F0F0F',
          border: 'none',
        },
      },
      suggestions: {
        top: '16px',
        borderRadius: '8px',
        border: 'none !important',
        list: {
          borderRadius: '8px',
          background: 'linear-gradient(180deg, #1e1e1e 0%, #141414 100%)',
          boxShadow: '0px 34px 84px rgba(0, 0, 0, 0.55)',
        },
        item: {},
      },
    },
    ...{
      input: {
        overflow: 'auto',
        color: palette.white,
        height: '100px',
        marginBottom: '16px',
        borderRadius: '6px',
        padding: '12px',
      },
    },
    ...rest?.style,
  };

  const handleData = (query, callback) => {
    if (!query && !inputProps?.onMentionChange) return;
    inputProps?.onMentionChange(query).then(callback);
  };

  return (
    <MentionsInput
      {...rest}
      style={style}
      value={inputProps?.content}
      onChange={handleChange}
      onKeyDown={inputProps?.keyDownHandler}
      minRows={inputProps?.minRows}
    >
      <Mention
        trigger="@"
        open
        data={handleData}
        displayTransform={(id, display) => `@${display}`}
        regex={/@\[(.*?)]\((.*?)\)/}
        renderSuggestion={(suggestion) => (
          <UserSuggestionWrapper>
            <SafeImage
              useNextImage={false}
              src={suggestion?.profilePicture}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '15px',
              }}
              alt="Profile picture"
            />
            <UserSuggestionTypography>{suggestion?.username}</UserSuggestionTypography>
          </UserSuggestionWrapper>
        )}
      />
    </MentionsInput>
  );
}
