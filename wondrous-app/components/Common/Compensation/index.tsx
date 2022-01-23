import { ToDo } from '../../Icons';
import { WonderCoin } from '../../Icons/wonderCoin';
import { SafeImage } from '../Image';
import { CompensationWrapper, IconContainer, CompensationPill, CompensationAmount } from './styles';

export const Compensation = (props) => {
  const { icon, symbol, tokenName, rewardAmount } = props?.compensation || {};

  return (
    <CompensationWrapper key={props.id}>
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
        <CompensationAmount>{rewardAmount}</CompensationAmount>
      </CompensationPill>
    </CompensationWrapper>
  );
};
