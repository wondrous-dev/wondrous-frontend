import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

/*
This function is designed to run on Vercel's serverless platform. 
The main idea is to serve Open Graph metadata for a referral page. 
When the user clicks and enters the browser, the page will redirect to the referral page.
*/

const graphqlUri = !process.env.VITE_STAGING
  ? process.env.VITE_GRAPHQL_SERVER_URL
  : "https://apistaging.wonderapp.co/graphql";

const GET_REFERRAL_CAMPAIGN_BY_EXTERNAL_ID = `
  query getReferralCampaignByReferralExternalId($referralCampaignExternalId: String!) {
    getReferralCampaignByReferralExternalId(referralCampaignExternalId: $referralCampaignExternalId) {
      id
      name
      description
      media {
        slug
      }
    }
  }
`;

const GET_PREVIEW_FILE = `
  query getPreviewFile($path: String!) {
    getPreviewFile(path: $path) {
      url
    }
  }
`;

const fetchReferral = async (referralCampaignExternalId: string) => {
  try {
    const result = await axios({
      url: graphqlUri,
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        query: GET_REFERRAL_CAMPAIGN_BY_EXTERNAL_ID,
        variables: { referralCampaignExternalId },
      },
    });
    return result.data;
  } catch (error) {
    return console.error(error);
  }
};

const handleRequest = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const referralCode = req.query?.referralCode;
    const referralCampaignExternalId = req.query?.referralCampaignExternalId;
    const data = await fetchReferral(referralCampaignExternalId as string);
    const referralData = data?.data?.getReferralCampaignByReferralExternalId;
    let referralImage = null;
    const mediaItem = referralData?.media?.[0]?.slug;
    if (mediaItem) {
      try {
        const mediaResult = await axios({
          url: graphqlUri,
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            query: GET_PREVIEW_FILE,
            variables: { path: mediaItem },
          },
        });
        const mediaUrl = mediaResult.data?.data?.getPreviewFile?.url;
        if (mediaUrl) {
          referralImage = mediaUrl;
        }
      } catch (error) {
        console.log(error, "err");
      }
    }

    const metadata = {
      title: referralData?.name || "Referral",
      image: referralImage || "/og-start-quest.png",
      description:
        referralData?.description ||
        "Referrals are a fun way to engage your community and reward them for their participation.",
    };

    const html = `
      <head>
        <title>${metadata.title}</title>
        <meta property="og:image" content="${metadata.image}" />
        <meta property="og:description" content="${metadata.description}" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@wonderverse_xyz" />
        <meta name="twitter:title" content="${metadata.title}" />
        <meta name="twitter:description" content="${metadata.description}" />
        <meta name="twitter:image" content=${referralImage || "/twitter-og-start.png"} />

        <body>
        <div id="root"></div>

        <script>
          window.onload = function() {
            window.location.href = "/referral-campaign?referralCode=${referralCode}&referralCampaignExternalId=${referralCampaignExternalId}";
        }
        </script>
        </body>
      </head>
    `;
    res.send(html);
  } catch (error) {
    res.status(500).send("An error occurred while processing your request.");
  }
};

export default handleRequest;
