import TokenGatingGuild from 'components/Settings/TokenGating/TokenGatingGuild';
import React, { useRef, useState } from 'react';

import Modal from 'components/Modal';
import Tabs from 'components/Tabs';
import TokenGatingConfigForm from './TokenGatingConfigForm';
import { TokenGatingFormHeaderSecondary } from './styles';

enum Tab {
  TokenGating = 'tokenGating',
  Guild = 'guild',
}

function TokenGatingModal(props) {
  const footerRef = useRef(null);
  const { orgId, org, open, onClose, selectedTokenGatingCondition, setSelectedTokenGatingCondition } = props;
  const [selectedTab, setSelectedTab] = useState(Tab.TokenGating);

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
      onClose={onClose}
      footerRight={<div ref={footerRef} />}
    >
      <Tabs
        value={selectedTab}
        onChange={(e, tab) => setSelectedTab(tab)}
        tabs={[
          { label: 'Token gate', value: Tab.TokenGating },
          { label: 'Guild.xyz', value: Tab.Guild },
        ]}
      />

      {selectedTab === Tab.TokenGating ? (
        <TokenGatingConfigForm
          orgId={orgId}
          org={org}
          footerRef={footerRef}
          onClose={onClose}
          selectedTokenGatingCondition={selectedTokenGatingCondition}
          setSelectedTokenGatingCondition={setSelectedTokenGatingCondition}
        />
      ) : (
        <TokenGatingGuild org={org} footerRef={footerRef} onClose={onClose} />
      )}
    </Modal>
  );
}

export default TokenGatingModal;
