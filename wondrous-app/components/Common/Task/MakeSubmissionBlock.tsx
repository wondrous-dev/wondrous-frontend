import React from 'react';

import {
  ActionButton,
  MakeSubmissionDiv,
  TaskSectionInfoDiv,
  TaskSectionInfoText,
} from 'components/Common/Task/styles';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { InReviewIcon } from 'components/Icons/statusIcons';

const MakeSubmissionBlock = (props) => {
  const { fetchedTask, setMakeSubmission, prompt, canSubmit, loggedInUser } = props;
  const user = fetchedTask?.assigneeId ? fetchedTask : canSubmit && loggedInUser;
  const profilePicture = user?.assigneeProfilePicture ?? user?.profilePicture;
  const username = user?.assigneeUsername ?? user?.username;

  return (
    <MakeSubmissionDiv>
      <TaskSectionInfoDiv
        style={{
          marginTop: 0,
          width: '100%',
        }}
      >
        {canSubmit && (
          <>
            {profilePicture ? (
              <SafeImage
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '13px',
                  marginRight: '4px',
                }}
                src={profilePicture}
              />
            ) : (
              <DefaultUserImage
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '13px',
                  marginRight: '4px',
                }}
              />
            )}
            <TaskSectionInfoText
              style={{
                fontSize: '16px',
              }}
            >
              {username}
            </TaskSectionInfoText>
            <div
              style={{
                flex: 1,
              }}
            />
            <ActionButton style={{ height: '40px' }} onClick={() => setMakeSubmission(true)}>
              {prompt}
              <InReviewIcon
                style={{
                  width: '28px',
                  height: '28px',
                  marginLeft: '10px',
                }}
                none={'none'}
              />
            </ActionButton>
          </>
        )}
      </TaskSectionInfoDiv>
    </MakeSubmissionDiv>
  );
};

export default MakeSubmissionBlock;
