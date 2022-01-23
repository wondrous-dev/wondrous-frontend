import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';
import { ImageUpload } from '../imageUpload';
import { LinkSquareIcon } from '../linkSquareIcon';
import { InputField } from '../inputField';
import {
  GeneralSettingsButtonsBlock,
  GeneralSettingsContainer,
  GeneralSettingsDAODescriptionBlock,
  GeneralSettingsDAODescriptionInput,
  GeneralSettingsDAODescriptionInputCounter,
  GeneralSettingsDAONameBlock,
  GeneralSettingsDAONameInput,
  GeneralSettingsInputsBlock,
  GeneralSettingsIntegrationsBlock,
  GeneralSettingsIntegrationsBlockButton,
  GeneralSettingsIntegrationsBlockButtonIcon,
  GeneralSettingsResetButton,
  GeneralSettingsSaveChangesButton,
  GeneralSettingsSocialsBlock,
  GeneralSettingsSocialsBlockRow,
  GeneralSettingsSocialsBlockRowLabel,
  GeneralSettingsSocialsBlockWrapper,
  LabelBlock,
  Snackbar,
} from '../styles';
import TwitterPurpleIcon from '../../Icons/twitterPurple';
import LinkedInIcon from '../../Icons/linkedIn';
import OpenSeaIcon from '../../Icons/openSea';
import LinkBigIcon from '../../Icons/link';
import { Discord } from '../../Icons/discord';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_ORG_BY_ID } from '../../../graphql/queries';
import { UPDATE_ORG } from '../../../graphql/mutations/org';
import { getFilenameAndType, uploadMedia } from '../../../utils/media';
import { SafeImage } from '../../Common/Image';
import { UPDATE_USER } from '../../../graphql/mutations';
import { useMe } from '../../Auth/withAuth';

const LIMIT = 200;

const SOCIALS_DATA = [
  {
    icon: <TwitterPurpleIcon />,
    link: 'https://twitter.com/',
    type: 'twitter',
  },
  {
    icon: <LinkedInIcon />,
    link: 'https://linkedin.com/',
    type: 'linkedin',
  },
  {
    icon: <OpenSeaIcon />,
    link: 'https://opensea.io/',
    type: 'opensea',
  },
];

const LINKS_DATA = [
  {
    icon: <LinkBigIcon />,
    label: 'Pitch Deck',
    link: '',
    type: 'pitchDeck',
  },
  {
    icon: <LinkBigIcon />,
    label: 'Our Manifesto',
    link: '',
    type: 'ourManifesto',
  },
];

const GeneralSettings = () => {
  const [logoImage, setLogoImage] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const user = useMe();
  const [bannerImage, setBannerImage] = useState('');
  const [orgLinks, setUserLinks] = useState([]);
  const [descriptionText, setDescriptionText] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });
  const router = useRouter();
  const { orgId } = router.query;

  function setUser(user) {
    setLogoImage('');
    const links = (user.links || []).reduce((acc, link) => {
      acc[link.type] = {
        displayName: link.displayName,
        type: link.type,
        url: link.url,
      };

      return acc;
    }, {});

    setUserLinks(links);
    setDescriptionText(user.bio);

    setUserProfile(user);
  }

  const [getUseranization] = useLazyQuery(GET_ORG_BY_ID, {
    onCompleted: ({ getUserById }) => setUser(getUserById),
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (orgId) {
      getUseranization({ variables: { orgId } });
    }
  }, [user]);

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: ({ updateUser: user }) => {
      setUser(user);
      setToast({ ...toast, message: `User updated successfully.`, show: true });
    },
  });

  async function handleLogoChange(file) {
    setLogoImage(file);

    if (file) {
      const fileName = file?.name;
      // get image preview
      const { fileType, filename } = getFilenameAndType(fileName);
      const imagePrefix = `tmp/${orgId}/`;
      const profilePicture = imagePrefix + filename;
      await uploadMedia({ filename: profilePicture, fileType, file });

      setUserProfile({ ...userProfile, profilePicture });
    }
  }

  function handleDescriptionChange(e) {
    const { value } = e.target;

    if (value.length <= LIMIT) {
      setDescriptionText(value);
      setUserProfile({ ...userProfile, description: value });
    }
  }

  function resetChanges() {
    setUser(user);
  }

  function saveChanges() {
    const links = Object.values(orgLinks);

    updateUser({
      variables: {
        orgId,
        input: {
          links,
          bio: userProfile.description,
          profilePicture: userProfile.profilePicture,
        },
      },
    });
  }

  function handleLinkChange(event, item) {
    const links = { ...orgLinks };
    let url = event.currentTarget.value;
    if (item.link && !url.includes(item.link)) {
      return;
    }

    if (!url.includes('http')) {
      url = `https://${url}`;
    }

    links[item.type] = {
      url,
      displayName: url,
      type: item.type,
    };

    setUserLinks(links);
  }

  if (!userProfile) {
    return (
      <SettingsWrapper>
        <GeneralSettingsContainer>
          <HeaderBlock title="General settings" description="Update profile page settings." />
        </GeneralSettingsContainer>
      </SettingsWrapper>
    );
  }

  return (
    <SettingsWrapper user={true}>
      <GeneralSettingsContainer>
        <Snackbar
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          message={toast.message}
        />

        <HeaderBlock title="General settings" description="Update profile page settings." />
        <GeneralSettingsInputsBlock>
          <GeneralSettingsDAONameBlock>
            {/* <LabelBlock>DAO Name</LabelBlock>
            <GeneralSettingsDAONameInput
              value={orgProfile.name}
              onChange={(e) => setUserProfile({ ...orgProfile, name: e.target.value })}
            /> */}
          </GeneralSettingsDAONameBlock>
          <GeneralSettingsDAODescriptionBlock>
            <LabelBlock>User bio</LabelBlock>
            <GeneralSettingsDAODescriptionInput
              multiline
              rows={3}
              value={descriptionText}
              onChange={(e) => handleDescriptionChange(e)}
            />
            <GeneralSettingsDAODescriptionInputCounter>
              {descriptionText.length} / {LIMIT} characters
            </GeneralSettingsDAODescriptionInputCounter>
          </GeneralSettingsDAODescriptionBlock>
        </GeneralSettingsInputsBlock>
        {userProfile.profilePicture && !logoImage ? (
          <SafeImage
            src={userProfile.profilePicture}
            style={{
              width: '52px',
              height: '52px',
              marginTop: '30px',
            }}
          />
        ) : null}
        <ImageUpload
          image={logoImage}
          imageWidth={52}
          imageHeight={52}
          imageName="Logo"
          updateFilesCb={handleLogoChange}
        />
        {/* <ImageUpload
          image={bannerImage}
          imageWidth={1350}
          imageHeight={259}
          imageName="Banner"
          updateFilesCb={setBannerImage}
        /> */}
        {/* <GeneralSettingsSocialsBlock>
          <LabelBlock>Socials</LabelBlock>
          <GeneralSettingsSocialsBlockWrapper>
            {SOCIALS_DATA.map((item) => {
              const value = orgLinks[item.type] ? orgLinks[item.type].url : item.link;

              return (
                <GeneralSettingsSocialsBlockRow key={item.type}>
                  <LinkSquareIcon icon={item.icon} />
                  <InputField value={value} onChange={(e) => handleLinkChange(e, item)} />
                </GeneralSettingsSocialsBlockRow>
              );
            })}
          </GeneralSettingsSocialsBlockWrapper>
        </GeneralSettingsSocialsBlock> */}
        {/* <GeneralSettingsSocialsBlock>
          <LabelBlock>Links</LabelBlock>
          <GeneralSettingsSocialsBlockWrapper>
            {orgLinks && Object.keys(orgLinks).map((type) => {
              const value = orgLinks[type] ? orgLinks[type].url : item.link;

              return (
                <GeneralSettingsSocialsBlockRow key={item.type}>
                  <LinkSquareIcon icon={item.icon} />
                  <GeneralSettingsSocialsBlockRowLabel>{item.label}</GeneralSettingsSocialsBlockRowLabel>
                  <InputField value={value} onChange={(e) => handleLinkChange(e, item)} />
                </GeneralSettingsSocialsBlockRow>
              );
            })}
          </GeneralSettingsSocialsBlockWrapper>
        </GeneralSettingsSocialsBlock> */}

        {/* <GeneralSettingsIntegrationsBlock>
					<LabelBlock>Integrations</LabelBlock>
					<GeneralSettingsIntegrationsBlockButton highlighted>
						<GeneralSettingsIntegrationsBlockButtonIcon />
						Connect discord
					</GeneralSettingsIntegrationsBlockButton>
				</GeneralSettingsIntegrationsBlock> */}

        <GeneralSettingsButtonsBlock>
          <GeneralSettingsResetButton onClick={resetChanges}>Reset changes</GeneralSettingsResetButton>
          <GeneralSettingsSaveChangesButton
            buttonInnerStyle={{
              fontFamily: 'Space Grotesk',
              fontWeight: 'bold',
            }}
            onClick={saveChanges}
            highlighted
          >
            Save changes
          </GeneralSettingsSaveChangesButton>
        </GeneralSettingsButtonsBlock>
      </GeneralSettingsContainer>
    </SettingsWrapper>
  );
};

export default GeneralSettings;
