import DropdownSelect from 'components/Common/DropdownSelect';
import { LinkIcon } from 'components/Icons/taskModalIcons';
import WalletIcon from 'components/Icons/WalletIcon';
import { useState } from 'react';
import { Wrapper } from './styles';

const WALLET_TYPES = [
  {
    value: 'wallet',
    label: 'Wallet',
    icon: <WalletIcon />,
  },
  {
    value: 'off_platform',
    label: 'Off platform',
    icon: <LinkIcon height="19" width="19" />,
  },
];

const WalletPay = () => <Wrapper label="Pay from Wallet">null</Wrapper>;

const PaymentMethod = () => {
  const [selectedTab, setSelectedTab] = useState(WALLET_TYPES[0]);

  return (
    <>
      <Wrapper label="Payment Method">
        <DropdownSelect
          options={WALLET_TYPES}
          setValue={(value) => setSelectedTab(WALLET_TYPES.find((item) => item.value === value))}
          hideLabel
          value={selectedTab.value}
          formSelectStyle={{
            flex: 1,
            maxWidth: '100%',
          }}
          innerStyle={{
            marginTop: '0',
          }}
        />
      </Wrapper>
      <WalletPay />
    </>
  );
};

export default PaymentMethod;
