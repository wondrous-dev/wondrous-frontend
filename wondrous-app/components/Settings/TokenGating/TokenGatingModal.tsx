import TokenGatingGuildForm from 'components/Settings/TokenGating/TokenGatingGuildForm';
import React, { useRef, useState } from 'react';

import Modal from 'components/Modal';
import Tabs from 'components/Tabs';
import { Org } from 'types/Org';
import { TOKEN_GATING_CONDITION_TYPE } from 'utils/constants';
import { useTokenGatingCondition } from 'utils/hooks';
import TokenGatingConfigForm from './TokenGatingConfigForm';
import OtterspaceConfigForm from './OtterspaceConfigForm';
import { TokenGatingFormHeaderSecondary } from './styles';

type Props = {
  orgId: string;
  org: Org;
  open: boolean;
};

function TokenGatingModal({ orgId, org, open }: Props) {
  const footerRef = useRef(null);
  const { selectedTokenGatingCondition, closeTokenGatingModal } = useTokenGatingCondition();
  const [selectedTab, setSelectedTab] = useState(
    selectedTokenGatingCondition?.type === TOKEN_GATING_CONDITION_TYPE.GUILD
      ? TOKEN_GATING_CONDITION_TYPE.GUILD
      : TOKEN_GATING_CONDITION_TYPE.TOKEN_GATE
  );

  return (
    <Modal
      open={open}
      maxWidth={680}
      title={
        <>
          <span>Token gating for </span>
          <TokenGatingFormHeaderSecondary as="span">{org?.username || ''}</TokenGatingFormHeaderSecondary>
        </>
      }
      onClose={closeTokenGatingModal}
      footerRight={<div ref={footerRef} />}
    >
      {!selectedTokenGatingCondition ? (
        <Tabs
          value={selectedTab}
          onChange={(e, tab) => setSelectedTab(tab)}
          tabs={[
            { label: 'Token gate', value: TOKEN_GATING_CONDITION_TYPE.TOKEN_GATE },
            { label: 'Guild.xyz', value: TOKEN_GATING_CONDITION_TYPE.GUILD },
            { label: 'Otterspace', value: TOKEN_GATING_CONDITION_TYPE.OTTER },
          ]}
        />
      ) : null}
      {selectedTab === TOKEN_GATING_CONDITION_TYPE.GUILD && (
        <TokenGatingGuildForm orgId={orgId} footerRef={footerRef} />
      )}
      {selectedTab === TOKEN_GATING_CONDITION_TYPE.TOKEN_GATE && (
        <TokenGatingConfigForm orgId={orgId} footerRef={footerRef} />
      )}
      {selectedTab === TOKEN_GATING_CONDITION_TYPE.OTTER && (
        <OtterspaceConfigForm orgId={orgId} footerRef={footerRef} />
      )}
    </Modal>
  );
}

export default TokenGatingModal;
