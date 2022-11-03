import Image from 'next/legacy/image';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { blueColors, white } from 'theme/colors';

import styles, {
  IntiativeText,
  InitiativeContentText,
  InitiativeContentMembershipDiv,
  ExploreProjectsButton,
} from './styles';
import { GR15DEILogo } from './GR15DEILogo';

interface GR15DEIModalProps {
  open: boolean;
  onClose: any;
}

function GR15DEIModal({ open, onClose }: GR15DEIModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: styles.backgroundPaper,
      }}
      sx={styles.white}
    >
      <DialogTitle sx={styles.dialogTitle}>
        <GR15DEILogo
          width="28"
          height="28"
          style={{
            marginRight: '12px',
            marginLeft: '-8px',
          }}
        />
        Intiative Overview
        <Box flex={1} />
        <Box onClick={onClose} sx={styles.closeButton}>
          <Image src="/images/icons/close.svg" alt="close icon" width={8} height={8} />
        </Box>
      </DialogTitle>
      <img src="/images/initiatives/gr15DEI/GR15DEIBanner.svg" alt="gr15 icon" />
      <DialogContent
        style={{
          width: '100%',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
        sx={{ px: 8 }}
      >
        <IntiativeText>
          Wonderverse is excited to partner with Gitcoin supporting their GR-15 DEI program.
        </IntiativeText>
        <InitiativeContentText>
          The DEI Round enables communities to build and fund projects that advance DEI in web3, ensuring individuals
          from all backgrounds have an equal opportunity to participate in the future of the web.
        </InitiativeContentText>
        <InitiativeContentMembershipDiv>
          <div>
            <GR15DEILogo
              style={{
                marginRight: '12px',
              }}
              width="84"
              height="84"
            />
          </div>
          <div>
            <InitiativeContentText>
              If you’re a GR-15 DEI member, you will get a GR-15 badge that grants you exclusive access to bounties,
              tasks, and community events.
            </InitiativeContentText>
            <a
              style={{
                textDecoration: 'none',
                color: white,
              }}
              href="/explore/gr15"
            >
              <ExploreProjectsButton>Explore Projects</ExploreProjectsButton>
            </a>
          </div>
        </InitiativeContentMembershipDiv>
        <InitiativeContentText>
          <span
            style={{
              fontWeight: 'bold',
              marginRight: '4px',
            }}
          >
            Have any questions?
          </span>
          Please hop in our{' '}
          <a
            style={{
              textDecoration: 'none',
              color: blueColors.blue100,
              fontWeight: 'bold',
            }}
            href="https://discord.gg/vAr4cN7UDY"
          >
            Discord
          </a>{' '}
          and drop us a line!
        </InitiativeContentText>
      </DialogContent>
    </Dialog>
  );
}

export default GR15DEIModal;
