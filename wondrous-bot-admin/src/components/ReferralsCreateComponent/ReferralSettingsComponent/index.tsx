import { Dispatch, useContext, useMemo } from "react";
import TextField from "components/Shared/TextField";
import CreateQuestContext from "utils/context/CreateQuestContext";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import { Grid } from "@mui/material";
import { Label } from "components/CreateTemplate/styles";
import LevelComponent from "components/AddFormEntity/components/LevelComponent";
import { REFERRAL_STATUSES } from "utils/constants";
import { CampaignOverviewSections } from "components/CreateTemplate/CampaignOverview";
import SelectComponent from "components/Shared/Select";
import useLevels from "utils/levels/hooks";
import { useGlobalContext } from "utils/hooks";
import Switch from "components/Shared/Switch";
import CategorySelectComponent from "components/CreateTemplate/CategorySelectComponent";
import MaxInput from "components/CreateTemplate/MaxInput";
import { validateTypes } from "utils/common";

// endDate
// referrerPointReward
// referredPointReward
// maxPerUser

interface IProps {
  referralItemSettings: any;
  setReferralItemSettings: Dispatch<any>;
}

const ReferralSettingsComponent = ({ referralItemSettings, setReferralItemSettings }: IProps) => {
  const { errors, setErrors } = useContext(CreateQuestContext);

  const { activeOrg } = useGlobalContext();

  const { levels } = useLevels({
    orgId: activeOrg?.id,
  });

  const handleChange = (key, value) => {
    if (errors[key]) {
      setErrors({
        ...errors,
        [key]: null,
      });
    }
    setReferralItemSettings({
      ...referralItemSettings,
      [key]: value,
    });
  };

  const levelsOptions = useMemo(() => {
    return Object.keys(levels).map((key) => ({
      label: levels[key],
      value: key,
    }));
  }, [levels]);

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
          label: "Referal Title",
          component: TextField,
          componentProps: {
            stateKey: "title",
            multiline: false,
          },
          key: "title",
        },
        {
          label: "Description",
          component: TextField,
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
          label: "Level Needed",
          component: SelectComponent,
          key: "level",
          componentProps: {
            options: levelsOptions,
            stateKey: "level",
          },
        },
        {
          label: "Active Referral",
          component: Switch,
          key: "status",
          componentProps: {
            value: referralItemSettings.status === REFERRAL_STATUSES.ACTIVE,
            onChange: (value) => {
              handleChange("status", value ? REFERRAL_STATUSES.ACTIVE : REFERRAL_STATUSES.INACTIVE);
            },
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
          label: "Max Per User",
          component: MaxInput,
          key: "maxPerUser",
        },
        {
          label: "Referrer Point Reward",
          component: TextField,
          componentProps: {
            multiline: false,
            onChange: (value) => {
              const isValid = validateTypes("number", value);
              if (isValid) {
                return handleChange("referrerPointReward", value);
              }
            },
          },
          key: "referrerPointReward",
        },
        {
          label: "Referred Point Reward",
          component: TextField,
          key: "referredPointReward",
          componentProps: {
            multiline: false,
            onChange: (value) => {
              const isValid = validateTypes("number", value);
              if (isValid) {
                return handleChange("referredPointReward", value);
              }
            },
          },
        },
      ],
      settingsLayout: {
        flexDirection: "row",
        alignItems: "center",
      },
    },
    // {
    //   canBeHidden: true,
    //   showBorder: false,
    //   settings: [
    //     {
    //       label: "Category",
    //       component: CategorySelectComponent,
    //       componentProps: {
    //         value: questSettings?.category,
    //       },
    //       key: "category",
    //     },
    //     {
    //       label: "Max Submissions",
    //       component: MaxInput,
    //       componentProps: {
    //         keyValue: questSettings?.maxSubmission,
    //         handleValueChange: (value) => handleChange("maxSubmission", value),
    //         onChange: (value) => {
    //           if (!value && questSettings.maxSubmission) {
    //             return handleChange("maxSubmission", null);
    //           }
    //           return handleChange("maxSubmission", 1);
    //         },
    //       },
    //       key: "maxSubmission",
    //     },
    //     {
    //       label: "Max Approvals",
    //       component: MaxInput,
    //       componentProps: {
    //         keyValue: questSettings?.maxApproval,
    //         onChange: (value) => {
    //           if (!value && questSettings.maxApproval) {
    //             return handleChange("maxApproval", null);
    //           }
    //           return handleChange("maxApproval", 1);
    //         },
    //         handleValueChange: (value) => handleChange("maxApproval", value),
    //       },
    //       key: "maxApproval",
    //     },
    //     {
    //       label: "Time Bound",
    //       component: TimeboundComponent,
    //       key: "timeBound",
    //     },
    //     {
    //       label: "Daily submission",
    //       component: DailySubmissionComponent,
    //       key: "dailySubmission",
    //     },
    //     {
    //       label: "Conditions",
    //       component: DynamicCondition,
    //       key: "questConditions",
    //       componentProps: {
    //         value: questSettings.questConditions,
    //         conditionLogic: questSettings.conditionLogic,
    //         handleUpdate: setQuestSettings,
    //         options: [CONDITION_TYPES.DISCORD_ROLE, CONDITION_TYPES.QUEST],
    //       },
    //     },
    //   ],
    //   settingsLayout: {
    //     flexDirection: "row",
    //     alignItems: "center",
    //   },
    // },
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
            entitySettings={referralItemSettings}
            setEntitySettings={setReferralItemSettings}
          />
        );
      })}
    </>
  );
};

export default ReferralSettingsComponent;
