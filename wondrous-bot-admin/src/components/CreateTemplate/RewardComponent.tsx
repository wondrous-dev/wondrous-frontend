import { Box, Divider, Grid, Typography } from "@mui/material";
import TextField from "components/Shared/TextField";
import { SharedSecondaryButton } from "components/Shared/styles";
import { CampaignOverviewTitle, Label } from "./styles";
import SelectComponent from "components/Shared/Select";
import { useState } from "react";
import Modal from "components/Shared/Modal";
import { useDiscordRoles } from "utils/discord";
import { useContext } from "react";
import GlobalContext from "utils/context/GlobalContext";
import DeleteIcon from "components/Icons/Delete";
import { useEffect } from "react";
import { GET_ORG_DISCORD_ROLES } from "graphql/queries/discord";
import { useLazyQuery } from "@apollo/client";

const COMPONENT_OPTIONS = [
  {
    label: "Ultimate cool club",
    value: "coolclub",
  },
];

const ExistingDiscordRewardSelectComponent = ({ options, initialReward, setQuestSettings }) => {
  const [reward, setDiscordRoleReward] = useState(null);
  const initialRewardId = initialReward?.discordRewardData?.discordRoleId;
  useEffect(() => {
    if (initialRewardId) {
      setDiscordRoleReward(initialRewardId);
    }
  }, [initialRewardId]);
  return (
    <SelectComponent
      boxStyle={{
        flex: 1,
      }}
      options={options}
      value={reward}
      onChange={(value) => {
        setDiscordRoleReward(value);
        setQuestSettings((prev) => {
          return {
            ...prev,
            rewards: prev.rewards.map((reward) => {
              if (reward.type === "discord_role" && reward.discordRewardData.discordRoleId === initialRewardId) {
                return {
                  ...reward,
                  discordRewardData: {
                    ...reward.discordRewardData,
                    discordRoleId: value,
                  },
                };
              }
              return reward;
            }),
          };
        });
      }}
    />
  );
};

const RewardComponent = ({ rewards, setQuestSettings }) => {
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [discordRoleReward, setDiscordRoleReward] = useState(null);
  const { activeOrg } = useContext(GlobalContext);
  const [getCmtyOrgDiscordRoles, { data: getCmtyOrgDiscordRolesData, variables }] = useLazyQuery(
    GET_ORG_DISCORD_ROLES,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  useEffect(() => {
    getCmtyOrgDiscordRoles({
      variables: {
        orgId: activeOrg?.id,
      },
    });
  }, [activeOrg?.id]);
  console.log("discordRoleData", getCmtyOrgDiscordRolesData);
  const discordRoleData = getCmtyOrgDiscordRolesData?.getCmtyOrgDiscordRoles || [];
  const discordRoles =
    getCmtyOrgDiscordRolesData?.getCmtyOrgDiscordRoles?.length > 0
      ? getCmtyOrgDiscordRolesData?.getCmtyOrgDiscordRoles[0]?.roles
      : [];
  console.log("discordRoles", discordRoles);
  const componentsOptions = discordRoles?.map((role) => ({
    label: role.name,
    value: role.id,
  }));
  const handleChange = (key, value) => {
    setQuestSettings((prev) => {
      return {
        ...prev,
        rewards: prev.rewards.map((reward) => {
          const defaultValue = value ? Number(value) : null;
          return {
            ...reward,
            value: reward.type === key ? defaultValue : reward.value,
          };
        }),
      };
    });
  };

  const onRewardAdd = (reward) => {
    setQuestSettings((prev) => {
      return {
        ...prev,
        rewards: [...prev.rewards, reward],
      };
    });
  };

  const onDiscordRoleRewardRemove = (reward) => {
    setQuestSettings((prev) => {
      const newRewards = prev.rewards.filter((r) => {
        if (r.type === "discord_role") {
          return r.discordRewardData.discordRoleId !== reward.discordRewardData.discordRoleId;
        }
        return true;
      });
      return {
        ...prev,
        rewards: newRewards,
      };
    });
  };
  return (
    <Grid container direction="column" gap="14px" justifyContent="flex-start">
      <Modal
        open={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
        title="Add reward"
        maxWidth={400}
        footerLeft={
          <SharedSecondaryButton
            onClick={() => {
              const discordRoleSelected = componentsOptions.find((option) => option.value === discordRoleReward);
              const discordRoleAlreadyExists = rewards.some(
                (reward) =>
                  reward.type === "discord_role" &&
                  reward.discordRewardData.discordRoleId === discordRoleSelected?.value
              );
              if (!discordRoleAlreadyExists) {
                onRewardAdd({
                  type: "discord_role",
                  discordRewardData: {
                    discordRoleId: discordRoleSelected?.value,
                    discordGuildId: discordRoleData[0]?.guildId,
                    discordRoleName: discordRoleSelected?.label,
                  },
                });
              }
              setIsRewardModalOpen(false);
            }}
          >
            Add reward
          </SharedSecondaryButton>
        }
        footerRight={undefined}
        footerCenter={undefined}
      >
        <Grid display="flex" flexDirection="column" gap="14px">
          <Label>Select role</Label>
          <SelectComponent
            options={componentsOptions}
            value={discordRoleReward}
            onChange={(value) => setDiscordRoleReward(value)}
          />
        </Grid>
      </Modal>

      {rewards?.map((reward, idx) => {
        if (reward.type === "points") {
          return (
            <Grid display="flex" gap="14px" alignItems="center" key={idx}>
              <Typography
                fontFamily="Poppins"
                fontStyle="normal"
                fontWeight={600}
                fontSize="13px"
                lineHeight="15px"
                color="#626262"
                whiteSpace={"nowrap"}
              >
                Points
              </Typography>
              <TextField
                value={reward.value}
                type="number"
                multiline={false}
                onChange={(value) => {
                  handleChange(reward.type, value);
                }}
              />
            </Grid>
          );
        } else if (reward.type === "discord_role") {
          return (
            <Grid display="flex" gap="14px" alignItems="center" key={idx}>
              <Typography
                fontFamily="Poppins"
                fontStyle="normal"
                fontWeight={600}
                fontSize="13px"
                lineHeight="15px"
                color="#626262"
                whiteSpace={"nowrap"}
              >
                Discord role
              </Typography>
              <ExistingDiscordRewardSelectComponent
                options={componentsOptions}
                initialReward={reward}
                setQuestSettings={setQuestSettings}
              />
              <DeleteIcon onClick={() => onDiscordRoleRewardRemove(reward)} />
            </Grid>
          );
        }
        return null;
      })}

      <Divider color="#767676" />
      <Box>
        <SharedSecondaryButton onClick={() => setIsRewardModalOpen(true)}>Add more</SharedSecondaryButton>
      </Box>
    </Grid>
  );
};

const RewardOverviewHeader = () => (
  <Grid
    padding="14px"
    bgcolor="#2A8D5C"
    sx={{
      borderTopLeftRadius: "16px",
      borderTopRightRadius: "16px",
    }}
  >
    <CampaignOverviewTitle>Reward</CampaignOverviewTitle>
  </Grid>
);

export { RewardComponent, RewardOverviewHeader };
