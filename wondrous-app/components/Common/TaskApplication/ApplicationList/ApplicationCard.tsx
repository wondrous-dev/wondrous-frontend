import calculateTimeLapse from 'utils/calculateTimeLapse';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import SmartLink from 'components/Common/SmartLink';
import { TASK_APPLICATION_STATUS_LABELS, TASK_APPLICATION_STATUS } from 'utils/constants';
import { Approved, Rejected, PendingApplication } from 'components/Icons';
import { LinkIcon } from 'components/Icons/taskModalIcons';
import { ActionButton } from 'components/Common/Task/styles';
import GR15DEIModal from 'components/Common/IntiativesModal/GR15DEIModal';
import { GR15DEILogo } from 'components/Common/IntiativesModal/GR15DEIModal/GR15DEILogo';
import { useState } from 'react';
import {
  CardWrapper,
  CardHeader,
  CardBody,
  CardFooter,
  CardStatusWrapper,
  CardHeaderInfo,
  CardUsername,
  CardTimestamp,
  ApplicationStatus,
  ApplicationMessage,
  LinksWrapper,
  LinkContainer,
  RejectButton,
} from './styles';

const STATUS_ICONS = {
  [TASK_APPLICATION_STATUS.APPROVED]: Approved,
  [TASK_APPLICATION_STATUS.REJECTED]: Rejected,
  [TASK_APPLICATION_STATUS.PENDING]: PendingApplication,
};

const STATUS_GRADIENTS = {
  [TASK_APPLICATION_STATUS.APPROVED]: 'linear-gradient(180deg, #FFFFFF 0%, #06FFA5 100%);',
  [TASK_APPLICATION_STATUS.REJECTED]: 'linear-gradient(196.76deg, #FFFFFF -48.71%, #F93701 90.48%);',
  [TASK_APPLICATION_STATUS.PENDING]: 'linear-gradient(180deg, #FFFFFF 0%, #00BAFF 100%)',
};

interface Link {
  displayName: string;
  url: string;
}
interface Props {
  avatar?: string;
  username: string;
  message?: string;
  timestamp: string;
  status: string;
  links: [Link];
  onApprove: () => void;
  onReject: () => void;
  showActions: boolean;
  isGr15Contributor?: boolean;
}

export default function ApplicationCard({
  avatar,
  username,
  timestamp,
  status,
  message,
  links,
  onApprove,
  onReject,
  showActions,
  isGr15Contributor,
}: Props) {
  const [openGR15Modal, setOpenGR15Modal] = useState(false);
  const ACTION_BUTTONS_CONFIG = [
    {
      label: 'Reject',
      component: RejectButton,
      action: onReject,
    },
    {
      label: 'Approve',
      component: ActionButton,
      action: onApprove,
    },
  ];

  const timelapse = calculateTimeLapse(timestamp);

  const StatusIcon = STATUS_ICONS[status];
  return (
    <CardWrapper>
      <CardHeader>
        <CardHeaderInfo>
          <SmartLink href={`/profile/${username}/about`} asLink>
            {avatar ? (
              <SafeImage
                useNextImage={false}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '13px',
                  marginRight: '4px',
                }}
                src={avatar}
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
          </SmartLink>
          {isGr15Contributor && (
            <>
              <GR15DEIModal open={openGR15Modal} onClose={() => setOpenGR15Modal(false)} />
              <GR15DEILogo width="28" height="28" onClick={() => setOpenGR15Modal(true)} />
            </>
          )}
          <SmartLink href={`/profile/${username}/about`} asLink>
            <CardUsername>{username}</CardUsername>
          </SmartLink>
          <CardTimestamp>{timelapse}</CardTimestamp>
        </CardHeaderInfo>
        <CardStatusWrapper>
          <StatusIcon />
          <ApplicationStatus gradient={STATUS_GRADIENTS[status]}>
            {TASK_APPLICATION_STATUS_LABELS[status]}
          </ApplicationStatus>
        </CardStatusWrapper>
      </CardHeader>
      <CardBody>
        <ApplicationMessage>{message}</ApplicationMessage>
        <LinksWrapper>
          {links?.map((link, idx) => (
            <LinkContainer key={idx} href={link?.url} target="_blank" rel="noopener noreferrer">
              <LinkIcon />
              {link?.displayName}
            </LinkContainer>
          ))}
        </LinksWrapper>
      </CardBody>
      <CardFooter>
        {showActions &&
          ACTION_BUTTONS_CONFIG.map((btn, idx) => {
            const Button = btn.component;
            return (
              <Button key={idx} type="button" onClick={btn.action}>
                {btn.label}
              </Button>
            );
          })}
      </CardFooter>
    </CardWrapper>
  );
}
