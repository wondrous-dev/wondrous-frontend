import { shrinkNumber } from 'utils/helpers';
import { ToDo } from '../../Icons';
import { WonderCoin } from '../../Icons/wonderCoin';
import { SafeImage } from '../Image';
import { CompensationWrapper, IconContainer, CompensationPill, CompensationAmount } from './styles';
import Ethereum from '../../Icons/ethereum';
import { Matic } from '../../Icons/matic';
import { USDCoin } from '../../Icons/USDCoin';

export function Compensation(props) {
  const { rewards, taskIcon, style, pillStyle = {} } = props;
  const { icon, rewardAmount, symbol } = rewards[0] || {};

  return (
    <CompensationWrapper key={props.id} style={style}>
      <CompensationPill style={pillStyle}>
        {rewardAmount && (
          <>
            {icon && (
              <IconContainer>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <SafeImage
                  useNextImage={false}
                  src={icon}
                  style={{
                    width: '24px',
                    height: '24px',
                  }}
                />
              </IconContainer>
            )}
            <CompensationAmount>
              {rewardAmount} {icon ? null : symbol}
            </CompensationAmount>
          </>
        )}
        {taskIcon || null}
      </CompensationPill>
    </CompensationWrapper>
  );
}
