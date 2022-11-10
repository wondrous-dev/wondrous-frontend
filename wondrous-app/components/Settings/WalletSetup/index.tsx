import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { GET_ORG_WALLET, GET_POD_WALLET } from 'graphql/queries/wallet';
import { useWonderWeb3 } from 'services/web3';
import WalletSetupModal from 'components/Settings/WalletSetup/WalletSetupModal';
import HeaderBlock from 'components/Settings/headerBlock';
import { CreateFormPreviewButton } from 'components/CreateEntity/styles';
import SettingsWrapper from 'components/Common/SidebarSettings';
import {
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
} from 'components/Table/styles';
import { TableValueText, WalletsContainer } from './styles';

function Wallets() {
  const router = useRouter();
  const wonderWeb3 = useWonderWeb3();
  const { orgId, podId } = router.query as { orgId: string; podId: string };
  const [wallets, setWallets] = useState([]);
  const [isAddWalletModalOpen, setIsAddWalletModalOpen] = useState(false);
  const [userAddress, setUserAddress] = useState('');

  useEffect(() => {
    if (wonderWeb3?.onConnect) {
      wonderWeb3.onConnect();
    }
  }, []);

  useEffect(() => {
    if (wonderWeb3?.address) setUserAddress(wonderWeb3.address);
  }, [wonderWeb3?.address]);

  const [getOrgWallet, { data, loading, fetchMore }] = useLazyQuery(GET_ORG_WALLET, {
    onCompleted: (data) => {
      setWallets(data?.getOrgWallet);
    },
    fetchPolicy: 'network-only',
  });
  const [getPodWallet] = useLazyQuery(GET_POD_WALLET, {
    onCompleted: (data) => {
      setWallets(data?.getPodWallet);
    },
    fetchPolicy: 'network-only',
  });

  const handleOpenAddWalletModal = () => {
    setIsAddWalletModalOpen(true);
  };

  useEffect(() => {
    if (orgId) {
      getOrgWallet({
        variables: {
          orgId,
        },
      });
    } else if (podId) {
      getPodWallet({
        variables: {
          podId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, podId]);

  return (
    <SettingsWrapper>
      <WalletSetupModal
        isOpen={isAddWalletModalOpen}
        handleClose={() => setIsAddWalletModalOpen(false)}
        userMetamaskAddress={userAddress}
        orgId={orgId}
        podId={podId}
      />
      <WalletsContainer>
        <HeaderBlock
          // icon={<WrenchIcon circle />}
          title="Configure Wallets"
          description="Set up your multisig wallet to pay contributors"
        />
        <StyledTableContainer>
          <StyledTable>
            <StyledTableHead>
              <StyledTableRow>
                <StyledTableCell align="center" width="30%">
                  Name
                </StyledTableCell>
                <StyledTableCell align="center" width="30%">
                  Address
                </StyledTableCell>
                <StyledTableCell align="center" width="40%">
                  Type
                </StyledTableCell>
                <StyledTableCell align="center" width="40%">
                  Chain
                </StyledTableCell>
              </StyledTableRow>
            </StyledTableHead>
            {loading && (
              <div
                style={{
                  textAlign: 'center',
                }}
              >
                <CircularProgress />
              </div>
            )}

            <StyledTableBody>
              {wallets &&
                wallets.map((wallet) => (
                  <StyledTableRow key={wallet?.id}>
                    <StyledTableCell>
                      <TableValueText>{wallet.name}</TableValueText>
                    </StyledTableCell>
                    <StyledTableCell>
                      <TableValueText>{wallet.address}</TableValueText>
                    </StyledTableCell>
                    <StyledTableCell>
                      <TableValueText>{wallet.type}</TableValueText>
                    </StyledTableCell>
                    <StyledTableCell>
                      <TableValueText>{wallet.chain}</TableValueText>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </StyledTableBody>
          </StyledTable>
        </StyledTableContainer>
        <CreateFormPreviewButton
          style={{
            marginLeft: 0,
            marginTop: '32px',
          }}
          onClick={handleOpenAddWalletModal}
        >
          Add wallet
        </CreateFormPreviewButton>
      </WalletsContainer>
    </SettingsWrapper>
  );
}

export default Wallets;
