import { MentionsInput, Mention } from 'react-mentions';
import React, { useCallback, useEffect, useState } from 'react';
import { useTextInput } from 'utils/hooks';
import { UserSuggestionTypography, UserSuggestionWrapper } from './styles';
import { SafeImage } from '../Common/Image';
import { Blue400, White } from '../../theme/colors';

export const TextInput = (props) => {
  const [name, setName] = useState('');
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

  const fetchData = (query) => {
    return inputProps?.list.filter((user) => user?.username?.startsWith(query));
  };

  const style = {
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
  };

  return (
    <MentionsInput
      value={inputProps?.content}
      onChange={handleChange}
      {...props}
      style={{
        ...props?.style,
        ...style,
        ...{
          input: {
            overflow: 'auto',
            color: White,
            height: '100px',
            marginBottom: '16px',
            borderRadius: '6px',
            padding: '12px',
          },
        },
      }}
      onKeyDown={inputProps?.keyDownHandler}
    >
      <Mention
        trigger="@"
        data={fetchData}
        displayTransform={(id, display) => `@${display}`}
        regex={/@\[(.*?)]\((.*?)\)/}
        renderSuggestion={(suggestion) => (
          <UserSuggestionWrapper>
            <SafeImage
              src={suggestion?.profilePicture}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '15px',
              }}
            />
            <UserSuggestionTypography>{suggestion?.username}</UserSuggestionTypography>
          </UserSuggestionWrapper>
        )}
      />
    </MentionsInput>
  );
};
