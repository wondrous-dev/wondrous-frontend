import { useRouter } from 'next/router';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { BOUNTY_TYPE, PAYMENT_STATUS, TASK_STATUS_DONE, TASK_TYPE } from 'utils/constants';
import { transformTaskToTaskCard } from 'utils/helpers';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { APPROVE_BOUNTY_SUBMISSION, APPROVE_SUBMISSION, REQUEST_CHANGE_SUBMISSION } from 'graphql/mutations';
import { GET_TASK_BY_ID } from 'graphql/queries';
import { KudosForm } from 'components/Common/KudosForm';
import {
  ActionButton,
  MediaLinkWrapper,
  TaskDescriptionText,
  TaskSectionDisplayDiv,
  TaskSectionDisplayLabel,
  TaskSectionDisplayText,
  TaskSectionInfoDiv,
  TaskSubmissionHeader,
  TaskSubmissionHeaderTextDiv,
  TaskSubmissionHeaderTimeText,
  TaskSubmissionItemDiv,
  TaskSubmissionLink,
} from 'components/Common/Task/styles';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import SubmissionStatusIcon from 'components/Common/Task/SubmissionStatusIcon';
import { formatDistance } from 'date-fns';
import { LinkIcon, NotesIcon } from 'components/Icons/taskModalIcons';
import { renderMentionString } from 'utils/common';
import FileIcon from 'components/Icons/files.svg';
import {
  CreateFormButtonsBlock,
  CreateFormFooterButtons,
  EditSubmissionButton,
  MediaUploadDiv,
} from 'components/CreateEntity/styles';
import { MediaLink } from 'components/Common/Task/modal';
import { CompletedIcon, InProgressIcon } from 'components/Icons/statusIcons';
import { PaymentButton } from 'components/Common/Task/paymentButton';

const SubmissionDetails = ({ links = [], description, media = [], hideEmpty = false }) => {
  const router = useRouter();

  const textStyle = {
    marginLeft: '0',
    maxWidth: '500px',
    textAlign: 'left',
  };

  return (
    <>
      {!hideEmpty || description ? (
        <TaskSectionDisplayDiv
          style={{
            alignItems: 'flex-start',
            flexWrap: 'nowrap',
            textAlign: 'left',
          }}
        >
          <TaskSectionDisplayLabel
            style={{
              marginRight: '8px',
            }}
          >
            <NotesIcon />
            <TaskSectionDisplayText>Notes </TaskSectionDisplayText>
          </TaskSectionDisplayLabel>
          <TaskDescriptionText
            style={{
              marginTop: '12px',
              ...textStyle,
            }}
          >
            {renderMentionString({
              content: description,
              router,
            })}
          </TaskDescriptionText>
        </TaskSectionDisplayDiv>
      ) : null}

      {!hideEmpty || links?.length ? (
        <TaskSectionDisplayDiv>
          <TaskSectionDisplayLabel
            style={{
              marginRight: '20px',
            }}
          >
            <LinkIcon />
            <TaskSectionDisplayText>Link </TaskSectionDisplayText>
          </TaskSectionDisplayLabel>
          {links && links[0]?.url ? (
            <TaskSubmissionLink href={links[0]?.url} target="_blank">
              {links[0]?.url}
            </TaskSubmissionLink>
          ) : (
            <>
              <TaskDescriptionText
                style={{
                  marginTop: '13px',
                }}
              >
                None
              </TaskDescriptionText>
            </>
          )}
        </TaskSectionDisplayDiv>
      ) : null}

      {!hideEmpty || media?.length ? (
        <TaskSectionDisplayDiv>
          <TaskSectionDisplayLabel
            style={{
              marginRight: '4px',
            }}
          >
            <FileIcon />
            <TaskSectionDisplayText>Files</TaskSectionDisplayText>
          </TaskSectionDisplayLabel>
          <TaskSectionInfoDiv>
            {media?.length > 0 ? (
              <MediaUploadDiv>
                {media.map((mediaItem, index) => (
                  <div key={mediaItem?.slug}>
                    <MediaLinkWrapper>
                      <div>{index + 1}.</div>
                      <MediaLink style={textStyle} media={mediaItem} />
                    </MediaLinkWrapper>
                    <SafeImage
                      style={{
                        width: '100%',
                        borderRadius: '6px',
                        border: '0.5px solid #B8B8B8',
                      }}
                      src={mediaItem?.slug}
                    />
                  </div>
                ))}
              </MediaUploadDiv>
            ) : (
              <TaskDescriptionText style={{ marginTop: '5px' }}>None</TaskDescriptionText>
            )}
          </TaskSectionInfoDiv>
        </TaskSectionDisplayDiv>
      ) : null}
    </>
  );
};

export default SubmissionDetails;
