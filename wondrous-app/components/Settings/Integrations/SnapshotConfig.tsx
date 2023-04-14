import React, { useContext, useEffect } from 'react';

import { useSnapshot } from 'services/snapshot';

import { StyledLink } from 'components/Common/text';
import { useWonderWeb3 } from '../../../services/web3';
import { ErrorText } from '../../Common';
import ConnectionContext from './Helpers/ConnectionContext';
import {
  IntegrationsHelperText,
  IntegrationsInputsBlock,
  IntegrationsSnapshotBlock,
  IntegrationsSnapshotENSInput,
  IntegrationsSnapshotInputSubBlock,
  IntegrationsSnapshotSubBlock,
} from './styles';

function SnapshotConfigSection() {
  const wonderWeb3 = useWonderWeb3();
  const connectionContext = useContext(ConnectionContext);
  const { orgId, podId, data, setData } = connectionContext;
  const {
    isSnapshotAdmin,
    snapshotConnected,
    snapshotSpace,
    getSnapshotSpaceError,
    disconnectSnapshotToOrg,
    orgSnapshot,
    getOrgSnapshotInfo,
    connectSnapshotToOrg,
    getSnapshotSpaceAndValidateAdmin,
  } = useSnapshot();

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      connectSnapshotToOrg,
      snapshotSpace,
      snapshotConnected,
      isSnapshotAdmin,
      getSnapshotSpaceAndValidateAdmin,
    }));
  }, [connectSnapshotToOrg, snapshotSpace, snapshotConnected, isSnapshotAdmin, getSnapshotSpaceAndValidateAdmin]);

  useEffect(() => {
    if (wonderWeb3?.onConnect) {
      wonderWeb3.onConnect();
    }
  }, []);

  useEffect(() => {
    if (orgId) {
      getOrgSnapshotInfo({
        variables: {
          orgId,
        },
      });
    }
  }, []);

  const handlDisconnectSnapshotSpace = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmed = confirm('Are you sure you want to disconnect the snapshot space from org');
    if (!confirmed) {
      return;
    }
    await disconnectSnapshotToOrg({
      variables: {
        orgId,
      },
    });
  };

  return (
    <IntegrationsInputsBlock>
      <IntegrationsSnapshotBlock>
        {/* <LabelBlock>Snapshot Settings</LabelBlock> */}
        {!snapshotConnected && !(isSnapshotAdmin && snapshotSpace?.id) && (
          <>
            <IntegrationsHelperText>Enter ENS Domain to connect</IntegrationsHelperText>
            <IntegrationsSnapshotSubBlock>
              <IntegrationsSnapshotInputSubBlock>
                <IntegrationsSnapshotENSInput
                  placeholder="ENS domain"
                  onChange={(e) => {
                    setData((prev) => ({ ...prev, enteredSnapshotId: e.target.value }));
                  }}
                />
                {getSnapshotSpaceError && <ErrorText>{getSnapshotSpaceError}</ErrorText>}
              </IntegrationsSnapshotInputSubBlock>
            </IntegrationsSnapshotSubBlock>
          </>
        )}
        {snapshotConnected && (
          <>
            <IntegrationsHelperText>Snapshot connected:</IntegrationsHelperText>
            <IntegrationsSnapshotSubBlock>
              <IntegrationsSnapshotInputSubBlock>
                <IntegrationsSnapshotENSInput
                  value={orgSnapshot?.snapshotEns}
                  // disabled
                />
              </IntegrationsSnapshotInputSubBlock>
              <StyledLink onClick={handlDisconnectSnapshotSpace} disabled={!!podId}>
                Disconnect Snapshot
              </StyledLink>
            </IntegrationsSnapshotSubBlock>
          </>
        )}
      </IntegrationsSnapshotBlock>
    </IntegrationsInputsBlock>
  );
}

export default SnapshotConfigSection;
