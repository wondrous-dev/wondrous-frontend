import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';

import CloseModalIcon from 'components/Icons/closeModal';
import { useEffect, useState } from 'react';
import { ErrorText } from 'components/Common';
import { CreateFormCancelButton, CreateFormPreviewButton } from 'components/CreateEntity/styles';
import styles, { CategoryHeader, CategoryRow, InterestButton, StyledDialogContent } from './styles';

const designCategories = [
  {
    display: '✒️ Graphic Design',
    value: 'graphic_design',
  },
  {
    display: '📱 UI/UX Designer',
    value: 'ui_ux_designer',
  },
  {
    display: '✍️ Writer',
    value: 'writer',
  },
  {
    display: '🔨 Product',
    value: 'product',
  },
];

const growthCategories = [
  {
    display: '🌱 Growth Marketing',
    value: 'growth_marketing',
  },
  {
    display: '🤳 Social Media',
    value: 'social_media',
  },
  {
    display: '🎬 Content Creation',
    value: 'content_creation',
  },
  {
    display: '🎥 Videographer',
    value: 'videographer',
  },
  {
    display: '💀 Memes',
    value: 'memes',
  },
  {
    display: '🔎 SEO',
    value: 'seo',
  },
  {
    display: '📰 Blogs',
    value: 'blogs',
  },
];

const communityCategories = [
  {
    display: '💖 Community Management',
    value: 'community_management',
  },
  {
    display: '📚 Education',
    value: 'education',
  },
  {
    display: '🗣️ Translations',
    value: 'translation',
  },
  {
    display: '💰 Treasury Management',
    value: 'treasury_management',
  },
];

const artCategories = [
  {
    display: '🖼️ NFTs',
    value: 'nft',
  },
  {
    display: '🎶 Music NFT',
    value: 'music_nft',
  },
  {
    display: '📸 Photography',
    value: 'photography',
  },
];

const web3Categories = [
  {
    display: '🌍 DAO Operations',
    value: 'dao_operations',
  },
  {
    display: '🤝 Onboarding Users',
    value: 'onboarding_users',
  },
  {
    display: '🏛️ Governance',
    value: 'governance',
  },
  {
    display: 'DEFI',
    value: 'defi',
  },
  {
    display: 'GAMING',
    value: 'gaming',
  },
];

const engineeringCategories = [
  {
    display: '💻 Devops',
    value: 'devops',
  },
  {
    display: '💻 Frontend',
    value: 'frontend',
  },
  {
    display: '💻 Backend',
    value: 'backend',
  },
  {
    display: 'Smart Contracts',
    value: 'smart_contract',
  },
  {
    display: 'Distributed Systems',
    value: 'distributed_system',
  },
  {
    display: '📊 Data Science',
    value: 'data_science',
  },
];

const ALL_INTERESTS = [
  ...engineeringCategories,
  ...web3Categories,
  ...artCategories,
  ...communityCategories,
  ...growthCategories,
  ...designCategories,
];
export const getInterestDisplay = (interest) => {
  for (let i = 0; i < ALL_INTERESTS.length; i++) {
    if (ALL_INTERESTS[i].value === interest) {
      return ALL_INTERESTS[i].display;
    }
  }
};
export function UserInterestModal({ open, onClose, createUserInterest, existingInterests }) {
  const [interests, setInterests] = useState({});
  const [interestSelectError, setInterestSelectError] = useState(null);
  const saveUnsaveInterest = (interest) => {
    if (interest in interests) {
      delete interests[interest];
      const newObj = { ...interests };
      setInterests(newObj);
    } else {
      interests[interest] = true;
      const newObj = { ...interests };
      setInterests(newObj);
    }
  };

  useEffect(() => {
    if (existingInterests && existingInterests.length > 0) {
      const newObj = {};
      for (const existingInterest of existingInterests) {
        newObj[existingInterest] = true;
      }
      setInterests(newObj);
    }
  }, [existingInterests, open]);

  const handleClose = () => {
    setInterests({});
    onClose();
  };

  const handlSaveUserInterestClick = () => {
    if (interests && Object.keys(interests)?.length > 8) {
      setInterestSelectError('Select up to 8 interests');
      return;
    }
    createUserInterest({
      variables: {
        interests: Object.keys(interests),
      },
    }).then(() => {
      handleClose();
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: styles.backgroundPaper,
      }}
    >
      <DialogTitle sx={styles.dialogTitle}>
        Select your interests
        <Box flex={1} />
        <IconButton onClick={onClose} style={styles.closeButton}>
          <CloseModalIcon style={styles.closeButtonIcon} />
        </IconButton>
      </DialogTitle>
      <StyledDialogContent>
        <CategoryHeader>Design</CategoryHeader>
        <CategoryRow>
          {designCategories.map((interest) => (
            <InterestButton
              style={{
                background: interest.value in interests ? '#7427FF' : '#232323',
              }}
              onClick={() => saveUnsaveInterest(interest.value)}
              key={interest.value}
            >
              {interest?.display}
            </InterestButton>
          ))}
        </CategoryRow>
        <CategoryHeader>Growth</CategoryHeader>
        <CategoryRow>
          {growthCategories.map((interest) => (
            <InterestButton
              style={{
                background: interest.value in interests ? '#7427FF' : '#232323',
              }}
              onClick={() => saveUnsaveInterest(interest.value)}
              key={interest.value}
            >
              {interest?.display}
            </InterestButton>
          ))}
        </CategoryRow>
        <CategoryHeader>Community</CategoryHeader>
        <CategoryRow>
          {communityCategories.map((interest) => (
            <InterestButton
              style={{
                background: interest.value in interests ? '#7427FF' : '#232323',
              }}
              onClick={() => saveUnsaveInterest(interest.value)}
              key={interest.value}
            >
              {interest.display}
            </InterestButton>
          ))}
        </CategoryRow>
        <CategoryHeader>Art</CategoryHeader>
        <CategoryRow>
          {artCategories.map((interest) => (
            <InterestButton
              style={{
                background: interest.value in interests ? '#7427FF' : '#232323',
              }}
              onClick={() => saveUnsaveInterest(interest.value)}
              key={interest.value}
            >
              {interest.display}
            </InterestButton>
          ))}
        </CategoryRow>
        <CategoryHeader>Web3</CategoryHeader>
        <CategoryRow>
          {web3Categories.map((interest) => (
            <InterestButton
              style={{
                background: interest.value in interests ? '#7427FF' : '#232323',
              }}
              onClick={() => saveUnsaveInterest(interest.value)}
              key={interest.value}
            >
              {interest.display}
            </InterestButton>
          ))}
        </CategoryRow>
        <CategoryHeader>Engineering</CategoryHeader>
        <CategoryRow>
          {engineeringCategories.map((interest) => (
            <InterestButton
              style={{
                background: interest.value in interests ? '#7427FF' : '#232323',
              }}
              onClick={() => saveUnsaveInterest(interest.value)}
              key={interest.value}
            >
              {interest.display}
            </InterestButton>
          ))}
        </CategoryRow>
      </StyledDialogContent>
      <DialogActions>
        {interestSelectError && <ErrorText>{interestSelectError}</ErrorText>}

        <CreateFormCancelButton>Cancel</CreateFormCancelButton>
        <CreateFormPreviewButton onClick={handlSaveUserInterestClick}>Save</CreateFormPreviewButton>
      </DialogActions>
    </Dialog>
  );
}
