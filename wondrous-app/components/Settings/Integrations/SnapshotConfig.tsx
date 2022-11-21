// import React, { useCallback, useEffect, useState } from 'react';
// import { useQuery, useMutation, useLazyQuery, gql, ApolloClient, InMemoryCache } from '@apollo/client';

// import { useRouter } from 'next/router';
// // import { useSnapshot, getSnapshotUrl } from 'services/snapshot';
// import {
//   IntegrationsSnapshotBlock,
//   IntegrationsInputsBlock,
//   IntegrationsSnapshotENSInput,
//   IntegrationsSnapshotSubBlock,
//   IntegrationsSnapshotInputSubBlock,
//   IntegrationsHelperText,
//   IntegrationsConnectButton,
//   IntegrationsDisconnectButton,
//   LabelBlock,
// } from './styles';

// import { useWonderWeb3 } from '../../../services/web3';
// import { ErrorText } from '../../Common';

function SnapshotConfigSection(props) {
  //   const router = useRouter();
  //   const wonderWeb3 = useWonderWeb3();
  //   const { orgId, podId } = props;
  //   const [userAddress, setUserAddress] = useState('');
  //   const [enteredSnapshotId, setEnteredSnapshotId] = useState(null);
  //   const {
  //     isSnapshotAdmin,
  //     snapshotConnected,
  //     snapshotSpace,
  //     getSnapshotSpaceAndValidateAdmin,
  //     getSnapshotSpaceError,
  //     connectSnapshotToOrg,
  //     disconnectSnapshotToOrg,
  //     orgSnapshot,
  //     getOrgSnapshotInfo,
  //   } = useSnapshot();
  //   useEffect(() => {
  //     if (wonderWeb3?.onConnect) {
  //       wonderWeb3.onConnect();
  //     }
  //     setUserAddress(wonderWeb3.address);
  //   }, []);
  //   useEffect(() => {
  //     if (orgId) {
  //       getOrgSnapshotInfo({
  //         variables: {
  //           orgId,
  //         },
  //       });
  //     }
  //     setUserAddress(wonderWeb3.address);
  //   }, []);
  //   const handleConnectSnapshotSpace = async () => {
  //     await connectSnapshotToOrg({
  //       variables: {
  //         orgId,
  //         input: {
  //           snapshotEns: snapshotSpace.id,
  //           name: snapshotSpace.name,
  //           symbol: snapshotSpace.symbol,
  //           url: getSnapshotUrl(snapshotSpace.id),
  //           network: snapshotSpace.network,
  //         },
  //       },
  //     });
  //   };
  //   const handlDisconnectSnapshotSpace = async () => {
  //     const confirmed = confirm('Are you sure you want to disconnect the snapshot space from org');
  //     if (!confirmed) {
  //       return;
  //     }
  //     await disconnectSnapshotToOrg({
  //       variables: {
  //         orgId,
  //       },
  //     });
  //   };
  //   const handleCheckSnapshotClick = async () => {
  //     await getSnapshotSpaceAndValidateAdmin({ variables: { id: enteredSnapshotId } });
  //   };
  //   return (
  //     <IntegrationsInputsBlock>
  //       <IntegrationsSnapshotBlock>
  //         <LabelBlock>Snapshot Settings</LabelBlock>
  //         {!snapshotConnected && !(isSnapshotAdmin && snapshotSpace?.id) && (
  //           <>
  //             <IntegrationsHelperText>Enter ENS Domain to connect</IntegrationsHelperText>
  //             <IntegrationsSnapshotSubBlock>
  //               <IntegrationsSnapshotInputSubBlock>
  //                 <IntegrationsSnapshotENSInput
  //                   value={enteredSnapshotId}
  //                   placeholder="ENS domain"
  //                   onChange={(e) => setEnteredSnapshotId(e.target.value)}
  //                 />
  //                 {getSnapshotSpaceError && <ErrorText>{getSnapshotSpaceError}</ErrorText>}
  //               </IntegrationsSnapshotInputSubBlock>
  //               <IntegrationsConnectButton onClick={handleCheckSnapshotClick}>Check Snapshot</IntegrationsConnectButton>
  //             </IntegrationsSnapshotSubBlock>
  //           </>
  //         )}
  //         {!snapshotConnected && isSnapshotAdmin && snapshotSpace?.id && (
  //           <IntegrationsConnectButton onClick={handleConnectSnapshotSpace}>
  //             Connect Snapshot {snapshotSpace?.name}
  //           </IntegrationsConnectButton>
  //         )}
  //         {snapshotConnected && (
  //           <>
  //             <IntegrationsHelperText>Snapshot connected:</IntegrationsHelperText>
  //             <IntegrationsSnapshotSubBlock>
  //               <IntegrationsSnapshotInputSubBlock>
  //                 <IntegrationsSnapshotENSInput
  //                   value={orgSnapshot?.snapshotEns}
  //                   // disabled
  //                 />
  //               </IntegrationsSnapshotInputSubBlock>
  //               <IntegrationsDisconnectButton onClick={handlDisconnectSnapshotSpace} disabled={!!podId}>
  //                 Disconnect Snapshot
  //               </IntegrationsDisconnectButton>
  //             </IntegrationsSnapshotSubBlock>
  //           </>
  //         )}
  //       </IntegrationsSnapshotBlock>
  //     </IntegrationsInputsBlock>
  //   );
}

export default SnapshotConfigSection;
