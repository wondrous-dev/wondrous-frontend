import React from 'react';
import regexifyString from 'regexify-string';
import { Typography } from '@mui/material';
import palette from 'theme/palette';
import { TodoIcon, ArchivedIcon, CompletedIcon, InProgressIcon, InReviewIcon } from 'components/Icons/statusIcons';

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
          return `@${username}`;
        }
        return (
          <span
            key={id}
            style={{
              color: palette.highlightBlue,
              marginRight: '4px',
              cursor: 'pointer',
              ...textStyle,
            }}
            onClick={() => {
              router.push(`/profile/${username}/about`, undefined, {
                shallow: true,
              });
            }}
          >
            {`@${username}`}
          </span>
        );
      }
      if (httpMatch) {
        return (
          <a
            href={match}
            target="_blank"
            rel="noreferrer"
            style={{
              color: palette.highlightBlue,
              marginRight: '4px',
              ...textStyle,
            }}
          >
            {match}
          </a>
        );
      }
      return match;
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

export function GetStatusIcon(props) {
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
    default:
      return null;
  }
}

export const parseLinks = (links) => {
  /**
   * parse links from backend into social links, websites, and main
   */
  const SOCIAL_LINKS = ['twitter', 'discord', 'instagram', 'github', 'linkedin', 'spotify', 'opensea', 'facebook'];
  if (!links) {
    return {
      social: [],
      websites: [],
      mainLink: null,
    };
  }
  let mainLink = null;
  const socialLinks = [];
  const websites = [];
  for (const link of links) {
    if (!link.type || link.type === 'website') {
      websites.push(link);
    } else if (SOCIAL_LINKS.includes(link.type)) {
      socialLinks.push(link);
    } else if (link.type === 'main') {
      mainLink = link;
    }
  }
  if (mainLink === null) {
    if (websites.length > 0) {
      mainLink = websites[0];
    } else if (socialLinks.length > 0) {
      mainLink = socialLinks[0];
    }
  }
  return {
    social: socialLinks,
    websites,
    mainLink,
  };
};

export const capitalize = (str: string): string => {
  if (!str) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function shallowEqual(objA, objB) {
  if (!objA || !objB) {
    return objA === objB;
  }

  return !Object.keys({ ...objA, ...objB }).some((key) => objA[key] !== objB[key]);
}
