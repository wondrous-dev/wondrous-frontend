import { PrivateBoardIconBackground } from './styles';
import { PublicEyeIcon, PrivateEyeIcon, LockIconOutline, LockedIconOutline } from '../../Icons/userpass';
import Tooltip from 'components/Tooltip';

interface IPrivateBoardIconProps {
  isPrivate: boolean;
  tooltipTitle: string;
  style?: any;
  className?: string;
}

export const TokenGatedBoard = (props: IPrivateBoardIconProps) => {
  const { isPrivate, tooltipTitle } = props;
  return (
    <>
      <Tooltip title={tooltipTitle} placement="top">
        <PrivateBoardIconBackground>
          {isPrivate ? <LockIconOutline /> : <LockedIconOutline />}
        </PrivateBoardIconBackground>
      </Tooltip>
    </>
  );
};

export const ToggleBoardPrivacyIcon = (props: IPrivateBoardIconProps) => {
  const { isPrivate, tooltipTitle, style, className } = props;
  return (
    <>
      <Tooltip title={tooltipTitle} placement="top">
        <PrivateBoardIconBackground style={style} className={className}>
          {isPrivate ? <PrivateEyeIcon /> : <PublicEyeIcon />}
        </PrivateBoardIconBackground>
      </Tooltip>
    </>
  );
};
