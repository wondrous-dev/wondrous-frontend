import { useMutation, useLazyQuery } from "@apollo/client";
import { makeUniqueId } from "@apollo/client/utilities";
import { Typography, Grid, Box } from "@mui/material";
import { CREATE_ORG_INVITE_LINK } from "graphql/mutations";
import { GET_ORG_ROLES } from "graphql/queries";
import Modal from "components/Shared/Modal";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { Label } from "components/CreateTemplate/styles";
import ImageUpload from "components/ImageUpload";
import { AVATAR_EDITOR_TYPES } from "components/ImageUpload/AvatarEditor";
import { SharedSecondaryButton } from "components/Shared/styles";
import { CopyIcon, CopySuccessIcon } from "components/Icons/copy";
import {CopyContainer} from "components/Settings/TeamSettings/styles";
import { UPDATE_ORG } from "graphql/mutations";
import { useContext, useEffect, useRef, useState } from "react";
import GlobalContext from "utils/context/GlobalContext";
import useAlerts from "utils/hooks";
import { getBaseUrl } from "utils/common";

import { handleImageFile, uploadMedia } from "utils/media";

const ChangeOrgDetails = () => {
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAnchorOrigin } = useAlerts();

  const { activeOrg } = useContext(GlobalContext);
  const [inviteLink, setInviteLink] = useState("");
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  const [createOrgInviteLink] = useMutation(CREATE_ORG_INVITE_LINK, {
    onCompleted: (data) => {
      setInviteLink(`${getBaseUrl()}/invite/${data?.createOrgInviteLink.token}`);
    },
    onError: (e) => {
      console.error(e);
    },
  });

  const [getOrgRoles] = useLazyQuery(GET_ORG_ROLES);
  const handleOnCopy = () => {
    navigator.clipboard.writeText(`${inviteLink}`);
    setCopied(true);
  };

  useEffect(() => {
    getOrgRoles({
      variables: {
        orgId: activeOrg?.id,
      },
    }).then((res) => {
      console.log(res?.data?.getOrgRoles);
      // filter for role with full access permission
      const adminRole = res?.data?.getOrgRoles?.find((role) => role?.permissions?.includes("full_access"));
      if (adminRole) {
        createOrgInviteLink({
          variables: {
            input: {
              invitorId: "",
              type: "public",
              orgId: activeOrg?.id,
              orgRoleId: adminRole?.id,
            },
          },
        });
      }
    });
  }, []);

  const handleCloseModal = () => {
    setInviteModalOpen(false)
    setCopied(false)
  }

  return (
    <Grid container direction="column" gap="24px">
      <Modal open={inviteModalOpen} title="Invite Teammates" onClose={handleCloseModal} maxWidth={600}>
        <div style={{ display: "flex", width: "100%" }}>
          <CustomTextField value={inviteLink} disabled></CustomTextField>
          <CopyContainer $copied={copied} onClick={handleOnCopy}>
          <CopyIcon color={copied ? '#06ffa5' : '#1C9DED'}/>
          </CopyContainer>
        </div>
      </Modal>
      <Box>
        <SharedSecondaryButton onClick={() => setInviteModalOpen(true)}>Invite Teammates</SharedSecondaryButton>
      </Box>
    </Grid>
  );
};

const TeamSettings = () => {
  return (
    <Grid
      flex="1"
      width={{
        xs: "100%",
        sm: "70%",
      }}
    >
      <PanelComponent
        renderHeader={() => (
          <Typography
            fontFamily="Poppins"
            fontSize="12px"
            padding="14px"
            lineHeight="14px"
            fontWeight={600}
            color="#2A8D5C"
          >
            Team Members
          </Typography>
        )}
        renderBody={ChangeOrgDetails}
      />
    </Grid>
  );
};

export default TeamSettings;
