import { useMutation, useLazyQuery } from "@apollo/client";
import { makeUniqueId } from "@apollo/client/utilities";
import { Typography, Grid, Box } from "@mui/material";
import { CREATE_ORG_INVITE_LINK, KICK_ORG_USER } from "graphql/mutations";
import { GET_ORG_ADMINS, GET_ORG_ROLES } from "graphql/queries";
import Modal from "components/Shared/Modal";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { Label } from "components/CreateTemplate/styles";
import ImageUpload from "components/ImageUpload";
import { AVATAR_EDITOR_TYPES } from "components/ImageUpload/AvatarEditor";
import { SharedSecondaryButton } from "components/Shared/styles";
import { CopyIcon, CopySuccessIcon } from "components/Icons/copy";
import { AdminUsernameText, CopyContainer, InviteMemberContainer } from "components/Settings/TeamSettings/styles";
import { UPDATE_ORG } from "graphql/mutations";
import { useContext, useEffect, useRef, useState } from "react";
import GlobalContext from "utils/context/GlobalContext";
import EditSvg from "components/Icons/edits.svg";
import { getBaseUrl } from "utils/common";
import { usePaywall, useSubscription } from "utils/hooks";
import { handleImageFile, uploadMedia } from "utils/media";
import SafeImage from "components/SafeImage";
import Dropdown from "components/Shared/Dropdown";
import { Wrapper } from "components/Shared/Dropdown/styles";
import { PricingOptionsTitle, getPlan } from "components/Pricing/PricingOptionsListItem";

export const TeamsAndInvite = ({ adminNumbers }) => {
  const { activeOrg } = useContext(GlobalContext);
  const [inviteLink, setInviteLink] = useState("");
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const subscription = useSubscription();
  const { setPaywall, setPaywallMessage } = usePaywall();
  const plan = getPlan(subscription?.tier);
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
    setInviteModalOpen(false);
    setCopied(false);
  };

  return (
    <Grid container direction="column" gap="24px">
      <Modal open={inviteModalOpen} title="Invite Admins" onClose={handleCloseModal} maxWidth={600}>
        <div style={{ display: "flex", width: "100%" }}>
          <CustomTextField value={inviteLink} disabled></CustomTextField>
          <CopyContainer $copied={copied} onClick={handleOnCopy}>
            <CopyIcon color={copied ? "#06ffa5" : "#1C9DED"} />
          </CopyContainer>
        </div>
      </Modal>
      <Box justifyContent={"center"} display={"flex"}>
        <SharedSecondaryButton
          onClick={() => {
            // Add paywall
            if (
              import.meta.env.NODE_ENV !== "production" &&
              ((plan === PricingOptionsTitle.Basic && adminNumbers >= 1) ||
                (plan === PricingOptionsTitle.Hobby && adminNumbers >= 2) ||
                (plan === PricingOptionsTitle.Premium && adminNumbers >= 10))
            ) {
              setPaywall(true);
              setPaywallMessage("You have reached the limit of admins for your current plan.");
            } else {
              setInviteModalOpen(true);
            }
          }}
        >
          Invite Admins
        </SharedSecondaryButton>
      </Box>
    </Grid>
  );
};

const TeamAdmin = ({ admin, orgId }) => {
  const [kickAdmin] = useMutation(KICK_ORG_USER, {
    refetchQueries: ["getOrgAdmins"],
  });
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      padding={"22px"}
      bgcolor={"white"}
      borderRadius={"16px"}
      gap={"14px"}
      marginTop="16px"
    >
      <SafeImage
        src={admin?.profilePicture}
        width={40}
        height={40}
        style={{ borderRadius: "50%", marginRight: "8px" }}
      />
      <AdminUsernameText>{admin?.username || admin?.userInfo?.email}</AdminUsernameText>
      <div
        style={{
          flex: 1,
        }}
      />
      <Dropdown
        DropdownHandler={() => (
          <img
            style={{
              cursor: "pointer",
            }}
            src={EditSvg}
          />
        )}
      >
        <Wrapper
          onClick={() => {
            kickAdmin({
              variables: {
                userId: admin?.id,
                orgId,
              },
            });
          }}
          style={{
            zIndex: 120,
          }}
        >
          Remove Admin
        </Wrapper>
      </Dropdown>
    </Box>
  );
};

const TeamSettings = () => {
  const [getOrgAdmins, { data: orgAdminData }] = useLazyQuery(GET_ORG_ADMINS);
  const { activeOrg } = useContext(GlobalContext);
  useEffect(() => {
    if (activeOrg?.id) {
      getOrgAdmins({
        variables: {
          orgId: activeOrg?.id,
        },
      });
    }
  }, [activeOrg?.id]);
  const orgAdmins = orgAdminData?.getOrgAdmins || [];
  console.log("orgAdmins", orgAdmins);
  return (
    <Grid
      flex="1"
      width={{
        xs: "100%",
        sm: "70%",
      }}
    >
      <>
        <InviteMemberContainer>
          <TeamsAndInvite adminNumbers={orgAdmins?.length} />
        </InviteMemberContainer>
        {orgAdmins?.map((admin) => (
          <TeamAdmin admin={admin} orgId={activeOrg?.id} />
        ))}
      </>
    </Grid>
  );
};

export default TeamSettings;
