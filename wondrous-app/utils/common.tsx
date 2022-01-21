import React from 'react';
import regexifyString from 'regexify-string';
import { Typography } from '@material-ui/core';
import { HighlightBlue } from '../theme/colors';
import { TodoIcon, ArchivedIcon, CompletedIcon, InProgressIcon, InReviewIcon } from '../components/Icons/statusIcons';

export const renderMentionString = (props) => {
  const { content, textStyle, simple, router } = props;
  const httpRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  const final = regexifyString({
    pattern:
      /@\[(.*?)]\((.*?)\)|([-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?)|(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/gi,
    decorator: (match, index) => {
      const mentionExp = /@\[(.*?)]\((.*?)\)/.exec(match);
      const httpMatch = httpRegex.exec(match);
      if (mentionExp) {
        const [original, username, id] = mentionExp;
        if (simple) {
          return '@' + username;
        }
        return (
          <span
            style={{
              color: HighlightBlue,
              marginRight: '4px',
              cursor: 'pointer',
              ...textStyle,
            }}
            onClick={() => {
              router.push(`/profile/${username}/about`);
            }}
          >
            {`@${username}`}
          </span>
        );
      } else if (httpMatch) {
        return (
          <a
            href={match}
            target="_blank"
            rel="noreferrer"
            style={{
              color: HighlightBlue,
              marginRight: '4px',
              ...textStyle,
            }}
          >
            {match}
          </a>
        );
      } else {
        return match;
      }
    },
    input: content,
  });
  if (simple) {
    return final.join('');
  }
  return final;
};

const statusMap = {
  TODO: 'created',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

export const GetStatusIcon = (props) => {
  const { style, status } = props;
  switch (status) {
    case statusMap.TODO:
      return <TodoIcon style={style} width={style?.width} height={style?.height} />;
    case statusMap.IN_PROGRESS:
      return <InProgressIcon style={style} width={style?.width} height={style?.height} />;
    case statusMap.IN_REVIEW:
      return <InReviewIcon style={style} width={style?.width} height={style?.height} />;
    case statusMap.COMPLETED:
      return <CompletedIcon style={style} width={style?.width} height={style?.height} />;
    case statusMap.ARCHIVED:
      return <ArchivedIcon style={style} width={style?.width} height={style?.height} />;
  }
  return null;
};
