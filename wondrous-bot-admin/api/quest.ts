import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";


/*
This function is designed to run on Vercel's serverless platform. 
The main idea is to serve Open Graph metadata for a quest page. 
When the user clicks and enters the browser, the page will redirect to the quest page.
*/

const graphqlUri = !process.env.VITE_STAGING
  ? process.env.VITE_GRAPHQL_SERVER_URL
  : 'https://apistaging.wonderapp.co/graphql';


const GET_QUEST_BY_ID_QUERY = `
  query getQuestById($questId: ID!) {
    getQuestById(questId: $questId) {
      id
      title
    }
  }
`;

const fetchQuest = async (questId: string) => {
  try {
    const result = await axios({
      url: graphqlUri,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        query: GET_QUEST_BY_ID_QUERY,
        variables: { questId },
      },
    });
    return result.data;
  } catch (error) {
    return console.error(error);
  }
    
};

const handleRequest = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const questId = req.query?.id
    const data = await fetchQuest(questId as string)
    const metadata = {
      title: data?.data?.getQuestById?.title || "Quest",
      image:"/wonder.svg",
      description:"Quests are a fun way to engage your community and reward them for their participation.",
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
        <meta name="twitter:image" content="${metadata.image}" />

        <body>
        <div />
        <script>
          window.onload = function() {
            window.location.href = "/quests/view/${questId}";
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
