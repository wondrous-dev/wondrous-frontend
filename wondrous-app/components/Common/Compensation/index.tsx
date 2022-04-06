import { ToDo } from '../../Icons';
import { WonderCoin } from '../../Icons/wonderCoin';
import { SafeImage } from '../Image';
import { CompensationWrapper, IconContainer, CompensationPill, CompensationAmount } from './styles';
import { shrinkNumber } from 'utils/helpers';

export const Compensation = (props) => {
  const { rewards, taskIcon } = props;
  const { icon, rewardAmount, symbol } = rewards[0] || {};

  return (
    <CompensationWrapper key={props.id}>
      {taskIcon}
      {rewardAmount && (
        <CompensationPill>
          <IconContainer>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <SafeImage
              src={icon}
              style={{
                width: '24px',
                height: '24px',
              }}
            />
          </IconContainer>
          <CompensationAmount>
            {rewardAmount} {symbol}
          </CompensationAmount>
        </CompensationPill>
      )}
    </CompensationWrapper>
  );
};
