import { Box, Grid, Typography } from "@mui/material";
import OnboardingComponent from "components/AddFormEntity/components/OnboardingComponent";
import DynamicCondition from "components/DynamicCondition";
import ArrowDropDownIcon from "components/Icons/ArrowDropDown";
import SortIcon from "components/Icons/SortIcon";
import QuestTitle from "components/QuestTitle";
import SelectComponent from "components/Shared/Select";
import Switch from "components/Shared/Switch";
import ToggleComponent from "components/Shared/Toggle";
import { useContext, useMemo, useState } from "react";
import CreateQuestContext from "utils/context/CreateQuestContext";
import GlobalContext from "utils/context/GlobalContext";
import useLevels from "utils/levels/hooks";
import MaxInput from "./MaxInput";
import TimeboundComponent from "./TimeboundComponent";
import { CampaignOverviewTitle, ExtraFeaturesWrapper, Label } from "./styles";
import DailySubmissionComponent from "./DailySubmission";
import { CONDITION_TYPES } from "utils/constants";
import CategorySelectComponent from "./CategorySelectComponent";
import InfoLabel from "./InfoLabel";
import LevelComponent from "components/AddFormEntity/components/LevelComponent";

const REQUIRE_REVIEW_OPTIONS = [
  {
    label: "Yes",
    value: true,
  },
  {
    label: "No",
    value: false,
  },
];

export const CampaignOverviewSections = ({
  canBeHidden = false,
  settingsLayout,
  settings,
  showBorder = true,
  errors,
  entitySettings,
  setEntitySettings,
  handleChange,
}) => {
  const [show, setShow] = useState(!canBeHidden);
  return (
    <Grid
      container
      flexDirection="column"
      borderBottom={showBorder && `1px solid #E8E8E8`}
      paddingBottom={showBorder && "24px"}
      className={canBeHidden ? "tutorial-quest-settings-expanded" : null}
      gap={show ? "14px" : "0px"}
    >
      {canBeHidden && (
        <Grid
          container
          item
          alignItems="center"
          justifyContent="space-between"
          sx={{ cursor: "pointer" }}
          onClick={() => setShow((prev) => !prev)}
        >
          <Grid container item alignItems="center" gap="10px" width="fit-content">
            <Typography color="#626262" fontWeight="600" fontFamily="Poppins" fontSize="13px">
              {show ? "Hide" : "Show"} Extra Features
            </Typography>
          </Grid>
          <Grid
            container
            item
            width="30px"
            height="30px"
            alignItems="center"
            justifyContent="center"
            borderRadius="6px"
            border="1px solid #828282"
            sx={{
              transform: show && "rotate(180deg)",
            }}
          >
            <ArrowDropDownIcon fill="black" />
          </Grid>
        </Grid>
      )}
      <ExtraFeaturesWrapper container item show={show} className={canBeHidden ? 'quest-settings-test-1' : null}>
        {settings.map(({ label, component: Component, key, componentProps = {}, wrapperProps = {} }) => {
          if (!show) return null;
          return (
            <Grid
              container
              key={key}
              {...wrapperProps}
              {...settingsLayout}
              style={{
                ...(key === "questConditions" && {
                  alignItems: "baseline",
                }),
              }}
            > 
            {/* //TODO: check back the minWidth */}
              <Label minWidth="190px">{label}</Label>
              <Grid container item flex="1">
                <Box display="flex" alignItems="center" width="100%">
                  {Component ? (
                    <Component
                      onChange={(value) => handleChange(key, value)}
                      error={errors[key]}
                      stateKey={key}
                      value={entitySettings[key]}
                      entitySettings={entitySettings}
                      setEntitySettings={setEntitySettings}
                      {...componentProps}
                    />
                  ) : null}
                  <InfoLabel stateKey={key} />
                </Box>
              </Grid>
            </Grid>
          );
        })}
      </ExtraFeaturesWrapper>
    </Grid>
  );
};

const CampaignOverview = ({ questSettings, setQuestSettings }) => {
  const { activeOrg } = useContext(GlobalContext);
  const { errors, setErrors } = useContext(CreateQuestContext);
  const handleChange = (key, value) => {
    if (errors[key]) {
      setErrors({
        ...errors,
        [key]: null,
      });
    }
    setQuestSettings({
      ...questSettings,
      [key]: value,
    });
  };

  const sections: {
    canBeHidden?: boolean;
    showBorder?: boolean;
    settings: {
      label: string;
      component: (props) => JSX.Element;
      componentProps?: { [key: string]: any };
      key: string;
      wrapperProps?: { [key: string]: string };
    }[];
    settingsLayout: { [key: string]: string };
  }[] = [
    {
      settings: [
        {
          label: "Quest Title",
          component: QuestTitle,
          componentProps: {
            stateKey: "title",
          },
          key: "title",
        },
        {
          label: "Description",
          component: QuestTitle,
          componentProps: {
            placeholder: "Describe the quest",
            stateKey: "description",
            multiline: true,
            showMaxLength: true,
          },
          key: "description",
        },
      ],
      settingsLayout: {
        flexDirection: "column",
        gap: "14px",
      },
    },
    {
      settings: [
        {
          label: "Onboarding Quest",
          component: OnboardingComponent,
          key: "isOnboarding",
        },
        {
          label: "Level Requirement",
          component: LevelComponent,
          key: "level",
        },
        {
          label: "Require Review",
          component: ToggleComponent,
          key: "requireReview",
          componentProps: {
            options: REQUIRE_REVIEW_OPTIONS,
            fullWidth: true,
          },
        },
        {
          label: "Active Quest",
          component: Switch,
          key: "isActive",
          wrapperProps: {
            "data-tour": "tutorial-activate-quest",
          },
        },
      ],
      settingsLayout: {
        flexDirection: "row",
        alignItems: "center",
      },
    },
    {
      canBeHidden: true,
      showBorder: false,
      settings: [
        {
          label: "Category",
          component: CategorySelectComponent,
          componentProps: {
            value: questSettings?.category,
          },
          key: "category",
        },
        {
          label: "Max Submissions",
          component: MaxInput,
          componentProps: {
            keyValue: questSettings?.maxSubmission,
            handleValueChange: (value) => handleChange("maxSubmission", value),
            onChange: (value) => {
              if (!value && questSettings.maxSubmission) {
                return handleChange("maxSubmission", null);
              }
              return handleChange("maxSubmission", 1);
            },
          },
          key: "maxSubmission",
        },
        {
          label: "Max Approvals",
          component: MaxInput,
          componentProps: {
            keyValue: questSettings?.maxApproval,
            onChange: (value) => {
              if (!value && questSettings.maxApproval) {
                return handleChange("maxApproval", null);
              }
              return handleChange("maxApproval", 1);
            },
            handleValueChange: (value) => handleChange("maxApproval", value),
          },
          key: "maxApproval",
        },
        {
          label: "Time Bound",
          component: TimeboundComponent,
          key: "timeBound",
        },
        {
          label: "Daily submission",
          component: DailySubmissionComponent,
          key: "dailySubmission",
        },
        {
          label: "Conditions",
          component: DynamicCondition,
          key: "questConditions",
          componentProps: {
            questId: questSettings.id,
            value: questSettings.questConditions,
            conditionLogic: questSettings.conditionLogic,
            handleUpdate: setQuestSettings,
            options: [CONDITION_TYPES.DISCORD_ROLE, CONDITION_TYPES.QUEST],
          },
        },
      ],
      settingsLayout: {
        flexDirection: "row",
        alignItems: "center",
      },
    },
  ];

  return (
    <>
      {sections.map(({ canBeHidden, settingsLayout, settings, showBorder }) => {
        return (
          <CampaignOverviewSections
            canBeHidden={canBeHidden}
            settingsLayout={settingsLayout}
            settings={settings}
            showBorder={showBorder}
            handleChange={handleChange}
            errors={errors}
            entitySettings={questSettings}
            setEntitySettings={setQuestSettings}
          />
        );
      })}
    </>
  );
};

const CampaignOverviewHeader = ({ title = "Quest Settings" }) => (
  <Grid
    padding="14px"
    bgcolor="#2A8D5C"
    sx={{
      borderTopLeftRadius: "16px",
      borderTopRightRadius: "16px",
    }}
  >
    <CampaignOverviewTitle>{title}</CampaignOverviewTitle>
  </Grid>
);

export { CampaignOverview, CampaignOverviewHeader };
