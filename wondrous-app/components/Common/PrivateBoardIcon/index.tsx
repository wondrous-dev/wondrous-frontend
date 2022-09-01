import Tooltip from 'components/Tooltip';
import { PrivateBoardIconBackground } from './styles';
import { PublicEyeIcon, PrivateEyeIcon, LockIconOutline, LockedIconOutline } from '../../Icons/userpass';

interface IPrivateBoardIconProps {
  isPrivate: boolean;
  tooltipTitle: string;
  style?: any;
  className?: string;
}

export function TokenGatedBoard(props: IPrivateBoardIconProps) {
  const { isPrivate, tooltipTitle } = props;
  return (
    <Tooltip title={tooltipTitle} placement="top">
      <PrivateBoardIconBackground>{isPrivate ? <LockIconOutline /> : <LockedIconOutline />}</PrivateBoardIconBackground>
    </Tooltip>
  );
}

export function ToggleBoardPrivacyIcon(props: IPrivateBoardIconProps) {
  const { isPrivate, tooltipTitle, style, className } = props;
  return (
    <Tooltip title={tooltipTitle} placement="top">
      <PrivateBoardIconBackground style={style} className={className}>
        {isPrivate ? <PrivateEyeIcon /> : <PublicEyeIcon />}
      </PrivateBoardIconBackground>
    </Tooltip>
  );
}
