import { format } from "date-fns";
import { TYPES } from "./constants";
const QUEST_PAGINATION_LIMIT = 1000;
export const exportQuestSubmissionsToCsv = async ({ exportQuestSubmissionData, questId, loading, setLoading }) => {
  const headers = [
    "submissionCreatedAt",
    "submitterDiscordHandle",
    "submitterTwitterHandle",
    "submitterWeb3Address",
    "approvedAt",
    "rejectedAt",
  ];
  const formatNowTime = format(new Date(), "yyyy-MM-dd");
  setLoading(true);
  const questSubmissionData = await exportQuestSubmissionData({
    variables: {
      questId,
      limit: QUEST_PAGINATION_LIMIT,
      offset: 0,
    },
  });
  let paginateArray = questSubmissionData?.data?.exportQuestSubmissions?.questSubmissions;
  let questSubmissions = questSubmissionData?.data?.exportQuestSubmissions?.questSubmissions;
  while (paginateArray?.length >= QUEST_PAGINATION_LIMIT) {
    const questSubmissionDataContinued = await exportQuestSubmissionData({
      variables: {
        questId,
        limit: QUEST_PAGINATION_LIMIT,
        offset: questSubmissions?.length,
      },
    });
    paginateArray = questSubmissionDataContinued?.data?.exportQuestSubmissions?.questSubmissions;
    questSubmissions = [...questSubmissions, ...paginateArray];
  }
  setLoading(false);
  const questSteps = questSubmissionData?.data?.exportQuestSubmissions?.questSteps;
  questSteps.forEach((questStep) => {
    const questStepType = questStep?.type;
    let questStepTypeString = questStepType?.split("_").join(" ");
    questStepTypeString = questStepTypeString.charAt(0).toUpperCase() + questStepTypeString.slice(1);
    if (questStepType === TYPES.RETWEET || questStepType === TYPES.LIKE_TWEET || questStepType === TYPES.REPLY_TWEET) {
      questStepTypeString = `${questStepTypeString} ${questStep?.additionalData?.tweetLink}`;
    } else if (questStepType === TYPES.FOLLOW_TWITTER) {
      questStepTypeString = `${questStepTypeString} ${questStep?.additionalData?.tweetHandle}`;
    } else if (questStepType === TYPES.TWEET_WITH_PHRASE) {
      questStepTypeString = `${questStepTypeString} ${questStep?.additionalData?.tweetPhrase}`;
    } else if (
      questStepType === TYPES.TEXT_FIELD ||
      questStepType === TYPES.MULTI_QUIZ ||
      questStepType === TYPES.SINGLE_QUIZ ||
      questStepType === TYPES.ATTACHMENTS ||
      questStepType === TYPES.NUMBER ||
      questStepType === TYPES.DATA_COLLECTION ||
      questStepType === TYPES.CONNECT_WALLET
    ) {
      questStepTypeString = `${questStepTypeString} - ${questStep?.prompt}`;
    } else if (questStepType === TYPES.DISCORD_EVENT_ATTENDANCE) {
      questStepTypeString = `${questStepTypeString} - ${questStep?.additionalData?.discordEventId}`;
    } else if (questStepType === TYPES.DISCORD_MESSAGE_IN_CHANNEL) {
      questStepTypeString = `${questStepTypeString} - #${questStep?.additionalData?.discordChannelName}`;
    } else if (questStepType === TYPES.SNAPSHOT_PROPOSAL_VOTE) {
      questStepTypeString = `${questStepTypeString} - ${questStep?.additionalData?.snapshotProposalLink}`;
    } else if (questStepType === TYPES.SNAPSHOT_SPACE_VOTE) {
      questStepTypeString = `${questStepTypeString} - Vote ${questStep?.additionalData?.snapshotVoteTimes} times ${questStep?.additionalData?.snapshotSpaceLink}`;
    } else if (questStepType === TYPES.VERIFY_TOKEN_HOLDING) {
      questStepTypeString = `${questStepTypeString} - ${questStep?.additionalData?.tokenAmount} ${questStep?.additionalData?.tokenName}`;
    } else if (questStepType === TYPES.LINK_CLICK) {
      questStepTypeString = `${questStepTypeString} - ${questStep?.additionalData?.linkClickUrl}`;
    } else if (questStepType === TYPES.LIKE_YT_VIDEO) {
      questStepTypeString = `${questStepTypeString} - ${questStep?.additionalData?.ytVideoLink}`;
    } else if (questStepType === TYPES.SUBSCRIBE_YT_CHANNEL) {
      questStepTypeString = `${questStepTypeString} - ${questStep?.additionalData?.ytChannelLink}`;
    }
    headers.push(`Step ${questStep?.order}: ${questStepTypeString}`);
  });
  const rows = [[headers]];
  if (!questSubmissions) {
    return;
  }
  questSubmissions.forEach((submissionObj) => {
    let submitterDiscordHandle = submissionObj?.submitter?.discordUsername;
    if (submissionObj?.submitter?.discordDiscriminator) {
      submitterDiscordHandle = `${submitterDiscordHandle}#${submissionObj?.submitter?.discordDiscriminator}`;
    }
    const submitterTwitterHandle = submissionObj?.submitter?.twitterInfo?.twitterUsername;
    const submitterLevel = submissionObj?.submitter?.level;
    const submitterPoints = submissionObj?.submitter?.point;
    const submitterWeb3Address = submissionObj?.submitter?.web3Address;
    const submission = submissionObj?.submission;
    const approvedAt = submission?.approvedAt ? format(new Date(submission?.approvedAt), "yyyy-MM-dd") : "";
    const rejectedAt = submission?.rejectedAt ? format(new Date(submission?.rejectedAt), "yyyy-MM-dd") : "";
    let finalArr = [
      format(new Date(submission?.createdAt), "yyyy-MM-dd"),
      submitterDiscordHandle,
      submitterTwitterHandle,
      submitterWeb3Address,
      approvedAt,
      rejectedAt,
    ];
    if (submission?.stepsData) {
      for (let i = 0; i < submission?.stepsData?.length; i++) {
        const extraAdded = {};
        let questStepIndex = 0;
        const submissionStep = submission?.stepsData[i];
        const contentString = JSON.stringify({
          ...(submissionStep?.content && {
            answer: submissionStep?.content,
          }),
          ...(submissionStep?.skipped && {
            skipped: true,
          }),
          ...(!submissionStep.skipped && {
            verified: true,
          }),
          ...(submissionStep?.tweetId && {
            tweetId: submissionStep?.tweetId,
          }),
          ...(submissionStep?.txHash && {
            txHash: submissionStep?.txHash,
          }),
          ...(submissionStep?.selectedValues && {
            selectedValues: JSON.stringify(submissionStep?.selectedValues),
          }),
        });
        const finalContentString = `"${contentString.replace(/\"/g, '""')}"`;
        while (questStepIndex < questSteps?.length && submissionStep?.stepId !== questSteps[questStepIndex]?.id) {
          questStepIndex++;
        }
        if (questStepIndex === questSteps?.length) {
          // The first question no longer exists so we add it later
          if (!(submissionStep?.stepId in extraAdded)) {
            extraAdded[submissionStep?.stepId] = [finalContentString];
          } else {
            extraAdded[submissionStep?.stepId].push(finalContentString);
          }
          let extraIndex = questStepIndex + 7;
          for (const key in extraAdded) {
            // Find the corresponding revmoed step ids
            const keyString = "Removed step ID: " + key;
            if (!rows[0][0].includes(keyString)) {
              rows[0][0].push(keyString);
              finalArr[extraIndex] = extraAdded[key];
              extraIndex++;
            } else {
              const index = rows[0][0].indexOf(keyString);
              finalArr[index] = extraAdded[key];
            }
          }
          continue;
        }
        // There are 6 constant step indices before
        finalArr[questStepIndex + 6] = finalContentString;
      }
    }
    rows.push(finalArr);
  });
  let csvContent = "data:text/csv;charset=utf-8,";
  rows.forEach((rowArray) => {
    const row = rowArray.join(",");
    csvContent += `${row}\r\n`;
  });

  let encodedUri = encodeURI(csvContent);
  encodedUri = encodedUri.replace(/#/g, "%23");
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `wonderverse_contributor_data_${formatNowTime}}.csv`);
  document.body.appendChild(link); // Required for FF
  link.click();
};

export const exportStoreItemPurchasesToCsv = async ({ data }) => {
  const headers = [
    "purchaseCreatedAt",
    "purchaserDiscordHandle",
    "purchaserTelegramHandle",
    "purchaserTwitterHandle",
    "purchaserWeb3Address",
    "discountCode",
    "pointAmount",
  ];
  const formatNowTime = format(new Date(), "yyyy-MM-dd");

  const rows = [[headers]];
  let csvContent = "data:text/csv;charset=utf-8,";
  data.forEach((purchase) => {
    let purchaserDiscordHandle = purchase?.cmtyUser?.discordUsername;
    let purchaserTelegramHandle = purchase?.cmtyUser?.telegramUsername;
    let purchaseCreatedAt = format(new Date(purchase?.createdAt), "yyyy-MM-dd");
    let purchaserTwitterHandle = purchase?.cmtyUser?.twitterInfo?.twitterUsername;
    let purchaserWeb3Address = purchase?.cmtyUser?.web3Address;
    let discountCode = purchase?.discountCode?.code;
    let pointAmount = purchase?.pointAmount;
    let finalArr = [
      purchaseCreatedAt,
      purchaserDiscordHandle,
      purchaserTelegramHandle,
      purchaserTwitterHandle,
      purchaserWeb3Address,
      discountCode,
      pointAmount,
    ];
    rows.push(finalArr);
  });
  rows.forEach((rowArray) => {
    const row = rowArray.join(",");
    csvContent += `${row}\r\n`;
  });
  let encodedUri = encodeURI(csvContent);
  encodedUri = encodedUri.replace(/#/g, "%23");
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `wonderverse_store_item_purchase_data_${formatNowTime}.csv`);
  document.body.appendChild(link); // Required for FF
  link.click();
};
